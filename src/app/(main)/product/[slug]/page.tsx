import { Metadata } from "next";
import ProductDetailsClient from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedTitle = decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${decodedTitle} | Tech Mahmud - Gadgets & Clothing`,
    description: `Buy ${decodedTitle} online at the best price in Bangladesh from Tech Mahmud. 100% authentic, fast delivery, and warranty support.`,
    openGraph: {
      title: `${decodedTitle} | Tech Mahmud`,
      description: `Buy ${decodedTitle} online at best price with cash on delivery in Bangladesh.`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetailsClient slug={slug} />;
}
