"use client";

import React from "react";
import Link from "next/link";
import { useBannersQuery, IBannerItem } from "@/lib/api/queries";

interface BottomPromoSectionProps {
  initialBanners?: IBannerItem[];
}

// Fallback high-res promotional banners matching the exact reference layout
const FALLBACK_BANNERS = {
  bottom_row1_col1: {
    _id: "fallback_bottom_row1_col1",
    title: "Wilderness & Outdoor Living",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
    link: "/lifestyle",
    slot: "bottom_row1_col1",
    isActive: true,
  },
  bottom_row1_col2: {
    _id: "fallback_bottom_row1_col2",
    title: "Everyday Tech Backpacks & Marketplace",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    link: "/accessories",
    slot: "bottom_row1_col2",
    isActive: true,
  },
  bottom_row2_col1: {
    _id: "fallback_bottom_row2_col1",
    title: "Puffer Vests & Men's Outdoor Winterwear",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop",
    link: "/fashion",
    slot: "bottom_row2_col1",
    isActive: true,
  },
  bottom_row2_col2: {
    _id: "fallback_bottom_row2_col2",
    title: "Countryside Equestrian Lifestyle & Pashminas",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    link: "/lifestyle",
    slot: "bottom_row2_col2",
    isActive: true,
  },
  bottom_row2_col3: {
    _id: "fallback_bottom_row2_col3",
    title: "Active Kids & Casual Playwear",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    link: "/lifestyle",
    slot: "bottom_row2_col3",
    isActive: true,
  },
  bottom_row2_col4: {
    _id: "fallback_bottom_row2_col4",
    title: "DHEU Trendsetting Streetwear & Hoodies",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    link: "/fashion",
    slot: "bottom_row2_col4",
    isActive: true,
  },
};

export default function BottomPromoSection({
  initialBanners = [],
}: BottomPromoSectionProps) {
  // 1. Fetch live banners from API (falls back to initialBanners passed from page)
  const { data: bannerResponse } = useBannersQuery("bottom_promo");
  const apiBanners: IBannerItem[] = bannerResponse?.data || initialBanners;

  // Filter active bottom promo banners
  const bottomPromos = apiBanners.filter(
    (b) =>
      b.isActive &&
      (b.placement === "bottom_promo" ||
        b.slot?.startsWith("bottom_row") ||
        b.slot === "bottom_row1_full" ||
        b.slot === "bottom_row1_col1" ||
        b.slot === "bottom_row1_col2" ||
        b.slot === "bottom_row2_col1" ||
        b.slot === "bottom_row2_col2" ||
        b.slot === "bottom_row2_col3" ||
        b.slot === "bottom_row2_col4")
  );

  // Helper to extract banner for each specific slot with backwards-compatibility
  const getBannerForSlot = (
    slotKey: keyof typeof FALLBACK_BANNERS,
    orderNum: number,
    alternativeKeys: string[] = []
  ): { banner: any; href: string } => {
    const found = bottomPromos.find(
      (b) =>
        b.slot === slotKey ||
        alternativeKeys.includes(b.slot as string) ||
        b.order === orderNum
    );
    const item = found || FALLBACK_BANNERS[slotKey];

    // Priority: Category slug -> custom link -> '#'
    let href = "#";
    const bannerItem = item as any;
    if (bannerItem.categorySlug) {
      const clean = bannerItem.categorySlug.toLowerCase().replace(/^-+|-+$/g, "");
      href = `/${clean}`;
    } else if (bannerItem.categoryID && typeof bannerItem.categoryID === "object" && bannerItem.categoryID.slug) {
      const clean = bannerItem.categoryID.slug.toLowerCase().replace(/^-+|-+$/g, "");
      href = `/${clean}`;
    } else if (bannerItem.link && bannerItem.link.trim() !== "") {
      href = bannerItem.link;
    }

    return { banner: item, href };
  };

  // Row 1: Left 2/3 (col1) and Right 1/3 (col2)
  const row1Col1 = getBannerForSlot("bottom_row1_col1", 1, ["bottom_row1_full", "row1_left"]);
  const row1Col2 = getBannerForSlot("bottom_row1_col2", 2, ["row1_right"]);

  // Row 2: Tall portrait columns (supports 3 or 4 cards)
  const row2Col1 = getBannerForSlot("bottom_row2_col1", 3, ["row2_1"]);
  const row2Col2 = getBannerForSlot("bottom_row2_col2", 4, ["row2_2"]);
  const row2Col3 = getBannerForSlot("bottom_row2_col3", 5, ["row2_3"]);
  const row2Col4 = getBannerForSlot("bottom_row2_col4", 6, ["row2_4"]);

  const row2Cards = [row2Col1, row2Col2, row2Col3, row2Col4].filter(
    (c) => c && c.banner && c.banner.isActive !== false
  );

  return (
    <section aria-label="Featured Promotions" className="py-4 sm:py-6 bg-transparent select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-4">
        {/* ============================================================ */}
        {/* ROW 1: 2 BANNERS (LEFT 2/3, RIGHT 1/3) - HEIGHT: 326px       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-stretch">
          {/* Left Banner: 2/3 Width (8 cols) */}
          {row1Col1.banner && (
            <div className="md:col-span-8 flex flex-col">
              <Link
                href={row1Col1.href}
                className="group relative block w-full h-[200px] sm:h-[260px] md:h-[326px] lg:h-[326px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100/90 shadow-2xs hover:shadow-lg transition-all duration-300 bg-slate-900 cursor-pointer"
              >
                <img
                  src={row1Col1.banner.image}
                  alt={row1Col1.banner.title || "Promotional Banner Left"}
                  className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </Link>
            </div>
          )}

          {/* Right Banner: 1/3 Width (4 cols) */}
          {row1Col2.banner && (
            <div className="md:col-span-4 flex flex-col">
              <Link
                href={row1Col2.href}
                className="group relative block w-full h-[200px] sm:h-[260px] md:h-[326px] lg:h-[326px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100/90 shadow-2xs hover:shadow-lg transition-all duration-300 bg-slate-900 cursor-pointer"
              >
                <img
                  src={row1Col2.banner.image}
                  alt={row1Col2.banner.title || "Promotional Banner Right"}
                  className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </Link>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ROW 2: TALL / PORTRAIT BANNERS - HEIGHT: 326px               */}
        {/* ============================================================ */}
        <div
          className={`grid gap-3.5 sm:gap-4 lg:gap-5 ${
            row2Cards.length === 4
              ? "grid-cols-2 md:grid-cols-4"
              : row2Cards.length === 3
              ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {row2Cards.map((colItem, idx) => {
            if (!colItem.banner) return null;

            return (
              <Link
                key={colItem.banner._id || `bottom_row2_col_${idx}`}
                href={colItem.href}
                className="group relative block w-full h-[220px] sm:h-[270px] md:h-[326px] lg:h-[326px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100/90 shadow-2xs hover:shadow-lg transition-all duration-300 bg-slate-900 cursor-pointer"
              >
                <img
                  src={colItem.banner.image}
                  alt={colItem.banner.title || `Promotional Banner ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
