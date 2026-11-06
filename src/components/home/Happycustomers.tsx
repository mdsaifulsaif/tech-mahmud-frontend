'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from "next/navigation";
import SectionHeader from '../shared/SectionHeader';
import { BiLeaf } from 'react-icons/bi';

/* =========================================================================
   Brand color: --color-primary: #FF5A5A
   This component expects the CSS variable to be defined globally, e.g.:
     :root { --color-primary: #FF5A5A; }
   ========================================================================= */

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */

export interface HappyCustomersProps {
  initialReviews?: any[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  timeAgo: string;
  quote: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string;
}

// API response shape (from /reviews/featured)
interface FeaturedReviewApiItem {
  _id: string;
  productID?: {
    _id: string;
    name: string;
    thumbnail?: string;
    slug?: string;
  };
  userID?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatar?: {
      public_id?: string;
      url?: string;
    };
  };
  rating: number;
  comment: string;
  status: string;
  isFeatured: boolean;
  featuredAt?: string;
  createdAt: string;
  updatedAt?: string;
  adminReply?: string;
}

/* ---------------------------------------------------------------------------
   Helpers: initials, avatar color, time-ago
--------------------------------------------------------------------------- */

const AVATAR_COLORS = ['#cfe3d1', '#f3d9d9', '#d8e3f3', '#e3d9f3', '#f3e6c9', '#cfe8e3'];

const getInitials = (firstName?: string, lastName?: string) => {
  const f = firstName?.trim()?.[0] ?? '';
  const l = lastName?.trim()?.[0] ?? '';
  return (f + l).toUpperCase() || 'U';
};

const timeAgo = (dateString: string) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [secondsInUnit, label] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

const mapReviewToTestimonial = (
  item: FeaturedReviewApiItem,
  index: number
): Testimonial => {
  const firstName = item.userID?.firstName ?? 'Anonymous';
  const lastName = item.userID?.lastName ?? '';

  return {
    id: item._id,
    name: `${firstName} ${lastName}`.trim(),
    role: 'Verified Customer',
    timeAgo: timeAgo(item.createdAt),
    quote: item.comment,
    initials: getInitials(firstName, lastName),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    avatarUrl: item.userID?.avatar?.url,
  };
};

/* ---------------------------------------------------------------------------
   UI Icons: Heart, Quote, Verified Check
--------------------------------------------------------------------------- */

const HeartIcon: React.FC<{ size?: number; filled?: boolean }> = ({
  size = 14,
  filled = true,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20.3S3.5 15.3 3.5 9.4A4.9 4.9 0 0 1 12 6.3a4.9 4.9 0 0 1 8.5 3.1c0 5.9-8.5 10.9-8.5 10.9Z"
      fill={filled ? 'var(--color-primary)' : 'none'}
      stroke="var(--color-primary)"
      strokeWidth={filled ? 0 : 1.8}
    />
  </svg>
);

const QuoteIcon = () => (
  <svg width="22" height="18" viewBox="0 0 32 24" fill="none">
    <path
      d="M3 24V14.8c0-5 2.7-8.7 8-11.2l1.8 3.3c-3.4 1.8-5 4-5 6.6h5V24H3Zm17 0V14.8c0-5 2.7-8.7 8-11.2l1.8 3.3c-3.4 1.8-5 4-5 6.6h5V24H20Z"
      fill="var(--color-primary)"
    />
  </svg>
);

const VerifiedCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.5l2.3 1.3 2.6-.2 1 2.4 2.4 1-.2 2.6L21.5 12l-1.4 2.2.2 2.6-2.4 1-1 2.4-2.6-.2L12 21.5l-2.3-1.5-2.6.2-1-2.4-2.4-1 .2-2.6L2.5 12l1.4-2.2-.2-2.6 2.4-1 1-2.4 2.6.2L12 2.5Z"
      fill="var(--color-primary)"
    />
    <path
      d="M8.5 12.3l2.2 2.2 4.5-4.8"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------------------------------------------------------------------------
   Avatar
--------------------------------------------------------------------------- */

const Avatar: React.FC<{ initials: string; color: string; imageUrl?: string }> = ({
  initials,
  color,
  imageUrl,
}) => {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={initials}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#2c4a2f]"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Testimonial card
--------------------------------------------------------------------------- */

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => (
  <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3e6]">
      <QuoteIcon />
    </span>

    <p className="mt-5 flex-1 text-[15px] leading-relaxed text-gray-700">{item.quote}</p>

    <span className="mt-5 block h-[3px] w-8 rounded-full bg-[var(--color-primary)]" />

    <div className="mt-4 flex items-center gap-3">
      <Avatar initials={item.initials} color={item.avatarColor} imageUrl={item.avatarUrl} />
      <div>
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-gray-900">{item.name}</p>
          <VerifiedCheckIcon />
        </div>
        <p className="text-sm font-medium text-[var(--color-primary)]">{item.role}</p>
        <p className="text-xs text-gray-400">{item.timeAgo}</p>
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------------------------
   Skeleton card (loading state / hydration fix)
--------------------------------------------------------------------------- */

const TestimonialSkeleton = () => (
  <div className="flex h-full animate-pulse flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <span className="h-10 w-10 rounded-full bg-gray-100" />
    <div className="mt-5 flex-1 space-y-2">
      <div className="h-3 w-full rounded bg-gray-100" />
      <div className="h-3 w-5/6 rounded bg-gray-100" />
      <div className="h-3 w-2/3 rounded bg-gray-100" />
    </div>
    <span className="mt-5 block h-[3px] w-8 rounded-full bg-gray-100" />
    <div className="mt-4 flex items-center gap-3">
      <div className="h-12 w-12 shrink-0 rounded-full bg-gray-100" />
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-gray-100" />
        <div className="h-3 w-20 rounded bg-gray-100" />
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------------------------
   Main component
--------------------------------------------------------------------------- */

export default function HappyCustomers({ initialReviews = [] }: HappyCustomersProps) {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const testimonials: Testimonial[] = initialReviews.map(
    (item: FeaturedReviewApiItem, index: number) =>
      mapReviewToTestimonial(item, index)
  );

  // Marquee-র স্মুথ লুপিংয়ের জন্য ডুপ্লিকেট অ্যারে
  const loopData =
    testimonials.length > 0
      ? [...testimonials, ...testimonials, ...testimonials]
      : [];

  return (
    <section className="py-6 sm:py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          icon={<BiLeaf size={18} />}
        />

        {/* ---------- Testimonial Marquee ---------- */}
        <div
          className="marquee-viewport mt-4 sm:mt-5 overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          }}
        >
          {/* Client Hydration হওয়া পর্যন্ত স্কেলিটন দেখানো হবে */}
          {!isMounted && (
            <div className="flex w-max gap-6 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="w-[300px] shrink-0 sm:w-[350px] lg:w-[380px]"
                >
                  <TestimonialSkeleton />
                </div>
              ))}
            </div>
          )}

          {/* Hydrated হওয়ার পর কোনো রিভিউ না থাকলে */}
          {isMounted && loopData.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-400">
              এখনো কোনো ফিচার্ড রিভিউ নেই।
            </p>
          )}

          {/* Hydrated হওয়ার পর রিভিউ ডাটা রেন্ডার হবে */}
          {isMounted && loopData.length > 0 && (
            <div className="marquee-track flex w-max gap-6 py-4">
              {loopData.map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="w-[300px] shrink-0 sm:w-[350px] lg:w-[380px]"
                >
                  <TestimonialCard item={t} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .marquee-track {
          animation-name: marquee-scroll;
          animation-duration: 45s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .marquee-viewport:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </section>
  );
}