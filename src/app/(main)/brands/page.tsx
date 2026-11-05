import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { FiChevronRight, FiArrowRight, FiAward } from "react-icons/fi";
import { serverFetch } from "@/services/api";

export const metadata: Metadata = {
  title: "All Brands | Tech Mahmud - Quality Brands & Producers",
  description:
    "Explore all trusted brands and quality tech & lifestyle producers partnering with Tech Mahmud in Dhaka, Bangladesh.",
};

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  status: string;
  productCount: number;
}

export default async function BrandsPage() {
  const brandsResponse = await serverFetch<any>(
    "/brands?status=active&isDeleted=false&limit=100",
    { tags: ["brands"] }
  );

  const brands: Brand[] = brandsResponse?.data || [];

  return (
    <div className="bg-[#fbfcfa] min-h-screen font-['Poppins']">
      {/* Header & Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <span className="text-gray-900">All Brands</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full mb-2">
                <FiAward size={14} /> Authentic Partners
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Our Trusted <span className="text-[var(--color-primary)]">Brands</span>
              </h1>
              <p className="mt-1.5 text-gray-500 text-xs sm:text-sm max-w-xl">
                Browse our verified brands and producer partners for 100% genuine kitchen essentials and daily groceries.
              </p>
            </div>

            <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 self-start sm:self-auto">
              Total {brands.length} Brands Available
            </div>
          </div>
        </div>
      </div>

      {/* Brand Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
        {brands.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 max-w-md mx-auto">
            <p className="text-gray-500 text-sm">No active brands available right now.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/search?brand=${brand.slug || brand.name?.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block bg-white border border-gray-100/90 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center"
              >
                {/* Logo Box */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-3">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name || "Brand logo"}
                      width={80}
                      height={80}
                      className="object-contain max-h-16 max-w-16 sm:max-h-20 sm:max-w-20 transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-black text-2xl flex items-center justify-center uppercase">
                      {brand.name?.slice(0, 1)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 capitalize group-hover:text-[var(--color-primary)] transition-colors mb-1">
                  {brand.name}
                </h3>
                <p className="text-xs text-[var(--color-primary)] font-semibold truncate w-full">
                  {brand.productCount > 0
                    ? `${brand.productCount} ${brand.productCount === 1 ? "Product" : "Products"}`
                    : "View Products"}
                </p>

                {/* Arrow indicator on hover */}
                <div className="mt-3 pt-2.5 border-t border-gray-50 w-full flex items-center justify-center gap-1 text-xs font-semibold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Browse Products</span>
                  <FiArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
