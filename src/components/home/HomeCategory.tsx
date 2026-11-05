"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCategoriesQuery } from "@/lib/api/queries";

// Fallback categories matching the exact items in user's reference image
const fallbackCategories = [
  {
    _id: "fb_smartwatches",
    name: "Smart Watches",
    slug: "smart-watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    _id: "fb_earbuds",
    name: "In-Ear/Earbuds",
    slug: "earbuds",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
  },
  {
    _id: "fb_chino",
    name: "Mens Chino Pant",
    slug: "mens-chino-pant",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
  },
  {
    _id: "fb_dryers",
    name: "Hair Dryers",
    slug: "hair-dryers",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  },
  {
    _id: "fb_panjabi",
    name: "Men's Panjabi",
    slug: "mens-panjabi",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
  },
  {
    _id: "fb_bottomwear",
    name: "Women's Bottom Wear",
    slug: "womens-bottom-wear",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  },
  {
    _id: "fb_casualshirt",
    name: "Mens Casual Shirt",
    slug: "mens-casual-shirt",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
  },
  {
    _id: "fb_footwear",
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    _id: "fb_polo",
    name: "Men's Polo",
    slug: "mens-polo",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
  },
  {
    _id: "fb_smartphones",
    name: "Smartphones",
    slug: "smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
  },
  {
    _id: "fb_laptops",
    name: "Laptops",
    slug: "laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  },
  {
    _id: "fb_cameras",
    name: "Cameras",
    slug: "cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  },
];

interface HomeCategoryProps {
  initialCategories?: any[];
}

export default function HomeCategory({ initialCategories = [] }: HomeCategoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch only featured categories via TanStack Query
  const { data: featuredData } = useCategoriesQuery({
    isFeatured: true,
    limit: 30,
  });

  // Calculate items to display:
  // 1. If admin marked categories with isFeatured=true, show ONLY those!
  // 2. Otherwise fallback to initialCategories with isFeatured, or active categories, or default reference categories.
  const apiFeatured = featuredData?.data || [];
  const initialFeatured = initialCategories.filter(
    (c) => c.isFeatured && c.status !== "inactive"
  );

  let displayCategories: any[] = [];
  if (apiFeatured.length > 0) {
    displayCategories = apiFeatured;
  } else if (initialFeatured.length > 0) {
    displayCategories = initialFeatured;
  } else if (initialCategories.length > 0) {
    displayCategories = initialCategories.filter((c) => c.status !== "inactive");
  } else {
    displayCategories = fallbackCategories;
  }

  // Handle smooth scroll by arrow buttons
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    // Scroll by ~2 category cards width
    const scrollAmount = Math.max(container.clientWidth * 0.5, 200);

    if (direction === "right") {
      // Loop back to start if reached end
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 15
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Auto-slide effect every 3.5 seconds (paused when hovered)
  useEffect(() => {
    if (isHovered || displayCategories.length <= 4) return;

    const timer = setInterval(() => {
      handleScroll("right");
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, displayCategories.length]);

  return (
    <section className="py-6 sm:py-8 select-none">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Row: Left Title & Right Navigation Arrow Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Explore our trending & featured collections
            </p>
          </div>

          {/* Right Arrow Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous categories"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 hover:text-[#FF5A5A] flex items-center justify-center transition shadow-2xs border border-gray-200/60"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next categories"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 hover:text-[#FF5A5A] flex items-center justify-center transition shadow-2xs border border-gray-200/60"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel / Slider Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {displayCategories.map((cat: any, index: number) => {
            const catHref = `/cat/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-")}`;
            const imgSrc = cat.image || cat.icon || "/img/sbb1.png";

            return (
              <Link
                key={cat._id || cat.slug || index}
                href={catHref}
                className="group shrink-0 w-[125px] sm:w-[145px] md:w-[155px] lg:w-[165px] bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-[#FF5A5A]/35 transition-all duration-300 flex flex-col items-center justify-between p-3 cursor-pointer hover:-translate-y-1"
              >
                {/* Image Container - Non-rounded / Square-Rectangular as requested */}
                <div className="w-full aspect-square relative rounded-lg bg-gray-50/70 overflow-hidden flex items-center justify-center p-2 mb-2">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    width={120}
                    height={120}
                    className="max-h-[80px] sm:max-h-[95px] w-auto max-w-full object-contain group-hover:scale-108 transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
                <span className="text-xs sm:text-[13px] font-semibold text-gray-800 group-hover:text-[#FF5A5A] transition-colors text-center truncate w-full block">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
