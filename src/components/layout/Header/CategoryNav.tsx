"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCategoryTreeQuery, useCategoriesQuery } from "@/lib/api/queries";
import { buildCategoryTree, ICategoryTreeItem } from "@/lib/utils/categoryTree";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiArrowRight,
} from "react-icons/fi";

// Fallback tech and apparel categories in case DB is offline
const fallbackCategories: ICategoryTreeItem[] = [
  { _id: "fb_desktop", name: "Desktop", slug: "desktop", children: [] },
  { _id: "fb_laptop", name: "Laptop", slug: "laptop", children: [] },
  { _id: "fb_component", name: "Component", slug: "component", children: [] },
  { _id: "fb_monitor", name: "Monitor", slug: "monitor", children: [] },
  { _id: "fb_power", name: "Power", slug: "power", children: [] },
  { _id: "fb_phone", name: "Phone", slug: "phone", children: [] },
  { _id: "fb_tablet", name: "Tablet", slug: "tablet", children: [] },
  { _id: "fb_office", name: "Office Equipment", slug: "office-equipment", children: [] },
  { _id: "fb_camera", name: "Camera", slug: "camera", children: [] },
  { _id: "fb_security", name: "Security", slug: "security", children: [] },
  { _id: "fb_networking", name: "Networking", slug: "networking", children: [] },
  { _id: "fb_software", name: "Software", slug: "software", children: [] },
  { _id: "fb_server", name: "Server & Storage", slug: "server-storage", children: [] },
  { _id: "fb_accessories", name: "Accessories", slug: "accessories", children: [] },
  { _id: "fb_gadget", name: "Gadget", slug: "gadget", children: [] },
  { _id: "fb_gaming", name: "Gaming", slug: "gaming", children: [] },
  { _id: "fb_fashion", name: "Fashion", slug: "fashion", children: [] },
  { _id: "fb_lifestyle", name: "Lifestyle", slug: "lifestyle", children: [] },
];

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

