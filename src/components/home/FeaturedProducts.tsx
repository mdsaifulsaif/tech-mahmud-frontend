"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiZap } from "react-icons/fi";
import ProductCard from "../shared/ProductCard";

interface FeaturedProductsProps {
  initialProducts?: any[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  initialProducts = [],
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    if (isHovered || initialProducts.length <= 3) return;

    const timer = setInterval(() => {
      handleScroll("right");
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, initialProducts.length]);

  if (!initialProducts || initialProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-7 sm:py-10 bg-white select-none relative">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header: Title on Left, See More Link on Right */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <FiZap className="text-[#FF5A5A]" size={22} />
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Handpicked best selling products just for you
            </p>
          </div>

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

          {/* Product Items Slider Container - EXACT SAME Card Width & Gap as New Collection */}
          <div
            ref={scrollRef}
            onScroll={handleScrollEvent}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {initialProducts.map((product: any, idx: number) => (
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
};

export default FeaturedProducts;
