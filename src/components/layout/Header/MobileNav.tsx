"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategoryTreeQuery, useCategoriesQuery } from "@/lib/api/queries";
import { buildCategoryTree, ICategoryTreeItem } from "@/lib/utils/categoryTree";
import { useWishlist } from "@/context/WishlistContext";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface MobileNavProps {
  onClose: () => void;
}

export default function MobileNav({ onClose }: MobileNavProps) {
  const { totalWishlistItems: wishlistCount } = useWishlist();

  // 1. Fetch hierarchical categories from tree endpoint
  const { data: treeResponse, isLoading: isTreeLoading } = useCategoryTreeQuery("active");
  // 2. Fallback query
  const { data: flatResponse, isLoading: isFlatLoading } = useCategoriesQuery({ limit: 100, status: "active" });

  const isLoading = isTreeLoading && isFlatLoading;

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories: ICategoryTreeItem[] = useMemo(() => {
    const treeData = treeResponse?.data;
    const flatData = flatResponse?.data;

    if (Array.isArray(treeData) && treeData.length > 0) {
      return buildCategoryTree(treeData);
    }
    if (Array.isArray(flatData) && flatData.length > 0) {
      return buildCategoryTree(flatData);
    }
    return [];
  }, [treeResponse?.data, flatResponse?.data]);

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Nav Links */}
      <div className="flex flex-col gap-1">
        <Link
          href="/track-order"
          onClick={onClose}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)]/20 transition-all"
        >
          <span>🚚 Track Order</span>
          <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">Live</span>
        </Link>
        <Link
          href="/my-orders"
          onClick={onClose}
          className="flex items-center gap-2 p-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all"
        >
          <span>📦 My Orders</span>
        </Link>
        <Link
          href="/wishlist"
          onClick={onClose}
          className="flex items-center justify-between p-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all"
        >
          <span>❤️ My Wishlist</span>
          {wishlistCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Categories Section with Accordion Children */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </p>
          <span className="text-[11px] text-gray-400">
            {categories.length} main categories
          </span>
        </div>

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
          <div className="flex flex-col gap-1 overflow-y-auto pr-1 max-h-[60vh]">
            {categories.map((cat) => {
              const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
              const isExpanded = expandedIds.includes(String(cat._id));

              return (
                <div key={cat._id} className="flex flex-col rounded-xl overflow-hidden">
                  {/* Category Main Row */}
                  <div className="flex items-center justify-between p-1 rounded-xl hover:bg-gray-50 transition-all group">
                    <Link
                      href={`/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 flex-1 min-w-0 p-1"
                    >
                      {/* Small Category Image */}
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
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
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-[var(--color-primary)] truncate">
                        {cat.name}
                      </span>
                    </Link>

                    {/* Accordion Toggle Button for Child Categories */}
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(String(cat._id), e)}
                        aria-label={`Toggle ${cat.name} subcategories`}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition shrink-0 cursor-pointer"
                      >
                        <FiChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Accordion Subcategories List */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 pl-4 border-l-2 border-blue-200/80 my-1 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {cat.children!.map((sub) => (
                        <Link
                          key={sub._id || sub.slug}
                          href={`/${sub.slug || sub.name}`}
                          onClick={onClose}
                          className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span className="truncate">{sub.name}</span>
                          </div>
                          <FiChevronRight size={13} className="text-gray-300 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-2">No categories found</p>
        )}
      </div>
    </div>
  );
}
