import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return handleRevalidate(req);
}

export async function POST(req: NextRequest) {
  return handleRevalidate(req);
}

async function handleRevalidate(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    // Expected secret token from env or default secure fallback
    const expectedSecret = process.env.REVALIDATION_SECRET || 'techmahmud_secret_revalidate_2026';

    if (secret && secret !== expectedSecret) {
      return NextResponse.json({ success: false, message: 'Invalid secret token' }, { status: 401 });
    }

    if (tag) {
      (revalidateTag as any)(tag, 'default');
    }

    if (path) {
      revalidatePath(path);
    } else {
      // Default: revalidate home page
      revalidatePath('/', 'page');
    }

    if (!tag) {
      try {
        (revalidateTag as any)('products', 'default');
      } catch {
        // Tag revalidation fallback
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tag: tag || 'products',
      path: path || '/',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Revalidation failed' },
      { status: 500 }
    );
  }
}
