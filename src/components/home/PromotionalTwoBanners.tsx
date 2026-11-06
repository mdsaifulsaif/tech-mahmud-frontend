"use client";

import React from "react";
import Link from "next/link";
import { useBannersQuery, IBannerItem } from "@/lib/api/queries";

interface PromotionalTwoBannersProps {
  initialBanners?: IBannerItem[];
}

// Fallback graphics for 2-slot promotional banners (if not yet uploaded in dashboard)
const FALLBACK_BANNERS = {
  slot_1: {
    _id: "promo_2_slot_fallback_1",
    title: "Campaign Dual Banner Left",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200&auto=format&fit=crop",
    link: "/gadget",
    slot: "slot_1",
    isActive: true,
  },
  slot_2: {
    _id: "promo_2_slot_fallback_2",
    title: "Campaign Dual Banner Right",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    link: "/accessories",
    slot: "slot_2",
    isActive: true,
  },
};

export default function PromotionalTwoBanners({
  initialBanners = [],
}: PromotionalTwoBannersProps) {
  // Fetch fresh 2-slot promotional banners from API (falls back to initialBanners)
  const { data: bannerResponse } = useBannersQuery("promo_2_slot");
  const apiBanners: IBannerItem[] = bannerResponse?.data || initialBanners;

  // Filter only active 2-slot promotional banners
  const promoTwoBanners = apiBanners.filter(
    (b) =>
      b.isActive &&
      (b.placement === "promo_2_slot" ||
        b.placement === "promotional_2" ||
        b.slot === "slot_1" ||
        b.slot === "slot_2" ||
        b.slot === "left_2" ||
        b.slot === "right_2")
  );

  // Helper to find banner for a specific slot
  const getBannerForSlot = (slotKey: "slot_1" | "slot_2", orderNum: number) => {
    const found = promoTwoBanners.find(
      (b) =>
        b.slot === slotKey ||
        b.order === orderNum ||
        (slotKey === "slot_1" && (b.slot === "left" || b.slot === "left_2")) ||
        (slotKey === "slot_2" && (b.slot === "right" || b.slot === "right_2"))
    );
    return found || FALLBACK_BANNERS[slotKey];
  };

  const banner1 = getBannerForSlot("slot_1", 1);
  const banner2 = getBannerForSlot("slot_2", 2);

  // Helper to resolve the correct destination link (category or custom URL)
  const resolveLink = (banner: any): string => {
    if (banner.link && banner.link.trim() !== "" && banner.link !== "#") {
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
    return "/shop";
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-5 sm:my-8 select-none">
      {/* 2-Column Layout: 2 Equal Banners Side-by-Side (Pure Images, No Text/Button Overlays) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 items-stretch">
        {/* ========================================================== */}
        {/* SLOT 1: LEFT BANNER                                        */}
        {/* ========================================================== */}
        <div className="w-full flex flex-col">
          <Link
            href={resolveLink(banner1)}
            className="group relative w-full h-[140px] sm:h-[180px] lg:h-[230px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 block bg-gray-100 cursor-pointer"
          >
            <img
              src={banner1.image}
              alt={banner1.title || "Promotional Banner 1"}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>
        </div>

        {/* ========================================================== */}
        {/* SLOT 2: RIGHT BANNER                                       */}
        {/* ========================================================== */}
        <div className="w-full flex flex-col">
          <Link
            href={resolveLink(banner2)}
            className="group relative w-full h-[140px] sm:h-[180px] lg:h-[230px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 block bg-gray-100 cursor-pointer"
          >
            <img
              src={banner2.image}
              alt={banner2.title || "Promotional Banner 2"}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}