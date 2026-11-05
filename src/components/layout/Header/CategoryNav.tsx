"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCategoriesQuery } from "@/lib/api/queries";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Fallback tech and apparel categories matching Star Tech reference
const fallbackCategories = [
  { name: "Desktop", slug: "desktop" },
  { name: "Laptop", slug: "laptop" },
  { name: "Component", slug: "component" },
  { name: "Monitor", slug: "monitor" },
  { name: "Power", slug: "power" },
  { name: "Phone", slug: "phone" },
  { name: "Tablet", slug: "tablet" },
  { name: "Office Equipment", slug: "office-equipment" },
  { name: "Camera", slug: "camera" },
  { name: "Security", slug: "security" },
  { name: "Networking", slug: "networking" },
  { name: "Software", slug: "software" },
  { name: "Server & Storage", slug: "server-storage" },
  { name: "Accessories", slug: "accessories" },
  { name: "Gadget", slug: "gadget" },
  { name: "Gaming", slug: "gaming" },
  { name: "Clothing", slug: "clothing" },
  { name: "Lifestyle", slug: "lifestyle" },
];

export default function CategoryNav() {
  const { data: categoryData } = useCategoriesQuery({ limit: 30 });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLUListElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const apiCategories = categoryData?.data || [];
  const categories = apiCategories.length > 0 ? apiCategories : fallbackCategories;

  // Check scroll position to dynamically show/hide arrows
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Show left arrow only if user has scrolled to the right
    setCanScrollLeft(scrollLeft > 6);
    // Show right arrow only if there is overflow content remaining on the right
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, [checkScroll, categories]);

  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-2xs relative z-40 select-none">
      {/* Container aligned strictly with MinHeader (px-3 sm:px-6 lg:px-8) */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center w-full min-h-[46px] sm:min-h-[48px]">
          {/* ========================================================= */}
          {/* LEFT SCROLL ARROW (Strictly inside container padding)     */}
          {/* ========================================================= */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={handleScrollLeft}
              aria-label="Scroll Categories Left"
              className="shrink-0 mr-2 sm:mr-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:text-[#FF5A5A] hover:border-[#FF5A5A]/40 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 z-10"
            >
              <FiChevronLeft size={16} />
            </button>
          )}

          {/* ========================================================= */}
          {/* CATEGORY ITEMS LIST (Clean consistent gap, NO stretch)    */}
          {/* ========================================================= */}
          <ul
            ref={scrollContainerRef}
            className="flex-1 min-w-0 flex items-center justify-start overflow-x-auto no-scrollbar py-2.5 gap-5 sm:gap-7 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.slice(0, 24).map((cat: any) => {
              const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
              const isHovered = hoveredCategory === (cat._id || cat.slug);

              return (
                <li
                  key={cat._id || cat.slug}
                  className="relative shrink-0 group flex items-center"
                  onMouseEnter={() => setHoveredCategory(cat._id || cat.slug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/cat/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-")}`}
                    className="py-1 text-[12.5px] sm:text-[13px] font-semibold text-gray-800 hover:text-[#FF5A5A] inline-flex items-center gap-1 transition-colors whitespace-nowrap leading-normal"
                  >
                    <span className="leading-normal">{cat.name}</span>
                    {hasChildren && (
                      <FiChevronDown
                        size={12}
                        className="text-gray-400 group-hover:text-[#FF5A5A] transition-transform duration-200 group-hover:rotate-180 shrink-0"
                      />
                    )}
                  </Link>

                  {/* Subcategory dropdown if category has subcategories */}
                  {hasChildren && isHovered && (
                    <div className="absolute top-full left-0 min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {cat.children.map((sub: any) => (
                        <Link
                          key={sub._id || sub.slug}
                          href={`/cat/${sub.slug}`}
                          className="block px-4 py-2 text-xs font-medium text-gray-700 hover:text-[#FF5A5A] hover:bg-gray-50 transition"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ========================================================= */}
          {/* RIGHT SCROLL ARROW (Strictly inside container padding)    */}
          {/* ========================================================= */}
          {canScrollRight && (
            <button
              type="button"
              onClick={handleScrollRight}
              aria-label="Scroll Categories Right"
              className="shrink-0 ml-2 sm:mr-0 sm:ml-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:text-[#FF5A5A] hover:border-[#FF5A5A]/40 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 z-10"
            >
              <FiChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
