'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount: number;
  image?: string;
  order: number;
  status?: string;
  isDeleted?: boolean;
}

const CategoryCard: React.FC<{ item: Category }> = ({ item }) => {
  return (
    <Link
      href={`/cat/${item.slug}`}
      className="group flex flex-col items-center rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-1.5 sm:p-2 shadow-xs transition-all duration-200 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 active:scale-[0.97]"
    >
      {/* Square Image Container - 1:1 Ratio */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#f8f9fa] flex items-center justify-center">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-1.5 sm:p-2 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-10 w-10 sm:h-12 sm:w-12">
              <ellipse cx="50" cy="70" rx="30" ry="9" fill="#c89b5c" />
              <circle cx="50" cy="45" r="18" fill="#5fb247" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-1.5 sm:mt-2 text-center w-full px-0.5">
        <h3 className="line-clamp-1 font-medium sm:font-semibold text-gray-800 text-[10px] sm:text-xs leading-tight">
          {item.name}
        </h3>
        <p className="mt-0.5 text-[8px] sm:text-[10px] text-gray-400 font-normal truncate">
          {item.productCount} {item.productCount === 1 ? 'Item' : 'Items'}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;