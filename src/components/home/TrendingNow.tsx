"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../shared/ProductCard";

// Initial Category Pills matching user's reference image
const trendingCategories = [
  { id: "bags-luggage", name: "Bags & Luggage", slug: "bags-luggage" },
  { id: "watch", name: "Watch", slug: "watch" },
  { id: "shaving-trimming", name: "Shaving & Trimming", slug: "shaving-trimming" },
  { id: "headphones", name: "Headphones", slug: "headphones" },
  { id: "smartphones", name: "Smartphones", slug: "smartphones" },
  { id: "accessories", name: "Accessories", slug: "accessories" },
];

// Fallback products for categories in case DB is empty for a specific category
const categoryFallbackProducts: Record<string, any[]> = {
  "bags-luggage": [
    {
      _id: "trend_bag_1",
      name: "Urban Leather Laptop Crossbody Bag",
      slug: "urban-leather-laptop-bag",
      regularPrice: 1500,
      salePrice: 900,
      thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
      isNew: true,
      colors: ["#1e293b", "#3b82f6"],
    },
    {
      _id: "trend_bag_2",
      name: "Urban Lightweight Zipper Handbags",
      slug: "urban-lightweight-zipper-handbag",
      regularPrice: 1700,
      salePrice: 1100,
      thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
      isNew: true,
      colors: ["#0f172a"],
    },
    {
      _id: "trend_bag_3",
      name: "Urban Men Crossbody Messenger Bag",
      slug: "urban-men-crossbody-messenger",
      regularPrice: 1000,
      salePrice: 600,
      thumbnail: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80",
      isNew: true,
      colors: ["#1e293b", "#2563eb"],
    },
    {
      _id: "trend_bag_4",
      name: "Urban Men Crossbody Compact Bag",
      slug: "urban-men-compact-crossbody",
      regularPrice: 1000,
      salePrice: 600,
      thumbnail: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=500&q=80",
      isNew: true,
      colors: ["#0f172a", "#1d4ed8"],
    },
    {
      _id: "trend_bag_5",
      name: "Urban Lightweight School & Travel Backpack",
      slug: "urban-lightweight-school-backpack",
      regularPrice: 1500,
      salePrice: 999,
      thumbnail: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500&q=80",
      isNew: true,
      colors: ["#18181b", "#ef4444"],
    },
    {
      _id: "trend_bag_6",
      name: "Urban Shoulder Bag Fashion Women",
      slug: "urban-shoulder-bag-fashion",
      regularPrice: 1500,
      salePrice: 999,
      thumbnail: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80",
      isNew: true,
      colors: ["#94a3b8", "#1e1e24", "#dc2626"],
    },
  ],
  watch: [
    {
      _id: "trend_watch_1",
      name: "Poedagar Men Luxury Quartz Chronograph",
      slug: "poedagar-men-luxury-quartz",
      regularPrice: 2050,
      salePrice: 1850,
      thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
      isNew: true,
      colors: ["#0f172a", "#e2e8f0"],
    },
    {
      _id: "trend_watch_2",
      name: "Classic Steel Strap Wedding Men Watch",
      slug: "classic-steel-strap-wedding-watch",
      regularPrice: 2400,
      salePrice: 1790,
      thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
      isNew: true,
      colors: ["#94a3b8", "#1e293b"],
    },
    {
      _id: "trend_watch_3",
      name: "Smart Fitness Tracker OLED Display Watch",
      slug: "smart-fitness-tracker-oled",
      regularPrice: 2200,
      salePrice: 1650,
      thumbnail: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
      isNew: true,
      colors: ["#18181b", "#3b82f6"],
    },
  ],
  "shaving-trimming": [
    {
      _id: "trend_trim_1",
      name: "Vintage T9 Professional Hair Trimmer",
      slug: "vintage-t9-hair-trimmer",
      regularPrice: 1200,
      salePrice: 850,
      thumbnail: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80",
      isNew: true,
      colors: ["#d97706", "#18181b"],
    },
    {
      _id: "trend_trim_2",
      name: "Rechargeable Electric Shaver for Men",
      slug: "rechargeable-electric-shaver",
      regularPrice: 1600,
      salePrice: 1150,
      thumbnail: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
      isNew: true,
      colors: ["#0f172a"],
    },
  ],
  headphones: [
    {
      _id: "trend_audio_1",
      name: "Active Noise Cancelling Wireless Headphones",
      slug: "active-noise-cancelling-headphones",
      regularPrice: 2800,
      salePrice: 2100,
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      isNew: true,
      colors: ["#18181b", "#ffffff"],
    },
    {
      _id: "trend_audio_2",
      name: "TWS Wireless Bluetooth Earbuds 5.3",
      slug: "tws-wireless-earbuds-53",
      regularPrice: 1400,
      salePrice: 950,
      thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
      isNew: true,
      colors: ["#0f172a", "#3b82f6"],
    },
  ],
};

