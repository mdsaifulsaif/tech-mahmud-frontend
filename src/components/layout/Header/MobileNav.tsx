"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCategoryTreeQuery, useCategoriesQuery } from "@/lib/api/queries";
import { buildCategoryTree, ICategoryTreeItem } from "@/lib/utils/categoryTree";
import { useWishlist } from "@/context/WishlistContext";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface MobileNavProps {
  onClose: () => void;
}

function toCleanSlug(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    <div className="flex flex-col gap-5 w-full">
      {/* Quick Nav Links */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <Link
          href="/track-order"
          onClick={onClose}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)]/20 transition-all shrink-0"
        >
          <span className="flex items-center gap-2">
            <span>🚚</span>
            <span>Track Order</span>
          </span>
          <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full font-bold">
            Live
          </span>
        </Link>
        <Link
          href="/my-orders"
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all shrink-0"
        >
          <span>📦</span>
          <span>My Orders</span>
        </Link>
        <Link
          href="/wishlist"
          onClick={onClose}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all shrink-0"
        >
          <span className="flex items-center gap-2">
            <span>❤️</span>
            <span>My Wishlist</span>
          </span>
          {wishlistCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Categories Section */}
      <div className="flex flex-col border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Categories
          </p>
          <span className="text-xs font-medium text-gray-400">
            {categories.length} main categories
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="flex flex-col gap-1.5 w-full pb-8">
            {categories.map((cat) => {
              const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
              const isExpanded = expandedIds.includes(String(cat._id));
              const cleanSlug = toCleanSlug(cat.slug || cat.name);

              return (
                <div
                  key={cat._id}
                  className="flex flex-col shrink-0 rounded-xl border border-gray-100/90 bg-white hover:border-gray-200 transition-all shadow-2xs overflow-hidden"
                >
                  {/* Category Main Row */}
                  <div className="flex items-center justify-between p-2 min-h-[50px] shrink-0 hover:bg-gray-50/80 transition-colors group">
                    <Link
                      href={`/${cleanSlug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 flex-1 min-w-0 pr-1"
                    >
                      {/* Category Thumbnail Image */}
                      <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200/80 flex items-center justify-center">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-100">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Category Name */}
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-[var(--color-primary)] truncate">
                        {cat.name}
                      </span>
                    </Link>

                    {/* Accordion Toggle for Children */}
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

                  {/* Accordion Subcategories */}
                  {hasChildren && isExpanded && (
                    <div className="ml-5 pl-3 border-l-2 border-blue-200/80 my-1 py-1 flex flex-col gap-1 bg-gray-50/60 rounded-r-lg">
                      {cat.children!.map((sub) => {
                        const subSlug = toCleanSlug(sub.slug || sub.name);
                        return (
                          <Link
                            key={sub._id || sub.slug}
                            href={`/${subSlug}`}
                            onClick={onClose}
                            className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-white transition shrink-0"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {sub.image ? (
                                <img
                                  src={sub.image}
                                  alt={sub.name}
                                  className="w-5 h-5 min-w-[20px] min-h-[20px] rounded object-cover border border-gray-200 shrink-0"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              )}
                              <span className="truncate">{sub.name}</span>
                            </div>
                            <FiChevronRight size={13} className="text-gray-300 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-3">No categories found</p>
        )}
      </div>
    </div>
  );
}
