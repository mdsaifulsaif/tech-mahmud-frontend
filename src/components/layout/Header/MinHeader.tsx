"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiX,
  FiMenu,
  FiZap,
  FiGift,
  FiArrowRight,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiHeart,
} from "react-icons/fi";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductsQuery } from "@/lib/api/queries";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface MinHeaderProps {
  onToggleMobile?: () => void;
}

const MinHeader = ({ onToggleMobile }: MinHeaderProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const router = useRouter();
  const pathname = usePathname();

  const { totalItems: cartCount, totalPrice: cartTotal, openMiniCart } = useCart();
  const { totalWishlistItems: wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  const isUserTyping = useRef(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchDesktopRef = useRef<HTMLDivElement>(null);
  const searchMobileRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 250);

  // Fetch search suggestions
  const { data: suggestionData, isFetching: isSearching } = useProductsQuery(
    debouncedQuery.trim()
      ? { searchTerm: debouncedQuery.trim(), limit: 6 }
      : { searchTerm: "" }
  );

  const suggestedProducts = suggestionData?.data || [];
  const totalFound = suggestionData?.meta?.total || 0;

  // Outside click to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (
        searchDesktopRef.current &&
        !searchDesktopRef.current.contains(target) &&
        searchMobileRef.current &&
        !searchMobileRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true;
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  };

  const clearSearch = () => {
    isUserTyping.current = false;
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isUserTyping.current = false;
    setIsSearchOpen(false);
    setIsMobileSearchVisible(false);
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleSelectProduct = (productId: string, productName?: string) => {
    setIsSearchOpen(false);
    setIsMobileSearchVisible(false);
    isUserTyping.current = false;
    if (productName) {
      router.push(`/search?q=${encodeURIComponent(productName)}`);
    } else {
      router.push("/search");
    }
  };

  const renderSuggestionsDropdown = () => {
    const trimmed = searchQuery.trim();
    if (!isSearchOpen || !trimmed) return null;

    return (
      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-gray-900">
        {/* Loading */}
        {isSearching && suggestedProducts.length === 0 && (
          <div className="p-6 text-center text-sm font-medium text-gray-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#FF5A5A] rounded-full animate-spin" />
            <span>Searching products...</span>
          </div>
        )}

        {/* Results */}
        {!isSearching && suggestedProducts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-gray-700">
              No products found matching &ldquo;{trimmed}&rdquo;
            </p>
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="mt-3 text-xs font-bold text-[#FF5A5A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Browse all products <FiArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div>
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Matching Products</span>
              {totalFound > 0 && <span>{totalFound} found</span>}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {suggestedProducts.map((p: any) => {
                const currentPrice =
                  p.salePrice && p.salePrice > 0 ? p.salePrice : p.price || 0;
                const img = p.image || p.thumbnail || "/img/sbb1.png";

                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => handleSelectProduct(p._id, p.name)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden relative shrink-0 border border-gray-100 flex items-center justify-center">
                      <Image
                        src={img}
                        alt={p.name}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FF5A5A] transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs font-bold text-[#FF5A5A] mt-0.5">
                        ৳{currentPrice.toLocaleString()}
                      </p>
                    </div>
                    <FiArrowRight
                      size={14}
                      className="text-gray-300 group-hover:text-[#FF5A5A] transition-colors shrink-0"
                    />
                  </button>
                );
              })}
            </div>

            <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-xs font-bold text-[#FF5A5A] hover:underline"
              >
                View all results for &ldquo;{trimmed}&rdquo;
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#081621] text-white">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[72px] gap-3 sm:gap-6">
          {/* LEFT: Mobile Menu Button + Star Tech Styled Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <button
              onClick={onToggleMobile}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all md:hidden text-white"
              aria-label="Toggle Mobile Menu"
            >
              <FiMenu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              {/* Star Tech aesthetic logo */}
              <div className="flex items-center gap-2 select-none">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5A5A] to-[#FF8B5A] flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md shadow-[#FF5A5A]/30">
                  TM
                </div>
                <div className="flex flex-col leading-none">
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                      TECH
                    </span>
                    <span className="text-lg sm:text-xl font-black tracking-tight text-[#FF5A5A] ml-1">
                      MAHMUD
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                    Tech & Lifestyle
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* MIDDLE: Wide Search Bar matching Star Tech */}
          <div
            className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6 relative"
            ref={searchDesktopRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={handleSearchChange}
                className="w-full py-2.5 pl-4 pr-11 bg-white text-gray-900 placeholder-gray-400 text-sm rounded-md border-0 outline-none focus:ring-2 focus:ring-[#FF5A5A] transition-all shadow-inner"
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF5A5A] transition"
                  aria-label="Search"
                >
                  <FiSearch size={18} />
                </button>
              )}
            </form>

            {renderSuggestionsDropdown()}
          </div>

          {/* RIGHT: Quick Action Items (Star Tech Layout) */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchVisible((prev) => !prev)}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-xl md:hidden text-white"
              aria-label="Toggle Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Item 1: Offers */}
            <Link
              href="/shop"
              className="hidden lg:flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF5A5A]/15 text-[#FF5A5A] flex items-center justify-center group-hover:bg-[#FF5A5A] group-hover:text-white transition-all">
                <FiGift size={16} />
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-xs font-bold text-white group-hover:text-[#FF5A5A] transition-colors">
                  Offers
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Latest Offers
                </span>
              </div>
            </Link>

            {/* Item 2: Deals (Laptop / Gadget Mela) */}
            <Link
              href="/shop"
              className="hidden xl:flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF8B5A]/15 text-[#FF8B5A] flex items-center justify-center group-hover:bg-[#FF8B5A] group-hover:text-white transition-all">
                <FiZap size={16} />
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-xs font-bold text-white group-hover:text-[#FF8B5A] transition-colors">
                  Deals
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Special Deals
                </span>
              </div>
            </Link>

            {/* Item 3: Account (Login / Register / Profile) */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 group cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF5A5A] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.firstName ? user.firstName.charAt(0) : "U"}
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-xs font-bold text-white group-hover:text-[#FF5A5A] transition-colors flex items-center gap-1">
                      {user?.firstName || "Account"}
                      <FiChevronDown size={11} className="text-gray-400" />
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      My Profile
                    </span>
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2.5 group cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 text-[#FF5A5A] flex items-center justify-center group-hover:bg-[#FF5A5A] group-hover:text-white transition-all">
                    <FiUser size={16} />
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-xs font-bold text-white group-hover:text-[#FF5A5A] transition-colors">
                      Account
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Register or Login
                    </span>
                  </div>
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:text-[#FF5A5A] hover:bg-gray-50 transition"
                  >
                    <FiUser size={14} /> Profile
                  </Link>
                  <Link
                    href="/my-orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:text-[#FF5A5A] hover:bg-gray-50 transition"
                  >
                    <FiPackage size={14} /> My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:text-[#FF5A5A] hover:bg-gray-50 transition"
                  >
                    <FiHeart size={14} /> Wishlist ({wishlistCount})
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                  >
                    <FiLogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Item 4: Prominent CTA Button (PC Builder / Cart in Star Tech style) */}
            <button
              onClick={openMiniCart}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-md font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A] hover:opacity-95 active:scale-95 transition-all shadow-md shadow-[#FF5A5A]/25 cursor-pointer shrink-0"
            >
              <FiShoppingBag size={16} />
              <span className="hidden sm:inline">Cart</span>
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[11px] font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (When toggled on mobile) */}
        {isMobileSearchVisible && (
          <div
            className="md:hidden pb-3 pt-1 border-t border-white/10 relative"
            ref={searchMobileRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products, gadgets, clothing..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={handleSearchChange}
                autoFocus
                className="w-full py-2 pl-4 pr-10 bg-white text-gray-900 placeholder-gray-400 text-xs rounded-md border-0 outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <FiSearch size={16} />
              </button>
            </form>
            {renderSuggestionsDropdown()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MinHeader;
