"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeader from "../shared/SectionHeader";
import { BiLeaf } from "react-icons/bi";

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  status: string;
  isFeatured: boolean;
  showInHome: boolean;
  showInMenu: boolean;
  order: number;
  isDeleted: boolean;
  productCount: number;
}

interface TrustedBrandsProps {
  initialBrands?: Brand[];
}

const TrustedBrands: React.FC<TrustedBrandsProps> = ({ initialBrands = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeBrands = useMemo(() => {
    if (!initialBrands || initialBrands.length === 0) return [];
    return initialBrands.filter((b) => b.status === "active" && !b.isDeleted);
  }, [initialBrands]);

  // Duplicate brands for smooth infinite continuous marquee loop
  const marqueeBrands = useMemo(() => {
    if (activeBrands.length === 0) return [];
    return [...activeBrands, ...activeBrands, ...activeBrands, ...activeBrands];
  }, [activeBrands]);

  const handleSeeAll = () => {
    router.push("/brands");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  if (!isMounted) {
    return (
      <section className="py-6 sm:py-8 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Trusted Brands"
            icon={<BiLeaf size={18} />}
            actionLabel="See all"
            onAction={handleSeeAll}
          />
          <div className="flex gap-4 overflow-hidden py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-[130px] sm:w-[150px] h-[135px] bg-white border border-gray-100 rounded-2xl p-4 shadow-xs flex flex-col items-center justify-center space-y-2 animate-pulse shrink-0"
              >
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
                <div className="h-2 w-1/2 bg-gray-150 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Trusted Brands"
          icon={<BiLeaf size={18} />}
          actionLabel="See all"
          onAction={handleSeeAll}
        />

        {/* Continuous Smooth Marquee Track */}
        <div className="marquee-wrapper mt-3 overflow-hidden py-2 mask-gradient select-none">
          <div className="marquee-track flex gap-3.5 sm:gap-4 items-center">
            {marqueeBrands.map((brand: Brand, idx: number) => {
              const countText =
                brand.productCount > 0
                  ? `${brand.productCount} ${brand.productCount === 1 ? "Product" : "Products"}`
                  : "View Products";

              return (
                <Link
                  key={`${brand._id}-${idx}`}
                  href={`/search?brand=${brand.slug || brand.name?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group block bg-white border border-gray-100/90 rounded-2xl p-3 sm:p-3.5 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center shrink-0 w-[125px] sm:w-[145px] md:w-[155px] h-[130px] sm:h-[145px]"
                >
                  {/* Brand Logo Container */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-2">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name || "Brand logo"}
                        width={64}
                        height={64}
                        className="object-contain max-h-12 max-w-12 sm:max-h-14 sm:max-w-14 transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-base uppercase">
                        {brand.name?.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  {/* Brand Title */}
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-800 text-center capitalize line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {brand.name}
                  </h4>

                  {/* Product Count */}
                  <p className="text-[9px] sm:text-[10px] text-[var(--color-primary)] font-semibold text-center truncate mt-0.5">
                    {countText}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
        }
      `}</style>
    </section>
  );
};

export default TrustedBrands;