interface TrendingNowProps {
  initialBanners?: any[];
  initialHomeCategories?: any[];
  allCategories?: any[];
}

export default function TrendingNow({
  initialBanners = [],
  initialHomeCategories = [],
  allCategories = [],
}: TrendingNowProps) {
  const [activeTab, setActiveTab] = useState<string>("bags-luggage");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch Parent Categories marked for Home Promo (showInHome=true)
  const { data: homeCatsResponse } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ["home-landing-categories"],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5001/api/v1/categories?showInHome=true&status=active&isDeleted=false&limit=6`
      );
      if (!res.ok) throw new Error("Failed to fetch home categories");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const queryHomeCats = homeCatsResponse?.data || [];
  const parentCatsFromAll = allCategories.filter(
    (c) => !c.parentCategory && c.status !== "inactive"
  );

  // Fallback cards if admin hasn't marked 3 categories yet
  const defaultFallbackCards = [
    {
      name: "Lifestyle Accessories",
      slug: "lifestyle-accessories",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    },
    {
      name: "Watch & Accessories",
      slug: "watch-accessories",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
    },
    {
      name: "Backpacks & Luggage",
      slug: "bags-luggage",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    },
  ];

  // Resolve 3 landing cards to display
  let landingCards: any[] = [];
  if (queryHomeCats.length > 0) {
    landingCards = queryHomeCats;
  } else if (initialHomeCategories.length > 0) {
    landingCards = initialHomeCategories;
  } else if (parentCatsFromAll.length > 0) {
    landingCards = parentCatsFromAll;
  } else {
    landingCards = defaultFallbackCards;
  }

  // Fetch products for selected category using TanStack Query
  const { data: apiResponse, isLoading } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ["trending-products", activeTab],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5001/api/v1/products?category=${activeTab}&limit=12`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes for instant tab switching
  });

  const apiProducts = apiResponse?.data || [];
  const displayProducts =
    apiProducts.length > 0
      ? apiProducts
      : categoryFallbackProducts[activeTab] ||
        categoryFallbackProducts["bags-luggage"];

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
        {/* TOP BANNER CARDS: Exclusive Festive Collections (Image 1) */}
        {/* ========================================================= */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              Gadget Festive
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              Limited Edition Offers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {landingCards.slice(0, 3).map((item, idx) => (
              <Link
                key={item._id || item.slug || idx}
                href={`/${item.slug}`}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden h-[140px] sm:h-[160px] border border-gray-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer block bg-slate-900"
              >
                {/* Background Category Image */}
                <img
                  src={item.image || "/img/sbb1.png"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 brightness-90 group-hover:brightness-95"
                />

                {/* Dark Gradient Overlay for Crisp Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-black tracking-widest text-cyan-300">
                    Exclusive Collection
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white tracking-wide truncate mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-xs text-white/90 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform mt-1">
                    <span>Explore Collection</span>{" "}
                    <FiArrowRight size={13} className="text-[#FF5A5A]" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

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
              {trendingCategories.map((cat) => {
                const isActive = activeTab === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveTab(cat.slug)}
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
              ) : (
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

