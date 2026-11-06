import { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "./_component/SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    brandName?: string;
    filter?: string;
    type?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const brand = params.brand;
  const filter = params.filter;
  const type = params.type;
  const q = params.q;

  let title = "Search Products | Tech Mahmud";
  let description =
    "Find authentic smartphones, laptops, electronics, smart gadgets, and fashion at Tech Mahmud in Bangladesh.";

  if (brand) {
    const formattedBrand = (params.brandName || brand)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    title = `${formattedBrand} Products | Tech Mahmud`;
    description = `Buy authentic ${formattedBrand} products online from Tech Mahmud. Fast home delivery across Bangladesh.`;
  } else if (filter === "featured") {
    title = "Featured Products | Tech Mahmud";
    description =
      "Discover our handpicked featured gadgets and top electronics at Tech Mahmud.";
  } else if (type === "combo") {
    title = "Combo Packs & Value Deals | Tech Mahmud";
    description =
      "Save more with tech & lifestyle combo packages and exclusive daily deals at Tech Mahmud.";
  } else if (q) {
    title = `Search: "${q}" | Tech Mahmud`;
    description = `Explore products matching "${q}" at Tech Mahmud with official warranty and fast delivery.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageClient query={q} />
    </Suspense>
  );
}