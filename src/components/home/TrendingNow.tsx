"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../shared/ProductCard";
import { useCategoriesQuery } from "@/lib/api/queries";

// Initial Category Pills
const trendingCategories = [
  { id: "bags-luggage", name: "Bags & Luggage", slug: "bags-luggage" },
  { id: "watch", name: "Watch", slug: "watch" },
  { id: "shaving-trimming", name: "Shaving & Trimming", slug: "shaving-trimming" },
  { id: "headphones", name: "Headphones", slug: "headphones" },
  { id: "smartphones", name: "Smartphones", slug: "smartphones" },
  { id: "accessories", name: "Accessories", slug: "accessories" },
];

interface TrendingNowProps {
  initialBanners?: any[];
  initialTrendingCategories?: any[];
  initialHomeCategories?: any[];
  allCategories?: any[];
}

export default function TrendingNow({
  initialBanners = [],
  initialTrendingCategories = [],
  initialHomeCategories = [],
  allCategories = [],
}: TrendingNowProps) {
  // Fetch fresh trending categories marked by Admin
  const { data: trendingCatsResponse } = useCategoriesQuery({
    isTrending: true,
    limit: 20,
  });

  const apiTrendingCategories = trendingCatsResponse?.data || [];
  const categoriesToDisplay =
    apiTrendingCategories.length > 0
      ? apiTrendingCategories
      : initialTrendingCategories.length > 0
      ? initialTrendingCategories
      : trendingCategories;

  const defaultSlug =
    categoriesToDisplay[0]?.slug ||
    categoriesToDisplay[0]?._id ||
    "bags-luggage";
  const [activeTab, setActiveTab] = useState<string>(defaultSlug);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync activeTab when categories change
  useEffect(() => {
    if (categoriesToDisplay.length > 0) {
      const exists = categoriesToDisplay.some(
        (c: any) => (c.slug || c._id) === activeTab
      );
      if (!exists) {
        setActiveTab(categoriesToDisplay[0].slug || categoriesToDisplay[0]._id);
      }
    }
  }, [categoriesToDisplay, activeTab]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

  // Fetch products for selected category using TanStack Query
  const { data: apiResponse, isLoading } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ["trending-products", activeTab],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/products?category=${activeTab}&limit=12`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes for instant tab switching
  });

  const apiProducts = apiResponse?.data || [];
  const displayProducts = apiProducts;

  // Handle smooth scroll
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = Math.max(container.clientWidth * 0.75, 240);

    if (direction === "right") {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 20
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= 15) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleScrollEvent = () => {
    const container = scrollRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(container.scrollLeft / maxScroll);
    }
  };

  // Auto slide every 4.5 seconds
  useEffect(() => {
    if (isHovered || displayProducts.length <= 3) return;
    const timer = setInterval(() => {
      handleScroll("right");
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, displayProducts.length]);

  return (
    <div className="space-y-6 sm:space-y-8 py-4 select-none">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TRENDING NOW SECTION WITH CATEGORY PILLS (Exact Image 1)  */}
        {/* ========================================================= */}
        <div className="bg-[#f8fafc]/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-xs">
          {/* Header Row: Title on Left, Category Pills in Center, See More on Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-5 pb-3 border-b border-gray-200/60">
            {/* Title */}
            <div className="shrink-0">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Trending Now
              </h2>
            </div>

            {/* Middle: Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categoriesToDisplay.map((cat: any) => {
                const catSlug = cat.slug || cat._id || cat.id;
                const isActive = activeTab === catSlug;
                return (
                  <button
                    key={cat._id || cat.id || catSlug}
                    type="button"
                    onClick={() => setActiveTab(catSlug)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#1e40af] text-white shadow-sm ring-2 ring-[#1e40af]/20"
                        : "bg-white text-gray-700 hover:text-gray-900 border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Right: See More Link */}
            <Link
              href={`/shop?category=${activeTab}`}
              className="shrink-0 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#FF5A5A] flex items-center gap-1.5 transition-colors group self-end lg:self-center"
            >
              <span>See More</span>
              <FiArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Product Carousel with Left & Right Arrows */}
          <div className="relative group/carousel">
            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#FF5A5A] shadow-md border border-gray-200 flex items-center justify-center transition active:scale-95 focus:outline-none"
            >
              <FiChevronLeft size={20} />
            </button>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#FF5A5A] shadow-md border border-gray-200 flex items-center justify-center transition active:scale-95 focus:outline-none"
            >
              <FiChevronRight size={20} />
            </button>

            {/* Products Row Slider - Matching Unified Product Card */}
            <div
              ref={scrollRef}
              onScroll={handleScrollEvent}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
              className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
            >
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[170px] sm:w-[195px] md:w-[215px] lg:w-[230px] h-72 bg-white rounded-xl border border-gray-100 animate-pulse"
                  />
                ))
              ) : displayProducts.length > 0 ? (
                displayProducts.map((product: any, idx: number) => (
                  <div
                    key={product._id || idx}
                    className="shrink-0 w-[170px] sm:w-[195px] md:w-[215px] lg:w-[230px]"
                  >
                    <ProductCard
                      product={product}
                      onQuickView={() => setSelectedProduct(product)}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full py-12 text-center text-gray-400 text-sm font-medium">
                  No products found in this category yet.
                </div>
              )}
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollProgress < 0.35
                  ? "w-6 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A]"
                  : "w-2 bg-gray-300"
              }`}
            />
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollProgress >= 0.35 && scrollProgress <= 0.7
                  ? "w-6 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A]"
                  : "w-2 bg-gray-300"
              }`}
            />
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollProgress > 0.7
                  ? "w-6 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A]"
                  : "w-2 bg-gray-300"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

