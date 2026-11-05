// src/services/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export interface ServerFetchOptions extends RequestInit {
  tags?: string[];
  revalidate?: number | false;
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T | null> {
  try {
    const { tags, revalidate, ...restOptions } = options;

    let fetchOptions: RequestInit;

    if (restOptions.cache === 'no-store') {
      // 'no-store' must never have next.revalidate or conflicting caching headers
      fetchOptions = {
        ...restOptions,
      };
    } else {
      const nextConfig: any = {
        ...(tags && tags.length > 0 ? { tags } : {}),
        revalidate: revalidate !== undefined ? revalidate : 60,
      };

      fetchOptions = {
        cache: 'force-cache',
        next: nextConfig,
        ...restOptions,
      };
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Server Fetch Error (${endpoint}):`, error);
    return null;
  }
}