export default function CategoryNav() {
  // 1. Fetch hierarchical categories from tree endpoint
  const { data: treeResponse } = useCategoryTreeQuery("active");
  // 2. Fetch flat categories as fallback
  const { data: flatResponse } = useCategoriesQuery({ limit: 100, status: "active" });

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Active hovered/clicked category for child dropdown
  const [activeCategory, setActiveCategory] = useState<ICategoryTreeItem | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number }>({ left: 16 });

  // Resolve root categories tree
  const treeData = treeResponse?.data;
  const flatData = flatResponse?.data;

  const categories: ICategoryTreeItem[] = React.useMemo(() => {
    if (Array.isArray(treeData) && treeData.length > 0) {
      return buildCategoryTree(treeData);
    }
    if (Array.isArray(flatData) && flatData.length > 0) {
      return buildCategoryTree(flatData);
    }
    return fallbackCategories;
  }, [treeData, flatData]);

  // Check scroll position to dynamically show/hide arrows
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
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

  // Hover handlers with debounce to prevent accidental closes
  const handleItemMouseEnter = (cat: ICategoryTreeItem, e: React.MouseEvent<HTMLLIElement>) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }

    if (!cat.children || cat.children.length === 0) {
      setActiveCategory(null);
      return;
    }

    // Calculate left position relative to parent nav container
    const navEl = navContainerRef.current;
    const itemEl = e.currentTarget;

    if (navEl && itemEl) {
      const navRect = navEl.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();
      const relativeLeft = itemRect.left - navRect.left;

      // Desired dropdown width approx 280px to 320px
      const dropdownWidth = (cat.children.length > 6) ? 360 : 260;
      const maxLeft = Math.max(16, navRect.width - dropdownWidth - 16);
      const clampedLeft = Math.max(16, Math.min(relativeLeft, maxLeft));

      setDropdownPosition({ left: clampedLeft });
    }

    setActiveCategory(cat);
  };

  const handleItemMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 180);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 180);
  };

  // Handle touch tap for mobile / touch screens
  const handleItemClick = (cat: ICategoryTreeItem, e: React.MouseEvent<HTMLAnchorElement>, hasChildren: boolean) => {
    // If on small device and category has children, first tap opens dropdown
    if (hasChildren && window.innerWidth < 1024) {
      if (activeCategory?._id !== cat._id) {
        e.preventDefault();
        const navEl = navContainerRef.current;
        const targetEl = e.currentTarget.closest("li");
        if (navEl && targetEl) {
          const navRect = navEl.getBoundingClientRect();
          const itemRect = targetEl.getBoundingClientRect();
          const relativeLeft = itemRect.left - navRect.left;
          const dropdownWidth = (cat.children!.length > 6) ? 320 : 250;
          const maxLeft = Math.max(12, navRect.width - dropdownWidth - 12);
          setDropdownPosition({ left: Math.max(12, Math.min(relativeLeft, maxLeft)) });
        }
        setActiveCategory(cat);
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-2xs relative z-40 select-none">
      {/* Container aligned strictly with MinHeader (px-3 sm:px-6 lg:px-8) */}
      <div ref={navContainerRef} className="container mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex items-center w-full min-h-[46px] sm:min-h-[48px]">
          {/* ========================================================= */}
          {/* LEFT SCROLL ARROW (Visible only when scrolled right)       */}
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
          {/* MAIN CATEGORIES LIST (Only root/parent categories)        */}
          {/* ========================================================= */}
          <ul
            ref={scrollContainerRef}
            className="flex-1 min-w-0 flex items-center justify-start overflow-x-auto no-scrollbar py-2.5 gap-5 sm:gap-7 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((cat) => {
              const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
              const isHovered = activeCategory?._id === cat._id;

              return (
                <li
                  key={cat._id || cat.slug}
                  className="relative shrink-0 group flex items-center"
                  onMouseEnter={(e) => handleItemMouseEnter(cat, e)}
                  onMouseLeave={handleItemMouseLeave}
                >
                  <Link
                    href={`/${toCleanSlug(cat.slug || cat.name)}`}
                    onClick={(e) => handleItemClick(cat, e, hasChildren)}
                    className={`py-1 text-[12.5px] sm:text-[13px] font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap leading-normal ${
                      isHovered
                        ? "text-[#FF5A5A]"
                        : "text-gray-800 hover:text-[#FF5A5A]"
                    }`}
                  >
                    <span className="leading-normal">{cat.name}</span>
                    {hasChildren && (
                      <FiChevronDown
                        size={12}
                        className={`text-gray-400 group-hover:text-[#FF5A5A] transition-transform duration-200 shrink-0 ${
                          isHovered ? "rotate-180 text-[#FF5A5A]" : ""
                        }`}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ========================================================= */}
          {/* RIGHT SCROLL ARROW (Visible only when overflow remains)   */}
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

        {/* =========================================================== */}
        {/* SUBCATEGORY POPUP (Rendered outside overflow-x container)  */}
        {/* =========================================================== */}
        {activeCategory &&
          Array.isArray(activeCategory.children) &&
          activeCategory.children.length > 0 && (
            <div
              style={{ left: `${dropdownPosition.left}px` }}
              className={`absolute top-full z-50 mt-0.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
                activeCategory.children.length > 6 ? "min-w-[340px] max-w-[440px]" : "min-w-[240px] max-w-[280px]"
              }`}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              {/* Dropdown Header */}
              <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiLayers size={13} className="text-[#FF5A5A]" />
                  <span className="text-xs font-bold text-gray-900 tracking-tight">
                    {activeCategory.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-500 border border-gray-200 shadow-2xs">
                  {activeCategory.children.length} sub-categories
                </span>
              </div>

              {/* Subcategories list / grid */}
              <div
                className={`p-2 max-h-[360px] overflow-y-auto ${
                  activeCategory.children.length > 6
                    ? "grid grid-cols-2 gap-1"
                    : "flex flex-col gap-0.5"
                }`}
                style={{ scrollbarWidth: "thin" }}
              >
                {activeCategory.children.map((sub) => (
                  <Link
                    key={sub._id || sub.slug}
                    href={`/${toCleanSlug(sub.slug || sub.name)}`}
                    onClick={() => setActiveCategory(null)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {sub.image ? (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-5 h-5 rounded-md object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors shrink-0" />
                      )}
                      <span className="truncate">{sub.name}</span>
                    </div>
                    <FiChevronRight
                      size={12}
                      className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </Link>
                ))}
              </div>

              {/* Dropdown Footer: View All link */}
              <div className="px-3 py-2 bg-gray-50/50 border-t border-gray-100">
                <Link
                  href={`/${toCleanSlug(activeCategory.slug || activeCategory.name)}`}
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-600 hover:text-[#FF5A5A] transition py-1 rounded-lg hover:bg-white"
                >
                  <span>Explore all in {activeCategory.name}</span>
                  <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
      </div>
    </nav>
  );
}
