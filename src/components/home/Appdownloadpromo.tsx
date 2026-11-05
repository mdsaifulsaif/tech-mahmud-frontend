'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSubscribeNewsletterMutation } from '@/redux/api/subscriberApi';
import toast from 'react-hot-toast';

/* =========================================================================
   Brand color: --color-primary: #FF5A5A
   Expects the CSS variable defined globally:
     :root { --color-primary: #FF5A5A; }
   ========================================================================= */

/* ---------------------------------------------------------------------------
   Icons
--------------------------------------------------------------------------- */

const PhoneOutlineIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="var(--color-primary)" strokeWidth="1.8" />
    <path d="M10 19h4" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const BellSolidIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = 'var(--color-primary)',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3a5 5 0 0 0-5 5v3.2c0 1-.4 2-1.1 2.7L4.5 15.4c-.6.6-.2 1.6.6 1.6h13.8c.8 0 1.2-1 .6-1.6l-1.4-1.5a3.8 3.8 0 0 1-1.1-2.7V8a5 5 0 0 0-5-5Z"
      fill={color}
    />
    <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const GooglePlayGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M4 3.5v17a1 1 0 0 0 1.5.87l13-8.5a1 1 0 0 0 0-1.74l-13-8.5A1 1 0 0 0 4 3.5Z" fill="#fff" />
    <path d="M4 3.5 15.5 12 4 20.5z" fill="#34a853" />
    <path d="M4 3.5 17 11l-13 .9z" fill="#4285f4" />
    <path d="M4 20.5 17 13l-13-.9z" fill="#fbbc05" />
    <path d="M15.5 12 4 3.5 19 8z" fill="#ea4335" />
  </svg>
);

const AppleGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
    <path d="M16.4 2.2c.1 1.1-.3 2.2-1 3-.7.8-1.8 1.4-2.9 1.3-.1-1.1.3-2.2 1-3 .8-.9 2-1.4 2.9-1.3ZM20 17.2c-.5 1.2-.8 1.8-1.5 2.8-1 1.4-2.3 3.2-4 3.2-1.5 0-1.9-.9-3.6-.9-1.7 0-2.2.9-3.7.9-1.7 0-2.9-1.6-4-3-1.7-2.4-2.9-6.5-1.2-9.4.9-1.6 2.4-2.6 4-2.6 1.5 0 2.5.9 3.6.9 1.1 0 1.9-.9 3.6-.9 1.4 0 2.8.7 3.7 1.9-3.3 1.9-2.8 6.4.1 7.1Z" />
  </svg>
);

/* ---------------------------------------------------------------------------
   Store badges — compact size (generic "download" pill style, not exact
   trademark art)
--------------------------------------------------------------------------- */

const StoreBadge: React.FC<{ store: 'google' | 'apple' }> = ({ store }) => (
  <button
    type="button"
    className="flex items-center gap-1.5 rounded-lg bg-[#15181c] px-3 py-1.5 transition hover:bg-black"
  >
    {store === 'google' ? <GooglePlayGlyph /> : <AppleGlyph />}
    <div className="text-left leading-tight">
      <p className="text-[8px] leading-tight text-gray-300">
        {store === 'google' ? 'GET IT ON' : 'Download on the'}
      </p>
      <p className="text-xs font-semibold leading-tight text-white">
        {store === 'google' ? 'Google Play' : 'App Store'}
      </p>
    </div>
  </button>
);

/* ---------------------------------------------------------------------------
   Main component
--------------------------------------------------------------------------- */

const AppDownloadPromo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, { isLoading: isSubscribing }] = useSubscribeNewsletterMutation();

  return (
    <section className="py-6 sm:py-8 bg-[#f5f8f1]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
          {/* ==================== LEFT: copy ==================== */}
          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:py-12">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 px-3.5 py-1 text-xs font-bold tracking-wide text-[var(--color-primary)]">
              <PhoneOutlineIcon />
              COMING SOON
            </span>

            <h2 className="text-2xl font-extrabold leading-tight text-[#1c2b22] sm:text-3xl lg:text-[2.1rem]">
              Download the{' '}
              <span className="text-[var(--color-primary)]">Tech Mahmud</span> App
            </h2>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Shop easier, faster &amp; get exclusive offers!
            </p>

            {/* notify me bar */}
            <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white/60 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                  <BellSolidIcon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--color-primary)]">
                    Be the first to know!
                  </p>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Get notified when our app launches.
                  </p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  try {
                    await subscribeNewsletter({ email: email.trim() }).unwrap();
                    toast.success("Thank you! You'll be notified when our app launches.");
                    setEmail("");
                  } catch (err: any) {
                    toast.error(err?.data?.message || "Failed to submit. Please try again.");
                  }
                }}
                className="flex w-full flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[var(--color-primary)] sm:flex-1"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {isSubscribing ? "Submitting..." : "Notify Me"}
                </button>
              </form>
            </div>

            {/* store badges (compact) */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <StoreBadge store="google" />
              <StoreBadge store="apple" />
            </div>
          </div>

          {/* ==================== RIGHT: phone mockup placeholder ==================== */}
          <div className="relative flex items-center justify-center overflow-hidden px-4 pb-6 sm:px-8 sm:pb-8 lg:h-auto lg:p-0">
            {/*
              Drop your own phone-mockup / vegetable composite image here.
              On mobile/tablet it scales by width (so it still reads at a
              natural size) but is capped by max-h so it can't blow up the
              section height; on desktop it's free to fill the right column.
            */}
            <Image
              src="/shapp.png"
              alt="Tech Mahmud app preview on a smartphone"
              width={640}
              height={520}
              className="h-auto max-h-[260px] w-full max-w-[320px] select-none object-contain drop-shadow-xl sm:max-h-[320px] sm:max-w-[380px] lg:absolute lg:bottom-0 lg:right-0 lg:h-full lg:max-h-none lg:w-auto lg:max-w-none lg:translate-x-2"
              priority
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadPromo;