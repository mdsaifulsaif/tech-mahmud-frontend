import { Metadata } from "next";
import CategoryPageClient from "../_component/CategoryPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${categoryName} - Best Products in Bangladesh`,
    description: `Shop for ${categoryName} products at best prices. Get fresh, quality products delivered to your doorstep.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}