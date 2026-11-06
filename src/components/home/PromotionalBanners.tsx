"use client";

import React from "react";
import Link from "next/link";
import { useBannersQuery, IBannerItem } from "@/lib/api/queries";

interface PromotionalBannersProps {
  initialBanners?: IBannerItem[];
}

// Fallback graphic banners matching the reference modern apparel layout
const FALLBACK_BANNERS = {
  left: {
    _id: "promo_fallback_left",
    title: "Everyday Style for Modern Men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    link: "/fashion",
    slot: "left",
    isActive: true,
  },
  right_top: {
    _id: "promo_fallback_rt",
    title: "Classic Shirts Collection",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
    link: "/lifestyle",
    slot: "right_top",
    isActive: true,
  },
  right_bottom_left: {
    _id: "promo_fallback_rbl",
    title: "Polo Collection",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
    link: "/fashion",
    slot: "right_bottom_left",
    isActive: true,
  },
  right_bottom_right: {
    _id: "promo_fallback_rbr",
    title: "T-Shirts Collection",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    link: "/accessories",
    slot: "right_bottom_right",
    isActive: true,
  },
};

export default function PromotionalBanners({ initialBanners = [] }: PromotionalBannersProps) {
  // Fetch fresh promotional banners from API (falls back to initialBanners)
  const { data: bannerResponse } = useBannersQuery("promotional");
  const apiBanners: IBannerItem[] = bannerResponse?.data || initialBanners;

  // Filter only active promotional banners
  const promotionalBanners = apiBanners.filter(
    (b) =>
      b.isActive &&
      (b.placement === "promotional" ||
        b.placement === "promo_left" ||
        b.placement === "promo_right_top" ||
        b.placement === "promo_right_bottom_left" ||
        b.placement === "promo_right_bottom_right" ||
        b.slot === "left" ||
        b.slot === "right_top" ||
        b.slot === "right_bottom" ||
        b.slot === "right_bottom_left" ||
        b.slot === "right_bottom_right")
  );

  // Helper to find banner for a specific slot with legacy fallback
  const getBannerForSlot = (
    slotKey: keyof typeof FALLBACK_BANNERS,
    orderNum: number,
    alternativeKeys: string[] = []
  ) => {
    const found = promotionalBanners.find(
      (b) =>
        b.slot === slotKey ||
        alternativeKeys.includes(b.slot as string) ||
        b.order === orderNum
    );
    return found || FALLBACK_BANNERS[slotKey];
  };

  const leftBanner = getBannerForSlot("left", 1, ["promo_left"]);
  const rightTopBanner = getBannerForSlot("right_top", 2, ["promo_right_top"]);
  const rightBottomLeftBanner = getBannerForSlot("right_bottom_left", 3, [
    "right_bottom",
    "promo_right_bottom_left",
  ]);
  const rightBottomRightBanner = getBannerForSlot("right_bottom_right", 4, [
    "promo_right_bottom_right",
  ]);

  // Helper to resolve destination link
  const resolveLink = (banner: any): string => {
    if (banner.link && banner.link.trim() !== "") {
      return banner.link;
    }
    if (banner.categorySlug) {
      return `/${banner.categorySlug}`;
    }
    if (typeof banner.categoryID === "object" && banner.categoryID?.slug) {
      return `/${banner.categoryID.slug}`;
    }
    if (typeof banner.categoryID === "string" && banner.categoryID) {
      return `/${banner.categoryID}`;
    }
    return "/fashion";
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-5 sm:my-8 select-none">
      {/* 2-Column Grid: Left 1 Tall Banner, Right 1 Wide Banner + 2 Side-by-Side Banners */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-stretch">
        {/* ========================================================== */}
        {/* LEFT COLUMN: 1 Tall Banner (~50% width)                    */}
        {/* Height strictly locked to match right column total height  */}
        {/* ========================================================== */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col">
          <Link
            href={resolveLink(leftBanner)}
            className="group relative w-full h-[280px] sm:h-[380px] md:h-[740px] lg:h-[744px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 block bg-gray-100"
          >
            <img
              src={leftBanner.image}
              alt={leftBanner.title || "Promotional Banner Left"}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>
        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: 1 Wide Top Banner + 2 Side-by-Side Bottom     */}
        {/* ========================================================== */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 lg:gap-5 justify-between">
          {/* 1. TOP WIDE BANNER - Height: 362px */}
          <Link
            href={resolveLink(rightTopBanner)}
            className="group relative w-full h-[180px] sm:h-[240px] md:h-[362px] lg:h-[362px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 block bg-gray-100 shrink-0"
          >
            <img
              src={rightTopBanner.image}
              alt={rightTopBanner.title || "Promotional Banner Top"}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>

          {/* 2. BOTTOM 2 BANNERS SIDE-BY-SIDE - Height: 362px */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 h-[180px] sm:h-[240px] md:h-[362px] lg:h-[362px] shrink-0">
            {/* Bottom-Left Banner */}
            <Link
              href={resolveLink(rightBottomLeftBanner)}
              className="group relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 block bg-gray-100"
            >
              <img
                src={rightBottomLeftBanner.image}
                alt={rightBottomLeftBanner.title || "Promotional Banner Bottom Left"}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </Link>

            {/* Bottom-Right Banner */}
            <Link
              href={resolveLink(rightBottomRightBanner)}
              className="group relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 block bg-gray-100"
            >
              <img
                src={rightBottomRightBanner.image}
                alt={rightBottomRightBanner.title || "Promotional Banner Bottom Right"}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
