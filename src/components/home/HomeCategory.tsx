"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCategoriesQuery } from "@/lib/api/queries";

// Fallback categories matching the exact items in user's reference image
const fallbackCategories = [
  {
    _id: "fb_chargers",
    name: "Chargers",
    slug: "chargers",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
  },
  {
    _id: "fb_cables",
    name: "Cables",
    slug: "cables",
    image: "https://images.unsplash.com/photo-1608248597359-009d945110d9?w=400&q=80",
  },
  {
    _id: "fb_earbuds",
    name: "Earbuds",
    slug: "earbuds",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
  },
  {
    _id: "fb_neckbands",
    name: "Neckbands",
    slug: "neckbands",
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&q=80",
  },
  {
    _id: "fb_headphones",
    name: "Headphones",
    slug: "headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  },
  {
    _id: "fb_speakers",
    name: "Speakers",
    slug: "speakers",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80",
  },
  {
    _id: "fb_powerbanks",
    name: "Power Banks",
    slug: "power-banks",
    image: "https://images.unsplash.com/photo-1609592426504-20ec591b6194?w=400&q=80",
  },
  {
    _id: "fb_smartwatches",
    name: "Smart Watches",
    slug: "smart-watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    _id: "fb_screenguards",
    name: "Screen Guards",
    slug: "screen-guards",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&q=80",
  },
  {
    _id: "fb_cases",
    name: "Cases",
    slug: "cases",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80",
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
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            Featured Categories
          </h2>

          {/* Right Arrow Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous categories"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 hover:text-[#FF5A5A] flex items-center justify-center transition"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next categories"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 hover:text-[#FF5A5A] flex items-center justify-center transition"
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
          className="flex items-start gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {displayCategories.map((cat: any, index: number) => {
            const catHref = `/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-")}`;
            const imgSrc = cat.image || cat.icon || "/img/sbb1.png";

            return (
              <Link
                key={cat._id || cat.slug || index}
                href={catHref}
                className="group shrink-0 w-[84px] sm:w-[96px] md:w-[108px] lg:w-[116px] flex flex-col items-center cursor-pointer select-none"
              >
                {/* Soft Gray Rounded Card Box - No Border */}
                <div className="w-full aspect-square rounded-2xl bg-[#f4f4f6] group-hover:bg-[#ebecf0] transition-colors duration-300 flex items-center justify-center p-3 sm:p-3.5 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    width={90}
                    height={90}
                    className="w-auto h-auto max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Category Label Below the Card */}
                <span className="text-xs sm:text-[13px] font-semibold text-gray-800 group-hover:text-[#FF5A5A] transition-colors text-center truncate w-full block mt-2">
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
