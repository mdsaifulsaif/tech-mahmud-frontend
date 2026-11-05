"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiTag,
  FiArrowRight,
  FiTruck,
  FiGift,
  FiAward,
  FiZap,
} from "react-icons/fi";
import { useGetAvailableCouponsQuery } from "@/redux/api/couponApi";
import { useGetShippingConfigQuery } from "@/redux/api/shippingApi";
import { useSession } from "next-auth/react";

interface SmartUpsellNudgeProps {
  currentSubtotal: number;
  onApplyCoupon?: (code: string) => void;
  onOpenCouponDrawer?: () => void;
  appliedCouponCode?: string;
  appliedDiscountAmount?: number;
  freeShippingThreshold?: number; // fallback if not configured
  isFreeShipping?: boolean;
  compact?: boolean;
}

export default function SmartUpsellNudge({
  currentSubtotal,
  onApplyCoupon,
  onOpenCouponDrawer,
  appliedCouponCode,
  appliedDiscountAmount = 0,
  freeShippingThreshold: fallbackThreshold = 1000,
  isFreeShipping,
  compact = false,
}: SmartUpsellNudgeProps) {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id || (session?.user as any)?._id;

  // 1. Dynamic Shipping Config from DB
  const { data: shippingConfigData } = useGetShippingConfigQuery("local");
  const { data: couponsData } = useGetAvailableCouponsQuery(
    currentUserId ? { userID: currentUserId } : undefined
  );

  const availableCoupons = couponsData?.data || [];

  // Determine dynamic free delivery threshold from active shipping tiers
  const dynamicFreeDeliveryThreshold = useMemo(() => {
    const tiers = shippingConfigData?.data?.tiers;
    if (tiers && Array.isArray(tiers) && tiers.length > 0) {
      // Find tier with charge === 0
      const freeTier = tiers.find((t) => Number(t.charge) === 0);
      if (freeTier && freeTier.min !== undefined) {
        return Number(freeTier.min);
      }
    }
    return fallbackThreshold;
  }, [shippingConfigData, fallbackThreshold]);

  // Multi-tier Gamified Milestones Calculation
  const milestoneState = useMemo(() => {
    if (currentSubtotal <= 0) return null;

    const freeShippingTarget = dynamicFreeDeliveryThreshold;

    // Filter active coupons with minimum purchase & user eligibility
    const validCoupons = availableCoupons
      .filter((c: any) => {
        if (c.isActive === false || Number(c.minPurchase) <= 0) return false;
        const isUserSpecific =
          c.applicableTo === "specific_users" ||
          (c.specificUsers && c.specificUsers.length > 0);
        if (!isUserSpecific) return true;
        return (
          Boolean(currentUserId) &&
          (c.specificUsers || []).some(
            (u: any) => (u._id || u).toString() === currentUserId.toString()
          )
        );
      })
      .sort((a: any, b: any) => a.minPurchase - b.minPurchase);

    // Highest threshold for progress bar scale
    const highestCoupon = validCoupons[validCoupons.length - 1];
    const maxTarget = Math.max(
      freeShippingTarget,
      highestCoupon ? Number(highestCoupon.minPurchase) : freeShippingTarget
    );

    const isFreeShippingUnlocked =
      isFreeShipping === true || currentSubtotal >= freeShippingTarget;

    // Find the next upcoming coupon (subtotal < minPurchase)
    const upcomingCoupon = validCoupons.find(
      (c: any) => currentSubtotal < Number(c.minPurchase)
    );

    // Find unlocked coupons (subtotal >= minPurchase)
    const unlockedCoupons = validCoupons
      .filter((c: any) => currentSubtotal >= Number(c.minPurchase))
      .reverse();

    const bestUnlockedCoupon = unlockedCoupons[0];
    const isCouponApplied =
      Boolean(appliedCouponCode) || appliedDiscountAmount > 0;

    // ==========================================
    // STAGE 1: Free Delivery NOT yet unlocked
    // ==========================================
    if (!isFreeShippingUnlocked) {
      const remaining = Math.round(freeShippingTarget - currentSubtotal);
      const progressPercent = Math.min(
        100,
        Math.max(6, Math.round((currentSubtotal / freeShippingTarget) * 100))
      );

      return {
        stage: 1 as const,
        icon: FiTruck,
        badgeText: "স্টেপ ১: ফ্রি ডেলিভারি",
        headline: `আর মাত্র ৳${remaining.toLocaleString()} টাকার বাজার করলেই ফ্রি ডেলিভারি! 🚚`,
        subline: `ডেলিভারি চার্জ ০ করতে কার্টে আরও ৳${remaining.toLocaleString()} টাকার পণ্য যোগ করুন।`,
        progressPercent,
        remaining,
        targetAmount: freeShippingTarget,
        isFreeShippingUnlocked: false,
        actionType: "add_items" as const,
      };
    }

    // ==========================================
    // STAGE 2: Free Delivery UNLOCKED!
    // Building towards next discount coupon
    // ==========================================
    if (upcomingCoupon) {
      const remaining = Math.round(
        Number(upcomingCoupon.minPurchase) - currentSubtotal
      );
      const discountLabel =
        upcomingCoupon.discountType === "percentage"
          ? `${upcomingCoupon.discountValue}% ছাড়`
          : `৳${upcomingCoupon.discountValue} ছাড়`;

      const progressPercent = Math.min(
        100,
        Math.max(
          10,
          Math.round((currentSubtotal / Number(upcomingCoupon.minPurchase)) * 100)
        )
      );

      return {
        stage: 2 as const,
        icon: FiGift,
        badgeText: "স্টেপ ২: স্পেশাল ডিসকাউন্ট",
        headline: `🎉 ফ্রি ডেলিভারি আনলকড! আর ৳${remaining.toLocaleString()} যোগ করলে ${discountLabel}!`,
        subline: `কুপন '${upcomingCoupon.code}' ব্যবহার করতে আর মাত্র ৳${remaining.toLocaleString()} প্রয়োজন।`,
        progressPercent,
        remaining,
        targetAmount: Number(upcomingCoupon.minPurchase),
        couponCode: upcomingCoupon.code,
        discountLabel,
        isFreeShippingUnlocked: true,
        actionType: "add_items" as const,
      };
    }

    // ==========================================
    // STAGE 2B: Coupon Unlocked but NOT YET Applied
    // ==========================================
    if (bestUnlockedCoupon && !isCouponApplied) {
      const discountLabel =
        bestUnlockedCoupon.discountType === "percentage"
          ? `${bestUnlockedCoupon.discountValue}% ছাড়`
          : `৳${bestUnlockedCoupon.discountValue} ছাড়`;

      return {
        stage: 2 as const,
        icon: FiZap,
        badgeText: "কুপন আনলকড",
        headline: `🎉 আপনি ${discountLabel} আনলক করেছেন! কুপন '${bestUnlockedCoupon.code}' ব্যবহার করুন।`,
        subline: `ফ্রি ডেলিভারি সহ অতিরিক্ত সাশ্রয় উপভোগ করতে এখনই কুপন অ্যাপ্লাই করুন।`,
        progressPercent: 100,
        couponCode: bestUnlockedCoupon.code,
        discountLabel,
        isFreeShippingUnlocked: true,
        actionType: "apply_coupon" as const,
      };
    }

    // ==========================================
    // STAGE 3: Max Savings Unlocked & Active!
    // ==========================================
    return {
      stage: 3 as const,
      icon: FiAward,
      badgeText: "সর্বোচ্চ সেভিংস আনলকড 🔥",
      headline: `🔥 অভিনন্দন! আপনি আজকের অর্ডারে সর্বোচ্চ সেভিংস আনলক করেছেন!`,
      subline: `ফ্রি ডেলিভারি ${
        appliedDiscountAmount > 0
          ? `+ ৳${appliedDiscountAmount.toLocaleString()} কুপন ছাড় সক্রিয় রয়েছে।`
          : "উপভোগ করছেন!"
      }`,
      progressPercent: 100,
      isFreeShippingUnlocked: true,
      actionType: "celebration" as const,
    };
  }, [
    currentSubtotal,
    dynamicFreeDeliveryThreshold,
    availableCoupons,
    appliedCouponCode,
    appliedDiscountAmount,
  ]);

  if (!milestoneState) return null;

  const IconComponent = milestoneState.icon;

  if (compact) {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs transition-all">
        <div className="flex items-start gap-2.5">
          {/* Icon */}
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
              milestoneState.stage === 3
                ? "bg-amber-500 text-white"
                : milestoneState.stage === 2
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            <IconComponent size={16} />
          </div>

          {/* Text Content: Full headline and subline without truncation */}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug">
              {milestoneState.headline}
            </h4>
            <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
              {milestoneState.subline}
            </p>

            {/* Action Buttons: Wrap cleanly under the message */}
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              {milestoneState.actionType === "apply_coupon" &&
              milestoneState.couponCode &&
              onApplyCoupon ? (
                <button
                  type="button"
                  onClick={() => onApplyCoupon(milestoneState.couponCode!)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <FiTag size={12} />
                  <span>অ্যাপ্লাই {milestoneState.couponCode}</span>
                </button>
              ) : milestoneState.actionType === "add_items" ? (
                <Link
                  href="/search"
                  className="px-3 py-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-lg shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>+যোগ করুন</span>
                  <FiArrowRight size={11} />
                </Link>
              ) : null}

              {onOpenCouponDrawer && (
                <button
                  type="button"
                  onClick={onOpenCouponDrawer}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 text-[11px] font-bold rounded-lg shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>🎟️</span>
                  <span>Available Coupons</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mini progress bar with progress details */}
        <div className="mt-2.5 pt-2 border-t border-emerald-200/50">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
            <span className="text-emerald-900 flex items-center gap-1">
              <FiTruck size={11} className="text-emerald-600" />
              কার্ট প্রগ্রেস
            </span>
            <span className="font-mono text-emerald-800">
              ৳{currentSubtotal.toLocaleString()} / ৳
              {(milestoneState.targetAmount || dynamicFreeDeliveryThreshold).toLocaleString()} (
              {milestoneState.progressPercent}%)
            </span>
          </div>
          <div className="relative h-1.5 w-full bg-emerald-100/90 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                milestoneState.stage === 3
                  ? "bg-gradient-to-r from-emerald-500 to-amber-500"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}
              style={{ width: `${milestoneState.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon & Text Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 ${
              milestoneState.stage === 3
                ? "bg-amber-500 text-white shadow-amber-200"
                : milestoneState.stage === 2
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            <IconComponent size={22} className="animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wide inline-flex items-center gap-1 ${
                  milestoneState.stage === 3
                    ? "bg-amber-100 text-amber-900 border border-amber-200"
                    : milestoneState.stage === 2
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    : "bg-teal-100/90 text-teal-900 border border-teal-200"
                }`}
              >
                {milestoneState.badgeText}
              </span>

              {milestoneState.isFreeShippingUnlocked && (
                <span className="text-[10px] font-bold text-emerald-700 bg-white/90 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  <FiCheckCircle size={11} className="text-emerald-600" /> ফ্রি
                  ডেলিভারি
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug tracking-tight">
              {milestoneState.headline}
            </h4>

            <p className="text-[11px] sm:text-xs text-gray-600 font-medium">
              {milestoneState.subline}
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
          {milestoneState.actionType === "apply_coupon" &&
          milestoneState.couponCode &&
          onApplyCoupon ? (
            <button
              type="button"
              onClick={() => onApplyCoupon(milestoneState.couponCode!)}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FiTag size={14} />
              অ্যাপ্লাই {milestoneState.couponCode}
            </button>
          ) : milestoneState.actionType === "add_items" ? (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Link
                href="/search"
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 hover:border-emerald-400 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                আরো যোগ করুন <FiArrowRight size={13} />
              </Link>
              {onOpenCouponDrawer && (
                <button
                  type="button"
                  onClick={onOpenCouponDrawer}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 text-xs font-bold rounded-xl shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>🎟️</span>
                  <span>Available Coupons</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="text-xs font-bold text-emerald-700 bg-white/80 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs inline-flex items-center gap-1">
                <FiCheckCircle size={14} className="text-emerald-600" /> সেভিংস সক্রিয়
              </span>
              {onOpenCouponDrawer && (
                <button
                  type="button"
                  onClick={onOpenCouponDrawer}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 text-xs font-bold rounded-xl shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>🎟️</span>
                  <span>Available Coupons</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unified Multi-Tier Progress Bar */}
      <div className="mt-3.5 pt-3 border-t border-emerald-200/60">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 mb-1.5">
          <span className="flex items-center gap-1 text-emerald-900">
            <FiTruck size={12} className="text-emerald-600" /> কার্ট প্রগ্রেস
          </span>
          <span className="font-mono text-emerald-800">
            ৳{currentSubtotal.toLocaleString()} / ৳
            {(milestoneState.targetAmount || dynamicFreeDeliveryThreshold).toLocaleString()} (
            {milestoneState.progressPercent}%)
          </span>
        </div>

        <div className="relative h-2.5 w-full bg-emerald-100/90 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              milestoneState.stage === 3
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
            style={{ width: `${milestoneState.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
