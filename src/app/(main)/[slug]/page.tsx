import { Metadata } from "next";
import StarTechCategoryView from "./StarTechCategoryView";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalized = decodeURIComponent(slug || "")
    .toLowerCase()
    .trim()
    .replace(/[-_\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const decoded = (normalized || "Products")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${decoded} Price in Bangladesh | Tech Mahmud`,
    description: `Buy authentic ${decoded} products at best price in Bangladesh from Tech Mahmud. Check latest price list, warranty, and fast nationwide delivery.`,
    openGraph: {
      title: `${decoded} | Tech Mahmud Bangladesh`,
      description: `Explore latest ${decoded} with official warranty and fast home delivery across Bangladesh.`,
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <StarTechCategoryView slug={slug} />;
}
