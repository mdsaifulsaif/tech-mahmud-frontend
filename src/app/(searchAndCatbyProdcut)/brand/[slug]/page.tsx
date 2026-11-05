import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brandTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${brandTitle} Products | Tech Mahmud`,
    description: `Shop authentic ${brandTitle} products online at Tech Mahmud Dhaka.`,
  };
}

export default async function BrandSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/search?brand=${encodeURIComponent(slug)}`);
}
