"use client";

import React from "react";
import Link from "next/link";
import { FiHeart, FiTrash2, FiShoppingBag, FiChevronRight, FiCheck } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/redux";
import { removeFromWishlist, clearWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);
  const cartItems = useAppSelector((state) => state.cart?.items || []);

  const handleAddToCart = (item: any) => {
    dispatch(
      addToCart({
        id: String(item.id),
        productID: String(item.productID || item.id),
        name: item.name,
        price: item.price,
        mrp: item.mrp || item.regularPrice || item.price,
        image: item.image || item.thumbnail || "/placeholder.png",
        category: item.category || "",
        quantity: 1,
      })
    );
    toast.success("Added to cart! 🛍️");
  };

  const handleRemove = (id: string | number) => {
    dispatch(removeFromWishlist(id));
    toast.success("Item removed from wishlist");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      dispatch(clearWishlist());
      toast.success("Wishlist cleared");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
            Home
          </Link>
          <FiChevronRight size={14} />
          <span className="text-gray-800">Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                My Wishlist
              </h1>
              <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              আপনার পছন্দের পণ্যগুলো এখানে সংরক্ষণ করা আছে
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 border border-red-200 rounded-sm transition-all w-fit cursor-pointer"
            >
              <FiTrash2 size={13} />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-200 p-12 text-center shadow-xs max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart size={30} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              পণ্য দেখার সময় হার্ট (❤️) আইকনে ক্লিক করে যেকোনো পণ্য ফেভারিটে যোগ করতে পারেন।
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-sm text-xs font-bold transition-all shadow-xs"
            >
              <FiShoppingBag size={15} />
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {wishlistItems.map((item) => {
              const inCart = cartItems.some((ci) => String(ci.id) === String(item.id));
              const hasDiscount = (item.mrp || item.regularPrice || 0) > item.price;
              const discount = hasDiscount
                ? Math.round(
                    (((item.mrp || item.regularPrice || item.price) - item.price) /
                      (item.mrp || item.regularPrice || item.price)) *
                      100
                  )
                : item.discountPercent || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id || item._id)}
                    title="Remove from wishlist"
                    className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  >
                    <FiTrash2 size={13} />
                  </button>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-[#EA4335] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={item.image || item.thumbnail || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {item.category && (
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider line-clamp-1">
                          {item.category}
                        </p>
                      )}
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-[var(--color-primary)] transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          ৳{item.price}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ৳{item.mrp || item.regularPrice}
                          </span>
                        )}
                        {item.unit && (
                          <span className="ml-auto text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-2 rounded-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          inCart
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-[var(--color-primary)] hover:opacity-90 text-white"
                        }`}
                      >
                        {inCart ? (
                          <>
                            <FiCheck size={13} /> In Cart (+1)
                          </>
                        ) : (
                          <>
                            <FiShoppingBag size={13} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
