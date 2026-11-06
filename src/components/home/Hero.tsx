"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useBannersQuery, IBannerItem } from "@/lib/api/queries";

interface HeroProps {
  initialBanners?: IBannerItem[];
}

const Hero: React.FC<HeroProps> = ({ initialBanners }) => {
  const { data: bannerResponse } = useBannersQuery();
  const apiBanners: IBannerItem[] = bannerResponse?.data || initialBanners || [];

  // Categorize banners based on placement
  const sliderBanners = apiBanners.filter(
    (b) => !b.placement || b.placement === "slider"
  );
  const sideTopBanner = apiBanners.find((b) => b.placement === "side_top");
  const sideMiddleBanner = apiBanners.find((b) => b.placement === "side_middle");
  const sideBottomBanner = apiBanners.find((b) => b.placement === "side_bottom");

  // Helper to resolve the correct destination link (supports category dropdown and custom links)
  const resolveBannerLink = (banner?: any): string => {
    if (!banner) return "/shop";
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

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const hasMultipleSlides = sliderBanners.length > 1;

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (!hasMultipleSlides || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasMultipleSlides, isHovered, sliderBanners.length]);

  // Keep index within bounds if banners change
  useEffect(() => {
    if (currentSlide >= sliderBanners.length && sliderBanners.length > 0) {
      setCurrentSlide(0);
    }
  }, [sliderBanners.length, currentSlide]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sliderBanners.length === 0) return;
    setCurrentSlide(
      (prev) => (prev - 1 + sliderBanners.length) % sliderBanners.length
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sliderBanners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % sliderBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && hasMultipleSlides) {
      handleNext();
    } else if (distance < -minSwipeDistance && hasMultipleSlides) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="container mx-auto px-2.5 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-3 sm:pb-8">
      {/* ===== HERO BANNER SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 items-stretch">
        {/* ========================================================= */}
        {/* LEFT COLUMN: HERO SLIDING CAROUSEL (~68-70% width)         */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 xl:col-span-8">
          <div
            className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-[#081621] group select-none
                       aspect-[16/9] sm:aspect-[16/8] md:aspect-[21/9] lg:aspect-auto lg:h-[480px] xl:h-[510px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sliderBanners.length > 0 ? (
              // User uploaded slider banners
              sliderBanners.map((banner, index) => {
                const isActive = index === currentSlide;
                const slideContent = (
                  <div className="relative w-full h-full">
                    {banner.mobileImage ? (
                      <>
                        <div className="block sm:hidden relative w-full h-full">
                          <Image
                            src={banner.mobileImage}
                            alt={banner.title || `Hero banner ${index + 1}`}
                            fill
                            priority={index === 0}
                            quality={95}
                            sizes="100vw"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="hidden sm:block relative w-full h-full">
                          <Image
                            src={banner.image}
                            alt={banner.title || `Hero banner ${index + 1}`}
                            fill
                            priority={index === 0}
                            quality={95}
                            sizes="(max-width: 1024px) 100vw, 950px"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </>
                    ) : (
                      <Image
                        src={banner.image}
                        alt={banner.title || `Hero banner ${index + 1}`}
                        fill
                        priority={index === 0}
                        quality={95}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 950px"
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                );

                return (
                  <div
                    key={banner._id || index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    {resolveBannerLink(banner) ? (
                      <Link
                        href={resolveBannerLink(banner)}
                        className="block w-full h-full cursor-pointer"
                        tabIndex={isActive ? 0 : -1}
                      >
                        {slideContent}
                      </Link>
                    ) : (
                      slideContent
                    )}
                  </div>
                );
              })
            ) : (
              // Default Fallback Slider Banner (When no slider banners uploaded yet)
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a29] via-[#081621] to-[#1a1215] flex flex-col justify-center p-6 sm:p-12 text-white">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FF5A5A]/20 text-[#FF5A5A] border border-[#FF5A5A]/30 w-fit mb-3">
                  🔥 Special Deals & Mega Offers
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-xl">
                  Mega Gadget & Lifestyle Collection
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-md">
                  Discover authentic smart gadgets, computer accessories, and premier clothing with official warranty.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-lg shadow-[#FF5A5A]/30 hover:opacity-95"
                  >
                    Shop Now <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Prev / Next Navigation Arrows (Only when > 1 slide) */}
            {hasMultipleSlides && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full
                             bg-black/50 hover:bg-black/80 text-white backdrop-blur-md shadow-md
                             flex items-center justify-center transition-all duration-200
                             opacity-0 group-hover:opacity-100 active:scale-95 focus:outline-none"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full
                             bg-black/50 hover:bg-black/80 text-white backdrop-blur-md shadow-md
                             flex items-center justify-center transition-all duration-200
                             opacity-0 group-hover:opacity-100 active:scale-95 focus:outline-none"
                >
                  <FiChevronRight size={20} />
                </button>

                {/* Star Tech Style Slide Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {sliderBanners.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`transition-all duration-300 rounded-full ${
                        i === currentSlide
                          ? "w-7 h-2 bg-[#FF5A5A]"
                          : "w-2.5 h-2 bg-white/50 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 3 STATIC PROMO CARDS (~30-32% width)         */}
        {/* Matches reference layout with 3 vertical side cards        */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-2 sm:gap-3 lg:h-[480px] xl:h-[510px]">
          {/* ----- 1. TOP SIDE BANNER ----- */}
          <div className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-[#101b2b] group border border-gray-100/80 aspect-[3.8/1] sm:aspect-[4.2/1] lg:aspect-auto lg:h-full lg:flex-1">
            {sideTopBanner ? (
              <Link
                href={resolveBannerLink(sideTopBanner)}
                className="block relative w-full h-full cursor-pointer"
              >
                <Image
                  src={sideTopBanner.mobileImage || sideTopBanner.image}
                  alt={sideTopBanner.title || "Side Top Promotion"}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>
            ) : (
              // Default Fallback Top Card (Marketplace / Gadgets & Appliances style)
              <Link
                href="/shop"
                className="block relative w-full h-full p-2.5 sm:p-4 lg:p-5 bg-gradient-to-r from-[#202738] via-[#2d3a54] to-[#3a4454] text-white flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-amber-300 bg-amber-400/20 px-1.5 sm:px-2 py-0.5 rounded">
                      MARKETPLACE
                    </span>
                    <h3 className="text-xs sm:text-base lg:text-lg font-bold mt-0.5 sm:mt-1 text-white leading-tight">
                      Gadgets & Appliances
                    </h3>
                    <p className="hidden sm:block text-[11px] text-gray-300 mt-0.5 line-clamp-1">
                      Air fryers, smart audio & daily electronics.
                    </p>
                  </div>
                  <div className="sm:hidden flex items-center gap-1 text-[11px] font-bold text-amber-300 shrink-0">
                    <span>Explore</span>
                    <FiArrowRight size={11} />
                  </div>
                </div>
                <div className="hidden sm:flex mt-2 items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Marketplace</span>
                  <FiArrowRight size={13} />
                </div>
              </Link>
            )}
          </div>

          {/* ----- 2. MIDDLE SIDE BANNER ----- */}
          <div className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-[#f8fafc] group border border-gray-100/80 aspect-[3.8/1] sm:aspect-[4.2/1] lg:aspect-auto lg:h-full lg:flex-1">
            {sideMiddleBanner ? (
              <Link
                href={resolveBannerLink(sideMiddleBanner)}
                className="block relative w-full h-full cursor-pointer"
              >
                <Image
                  src={sideMiddleBanner.mobileImage || sideMiddleBanner.image}
                  alt={sideMiddleBanner.title || "Side Middle Promotion"}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>
            ) : (
              // Default Fallback Middle Card (Lifestyle / Fashion style)
              <Link
                href="/shop"
                className="block relative w-full h-full p-2.5 sm:p-4 lg:p-5 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0f172a] text-white flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-cyan-200 bg-cyan-400/20 px-1.5 sm:px-2 py-0.5 rounded">
                      LIFESTYLE & WEAR
                    </span>
                    <h3 className="text-xs sm:text-base lg:text-lg font-bold mt-0.5 sm:mt-1 text-white leading-tight">
                      Live Better Lifestyle
                    </h3>
                    <p className="hidden sm:block text-[11px] text-cyan-100 mt-0.5 line-clamp-1">
                      Everyday casuals, formal wear & modern outfits.
                    </p>
                  </div>
                  <div className="sm:hidden flex items-center gap-1 text-[11px] font-bold text-cyan-200 shrink-0">
                    <span>View</span>
                    <FiArrowRight size={11} />
                  </div>
                </div>
                <div className="hidden sm:flex mt-2 items-center gap-1.5 text-xs font-bold text-cyan-200 group-hover:translate-x-1 transition-transform">
                  <span>View Collection</span>
                  <FiArrowRight size={13} />
                </div>
              </Link>
            )}
          </div>

          {/* ----- 3. BOTTOM SIDE BANNER ----- */}
          <div className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-[#0b0f19] group border border-gray-100/80 aspect-[3.8/1] sm:aspect-[4.2/1] lg:aspect-auto lg:h-full lg:flex-1">
            {sideBottomBanner ? (
              <Link
                href={resolveBannerLink(sideBottomBanner)}
                className="block relative w-full h-full cursor-pointer"
              >
                <Image
                  src={sideBottomBanner.mobileImage || sideBottomBanner.image}
                  alt={sideBottomBanner.title || "Side Bottom Promotion"}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>
            ) : (
              // Default Fallback Bottom Card (Streetwear / Modern Trends style)
              <Link
                href="/shop"
                className="block relative w-full h-full p-2.5 sm:p-4 lg:p-5 bg-gradient-to-r from-[#18181b] via-[#27272a] to-[#09090b] text-white flex flex-col justify-between group cursor-pointer border-t border-white/10"
              >
                <div className="flex items-center sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-[#FF8B5A] bg-[#FF5A5A]/20 px-1.5 sm:px-2 py-0.5 rounded">
                      EXCLUSIVE DROPS
                    </span>
                    <h3 className="text-xs sm:text-base lg:text-lg font-bold mt-0.5 sm:mt-1 text-white leading-tight">
                      DHEU • Trending Streetwear
                    </h3>
                    <p className="hidden sm:block text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                      Winter jackets, hoodies & urban apparel.
                    </p>
                  </div>
                  <div className="sm:hidden flex items-center gap-1 text-[11px] font-bold text-[#FF8B5A] shrink-0">
                    <span>Shop</span>
                    <FiArrowRight size={11} />
                  </div>
                </div>
                <div className="hidden sm:flex mt-2 items-center gap-1.5 text-xs font-bold text-[#FF8B5A] group-hover:translate-x-1 transition-transform">
                  <span>Shop The Drop</span>
                  <FiArrowRight size={13} />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===== ANNOUNCEMENT / STATUS BAR (Star Tech style ticker as in reference image) ===== */}
      <div className="hidden sm:flex mt-3.5 bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 shadow-2xs items-center justify-between text-xs text-gray-700 overflow-hidden">
        <div className="flex items-center gap-2 text-gray-800 shrink-0 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#FF5A5A] animate-pulse" />
          <span className="text-[#FF5A5A] uppercase tracking-wider text-[11px] font-black">
            Notice:
          </span>
        </div>
        <div className="overflow-hidden flex-1 mx-3">
          <p className="truncate text-gray-600 font-medium">
            Thursday, 05 November, All our branches are open. Additionally, online delivery is operational nationwide with genuine warranty.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 text-[11px] font-bold text-[#FF5A5A] hover:text-[#FF8B5A] hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Helpline 01783176838</span>
          <FiArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
