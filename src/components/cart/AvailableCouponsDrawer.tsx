"use client";

import React, { useState } from "react";
import {
  FiTag,
  FiX,
  FiCheck,
  FiCopy,
  FiClock,
  FiAlertCircle,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { useGetAvailableCouponsQuery } from "@/redux/api/couponApi";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface AvailableCouponsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
  currentSubtotal: number;
  appliedCouponCode?: string;
}

export default function AvailableCouponsDrawer({
  isOpen,
  onClose,
  onApplyCoupon,
  currentSubtotal,
  appliedCouponCode,
}: AvailableCouponsDrawerProps) {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id || (session?.user as any)?._id;
  const { data, isLoading } = useGetAvailableCouponsQuery(
    currentUserId ? { userID: currentUserId } : undefined,
    { skip: !isOpen }
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const coupons = data?.data || [];

  // Filter out private coupons belonging to other users
  const visibleCoupons = coupons.filter((coupon: any) => {
    const isUserSpecific =
      coupon.applicableTo === "specific_users" ||
      (coupon.specificUsers && coupon.specificUsers.length > 0);

    if (!isUserSpecific) return true;

    return (
      Boolean(currentUserId) &&
      (coupon.specificUsers || []).some(
        (u: any) => (u._id || u).toString() === currentUserId.toString()
      )
    );
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success(`Coupon code ${code} copied!`);
  };

  const handleApply = (code: string) => {
    onApplyCoupon(code);
    onClose();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Limited time";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-[var(--color-primary)] flex items-center justify-center">
              <FiTag size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Available Coupons</h3>
              <p className="text-xs text-gray-500">
                {visibleCoupons.length} offer{visibleCoupons.length !== 1 ? "s" : ""} available for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Coupons List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
            </div>
          ) : visibleCoupons.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                <FiTag size={28} />
              </div>
              <p className="font-bold text-gray-700">No active coupons available</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Check back soon or follow our social channels for festive promo codes!
              </p>
            </div>
          ) : (
            visibleCoupons.map((coupon: any) => {
              const isApplied =
                appliedCouponCode &&
                appliedCouponCode.toUpperCase() === coupon.code.toUpperCase();
              const isAmountEligible = !coupon.minPurchase || currentSubtotal >= coupon.minPurchase;
              const remaining = isAmountEligible ? 0 : Math.round(coupon.minPurchase - currentSubtotal);

              // Check if coupon is restricted to specific users
              const isUserSpecific =
                coupon.applicableTo === "specific_users" ||
                (coupon.specificUsers && coupon.specificUsers.length > 0);
              const isUserAllowed =
                !isUserSpecific ||
                (Boolean(currentUserId) &&
                  (coupon.specificUsers || []).some(
                    (u: any) => (u._id || u).toString() === currentUserId.toString()
                  ));

              const isEligible = isAmountEligible && isUserAllowed;

              const discountBadge =
                coupon.discountType === "percentage"
                  ? `${coupon.discountValue}% OFF`
                  : `৳${coupon.discountValue} FLAT OFF`;

              return (
                <div
                  key={coupon._id || coupon.code}
                  className={`rounded-2xl border p-4.5 transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                    isApplied
                      ? "border-[var(--color-primary)] bg-emerald-50/40 shadow-sm"
                      : isEligible
                      ? "border-emerald-200/80 bg-white hover:border-[var(--color-primary)] shadow-xs hover:shadow-md"
                      : "border-gray-200 bg-gray-50/50 opacity-80"
                  }`}
                >
                  <div>
                    {/* Top row: Discount & Code Badge */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-gray-900">{discountBadge}</span>
                          {coupon.maxDiscount > 0 && coupon.discountType === "percentage" && (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              Up to ৳{coupon.maxDiscount}
                            </span>
                          )}
                        </div>

                        {/* Applicability Scope Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          {(!coupon.applicableTo || coupon.applicableTo === "all") && (
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                              সকল পণ্যের জন্য
                            </span>
                          )}
                          {coupon.applicableTo === "specific_categories" && (
                            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                              শুধুমাত্র: {coupon.specificCategories?.map((c: any) => c.name || c.title).filter(Boolean).join(", ") || "নির্দিষ্ট ক্যাটাগরি"}
                            </span>
                          )}
                          {coupon.applicableTo === "specific_products" && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              নির্দিষ্ট পণ্য
                            </span>
                          )}
                          {coupon.applicableTo === "specific_users" && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              isUserAllowed
                                ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                                : "text-blue-800 bg-blue-50 border-blue-200"
                            }`}>
                              {isUserAllowed ? "🌟 আপনার জন্য স্পেশাল অফার" : "নির্বাচিত গ্রাহক স্পেশাল"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 font-medium mt-1">
                          {coupon.name || coupon.description || "Special offer on fresh produce"}
                        </p>
                      </div>

                      {/* Code Badge with 1-click copy */}
                      <button
                        type="button"
                        onClick={() => handleCopy(coupon.code)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-100 text-gray-800 hover:text-[var(--color-primary)] rounded-lg font-mono font-bold text-xs border border-dashed border-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Click to copy code"
                      >
                        {coupon.code}
                        {copiedCode === coupon.code ? (
                          <FiCheck size={12} className="text-emerald-600" />
                        ) : (
                          <FiCopy size={11} className="text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Condition & Expiry */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-2 flex-wrap">
                      {coupon.minPurchase > 0 && (
                        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                          Min. Order: ৳{coupon.minPurchase.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-400">
                        <FiClock size={11} />
                        Valid till {formatDate(coupon.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Apply action bar */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    {!isUserAllowed ? (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                          <FiAlertCircle size={13} />
                          শুধুমাত্র নির্বাচিত অন্য গ্রাহকের জন্য
                        </p>
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed"
                          disabled
                        >
                          অপ্রযোজ্য
                        </button>
                      </div>
                    ) : !isAmountEligible ? (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                          <FiAlertCircle size={13} />
                          Add ৳{remaining.toLocaleString()} more to apply
                        </p>
                        <button
                          type="button"
                          onClick={() => handleApply(coupon.code)}
                          className="px-3.5 py-1.5 bg-gray-200 text-gray-500 text-xs font-bold rounded-xl cursor-not-allowed"
                          disabled
                        >
                          Apply
                        </button>
                      </div>
                    ) : isApplied ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1">
                          <FiCheck size={14} /> Coupon Applied
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold text-emerald-700">Eligible on current cart</span>
                        <button
                          type="button"
                          onClick={() => handleApply(coupon.code)}
                          className="px-4 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          Apply Coupon
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/60 text-center">
          <p className="text-[11px] text-gray-400">
            Coupons are automatically validated against your order at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
