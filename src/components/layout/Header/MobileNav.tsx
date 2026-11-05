"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategoriesQuery } from "@/lib/api/queries";
import { useWishlist } from "@/context/WishlistContext";

interface MobileNavProps {
  onClose: () => void;
}

export default function MobileNav({ onClose }: MobileNavProps) {
  const { totalWishlistItems: wishlistCount } = useWishlist();

  // API থেকে ক্যাটাগরি ফেচ করা (TanStack Query)
  const { data: categoryData, isLoading } = useCategoriesQuery();
  const categories = categoryData?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/track-order"
          onClick={onClose}
          className="flex items-center justify-between p-2.5 rounded-sm bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)]/20 transition-all"
        >
          <span>🚚 Track Order</span>
          <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-sm">Live</span>
        </Link>
        <Link
          href="/my-orders"
          onClick={onClose}
          className="flex items-center gap-2 p-2.5 rounded-sm text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all"
        >
          <span>📦 My Orders</span>
        </Link>
        <Link
          href="/wishlist"
          onClick={onClose}
          className="flex items-center justify-between p-2.5 rounded-sm text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all"
        >
          <span>❤️ My Wishlist</span>
          {wishlistCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Categories Section with Small Images */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Categories
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="flex flex-col gap-1 overflow-y-auto pr-1">
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/cat/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group"
              >
                {/* Small Category Image */}
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Category Name */}
                <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-primary)] truncate">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-2">No categories found</p>
        )}
      </div>
    </div>
  );
}