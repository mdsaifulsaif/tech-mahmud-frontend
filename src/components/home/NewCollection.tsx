"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useNewCollectionProductsQuery } from "@/lib/api/queries";
import ProductCard from "@/components/shared/ProductCard";

// Fallback products matching the exact items, images, and prices in user's reference images
const fallbackNewCollection = [
  {
    _id: "nc_shawl_1",
    name: "Shawl",
    slug: "shawl",
    regularPrice: 790,
    salePrice: 790,
    thumbnail: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#1e1e24", "#f0fdf4"],
  },
  {
    _id: "nc_saree_1",
    name: "Womens Saree",
    slug: "womens-saree",
    regularPrice: 1450,
    salePrice: 1450,
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#d97706", "#db2777"],
  },
  {
    _id: "nc_shirt_reg_1",
    name: "Mens Full Sleeve Casual Shirt - Regular Fit",
    slug: "mens-full-sleeve-casual-shirt-regular-fit",
    regularPrice: 1190,
    salePrice: 1190,
    thumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#3b82f6", "#1e293b"],
  },
  {
    _id: "nc_shirt_slim_1",
    name: "Mens Full Sleeve Casual Shirt - Slim Fit",
    slug: "mens-full-sleeve-casual-shirt-slim-fit",
    regularPrice: 1190,
    salePrice: 1190,
    thumbnail: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#38bdf8", "#0f172a"],
  },
  {
    _id: "nc_shirt_save_1",
    name: "Mens Full Sleeve Casual Shirt - Regular Fit",
    slug: "mens-full-sleeve-casual-shirt-white",
    regularPrice: 1990,
    salePrice: 1194,
    thumbnail: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#e2e8f0", "#1e293b"],
  },
  {
    _id: "nc_shirt_pink_1",
    name: "Mens Full Sleeve Casual Shirt - Slim Fit",
    slug: "mens-full-sleeve-casual-shirt-pink",
    regularPrice: 990,
    salePrice: 990,
    thumbnail: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#34d399", "#1e3a8a"],
  },
  {
    _id: "nc_shirt_save_2",
    name: "Mens Full Sleeve Casual Shirt - Slim Fit",
    slug: "mens-full-sleeve-casual-shirt-classic-fit",
    regularPrice: 1990,
    salePrice: 1194,
    thumbnail: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#f1f5f9", "#334155"],
  },
  {
    _id: "nc_panjabi_1",
    name: "Mens Designer Premium Panjabi",
    slug: "mens-designer-premium-panjabi",
    regularPrice: 2250,
    salePrice: 1850,
    thumbnail: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=85",
    isNew: true,
    isNewCollection: true,
    colors: ["#475569", "#0284c7"],
  },
];

interface NewCollectionProps {
  initialProducts?: any[];
}

export default function NewCollection({ initialProducts = [] }: NewCollectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch new collection products with TanStack Query
  const { data: apiResponse } = useNewCollectionProductsQuery(16);
  const apiProducts = apiResponse?.data || [];

  // Determine which list to display
  let displayProducts: any[] = [];
  if (apiProducts.length > 0) {
    displayProducts = apiProducts;
  } else if (initialProducts.length > 0) {
    displayProducts = initialProducts;
  } else {
    displayProducts = fallbackNewCollection;
  }

  // Smooth scroll left / right
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

  // Track scroll position to update pagination indicators
  const handleScrollEvent = () => {
    const container = scrollRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(container.scrollLeft / maxScroll);
    }
  };

  // Auto-slide effect every 4 seconds (paused when hovered)
  useEffect(() => {
    if (isHovered || displayProducts.length <= 3) return;

    const timer = setInterval(() => {
      handleScroll("right");
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, displayProducts.length]);

  return (
    <section className="py-7 sm:py-10 bg-[#f1f5f9] select-none relative">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header: Title on Left, See More Link on Right */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            New Collection
          </h2>

          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-gray-700 hover:text-[#FF5A5A] flex items-center gap-1.5 transition-colors group"
          >
            <span>See More</span>
            <FiArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Carousel Wrapper with Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous products"
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#FF5A5A] shadow-md border border-gray-200 flex items-center justify-center transition active:scale-95 focus:outline-none"
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next products"
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#FF5A5A] shadow-md border border-gray-200 flex items-center justify-center transition active:scale-95 focus:outline-none"
          >
            <FiChevronRight size={20} />
          </button>

          {/* Product Items Slider Container */}
          <div
            ref={scrollRef}
            onScroll={handleScrollEvent}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {displayProducts.map((product: any, idx: number) => (
              <div
                key={product._id || idx}
                className="shrink-0 w-[170px] sm:w-[195px] md:w-[215px] lg:w-[230px]"
              >
                <ProductCard
                  product={product}
                  onQuickView={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
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
    </section>
  );
}
