"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingBag, FiRepeat } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801783176838";
const WHATSAPP_MESSAGE = "হ্যালো, টেক মাহমুদ থেকে আমি একটি অর্ডার বা প্রোডাক্ট নিয়ে জানতে চাচ্ছি।";

const FloatingCartButton: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, totalPrice, isMiniCartOpen, openMiniCart } = useCart();
  const { openMobileMenu } = useUI();

  const isCheckoutPage = pathname === "/checkout";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP: STAR TECH STYLE FLOATING ACTION WIDGETS (RIGHT) */}
      {/* Matches media_1793862710239_e154c41e.png                */}
      {/* ========================================================= */}
      {!isCheckoutPage && (
        <aside
          aria-label="Quick Actions"
          className="hidden md:flex fixed right-0 bottom-24 z-50 flex-col gap-2 pointer-events-auto"
        >
          {/* COMPARE BUTTON */}
          <Link
            href="/shop"
            title="Product Comparison"
            className="group relative w-14 h-14 bg-[#081621] hover:bg-[#FF5A5A] text-white border-l-2 border-y border-[#FF5A5A]/30 rounded-l-lg shadow-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 bg-[#FF5A5A] group-hover:bg-[#081621] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              0
            </span>
            <FiRepeat size={18} className="text-gray-200 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-black tracking-wider text-gray-300 group-hover:text-white mt-0.5 uppercase">
              Compare
            </span>
          </Link>

          {/* CART BUTTON */}
          <button
            type="button"
            onClick={openMiniCart}
            title="View Shopping Cart"
            className="group relative w-14 h-14 bg-[#081621] hover:bg-[#FF5A5A] text-white border-l-2 border-y border-[#FF5A5A]/30 rounded-l-lg shadow-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 bg-[#FF5A5A] group-hover:bg-[#081621] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {totalItems}
            </span>
            <FiShoppingBag size={18} className="text-[#FF5A5A] group-hover:text-white transition-colors" />
            <span className="text-[9px] font-black tracking-wider text-gray-300 group-hover:text-white mt-0.5 uppercase">
              Cart
            </span>
          </button>
        </aside>
      )}

      {/* ========================================================= */}
      {/* MOBILE BOTTOM BAR                                         */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center bg-[#081621] border-t border-gray-800 shadow-2xl px-3 py-2 gap-2.5">
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all shrink-0"
          aria-label="WhatsApp Chat"
        >
          <FaWhatsapp size={20} />
        </button>

        {isCheckoutPage ? (
          <button
            type="submit"
            form="checkout-form"
            className="flex-1 py-2.5 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            Confirm Order
          </button>
        ) : totalItems > 0 ? (
          <Link
            href="/checkout"
            className="flex-1 py-2.5 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-between px-3.5 active:scale-95 transition-all shadow-md"
          >
            <span>Order Now</span>
            <span className="font-mono text-xs font-black">৳{totalPrice.toLocaleString()}</span>
          </Link>
        ) : (
          <Link
            href="/shop"
            className="flex-1 py-2.5 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-between px-3.5 active:scale-95 transition-all shadow-md"
          >
            <span>Browse Shop</span>
            <span className="font-mono text-xs font-black">৳0</span>
          </Link>
        )}

        <button
          type="button"
          onClick={openMiniCart}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-gray-700 bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 cursor-pointer"
          aria-label="Open Cart"
        >
          <FiShoppingBag size={19} className="text-[#FF5A5A]" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-[#FF5A5A] text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingCartButton;
