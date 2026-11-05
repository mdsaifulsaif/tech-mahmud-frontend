import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { FiChevronRight, FiArrowRight } from "react-icons/fi";
import { BiLeaf } from "react-icons/bi";
import { serverFetch } from "@/services/api";

export const metadata: Metadata = {
  title: "All Categories | Tech Mahmud - Fresh Daily Groceries in Dhaka",
  description:
    "Explore all tech & lifestyle and fresh food categories at Tech Mahmud Dhaka. From fresh vegetables to kitchen spices, cooking essentials, and dairy items.",
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status: string;
  productCount: number;
}

export default async function CategoriesPage() {
  const categoriesResponse = await serverFetch<any>(
    "/categories?status=active&isDeleted=false&limit=100",
    { tags: ["categories"] }
  );

  const categories: Category[] = categoriesResponse?.data || [];

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
            <span className="text-gray-900">All Categories</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full mb-2">
                <BiLeaf size={14} /> Fresh & Authentic
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Product <span className="text-[var(--color-primary)]">Categories</span>
              </h1>
              <p className="mt-1.5 text-gray-500 text-xs sm:text-sm max-w-xl">
                Explore our wide collection of fresh vegetables, daily groceries, kitchen spices, and household essentials.
              </p>
            </div>

            <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-150 self-start sm:self-auto">
              Total {categories.length} Categories Available
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 max-w-md mx-auto">
            <p className="text-gray-500 text-sm">No active categories available right now.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/cat/${category.slug}`}
                className="group block bg-white border border-gray-100/90 rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center"
              >
                {/* Image Container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f8f9fa] flex items-center justify-center mb-3 overflow-hidden p-2">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name || "Category icon"}
                      width={80}
                      height={80}
                      className="object-contain max-h-16 max-w-16 sm:max-h-20 sm:max-w-20 transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg viewBox="0 0 100 100" className="h-10 w-10 sm:h-12 sm:w-12">
                        <ellipse cx="50" cy="70" rx="30" ry="9" fill="#c89b5c" />
                        <circle cx="50" cy="45" r="18" fill="var(--color-primary)" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 capitalize group-hover:text-[var(--color-primary)] transition-colors mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-[var(--color-primary)] font-semibold truncate w-full">
                  {category.productCount > 0
                    ? `${category.productCount} ${category.productCount === 1 ? "Item" : "Items"}`
                    : "View Items"}
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
