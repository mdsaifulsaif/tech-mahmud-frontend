"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { FiHeart, FiEye, FiShoppingBag, FiCheck } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import toast from "react-hot-toast";

export interface ProductCardProps {
  product: any;
  onQuickView?: (product?: any) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Extract ID & basic info
  const productId = product._id || product.id;
  const productName = product.name || product.title || "Untitled Product";
  const productSlug = product.slug || productId;
  const productHref = `/product/${productSlug}`;
  const productImage =
    product.thumbnail ||
    product.images?.[0] ||
    product.image ||
    "/img/placeholder.png";

  // Price calculations
  const salePrice = Number(product.salePrice || 0);
  const regularPrice = Number(product.regularPrice || product.price || 0);
  const price = salePrice > 0 ? salePrice : regularPrice;
  const hasDiscount = salePrice > 0 && regularPrice > salePrice;
  const discountSavings = regularPrice - price;
  const discountPercent =
    product.discountPercent ||
    (hasDiscount && regularPrice > 0
      ? Math.round((discountSavings / regularPrice) * 100)
      : 0);

  // Stock calculation
  let totalStock = product.stock !== undefined ? product.stock : 10;
  if (product.variants && product.variants.length > 0) {
    totalStock = product.variants.reduce(
      (sum: number, v: any) => sum + (v.stock || 0),
      0
    );
  }
  const isInStock = totalStock > 0;

  // Cart quantity check
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => String(item.id) === String(productId))
  );
  const quantity = cartItem?.quantity || 0;

  // Wishlist check
  const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(productId)
  );

  // Color indicators: extract from attributes or fallback
  const colorList: string[] =
    product.clothingAttributes?.colors?.map((c: any) => c.hexCode).filter(Boolean) ||
    product.variants
      ?.map((v: any) => v.attributes?.color?.hexCode)
      .filter(Boolean) ||
    product.colors ||
    [];

  // Auto close timer for quantity selector
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const startCloseTimer = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsQuantityOpen(false);
    }, 4500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleWishlist({
        id: productId,
        productID: String(productId),
        name: productName,
        price,
        mrp: regularPrice,
        regularPrice,
        image: productImage,
        thumbnail: productImage,
        category:
          product.categoryID?.name || product.categoryDetails?.name || "",
        rating: product.rating || 0,
        unit: product.unit || "1 pc",
        stock: totalStock,
        discountPercent,
      })
    );

    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    dispatch(
      addToCart({
        id: productId,
        productID: String(productId),
        name: productName,
        price,
        mrp: regularPrice,
        regularPrice,
        image: productImage,
        thumbnail: productImage,
        category:
          product.categoryID?.name || product.categoryDetails?.name || "",
        stock: totalStock,
        discountPercent,
      })
    );
    toast.success("Added to cart! 🛒");
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < totalStock) {
      dispatch(increaseQuantity(productId));
      startCloseTimer();
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 0) {
      dispatch(decreaseQuantity(productId));
      startCloseTimer();
    }
  };

  const handleQuickViewTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className={`group bg-white rounded-lg sm:rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all duration-300 relative h-full flex flex-col justify-between overflow-hidden cursor-pointer ${className}`}
    >
      {/* ============================================================ */}
      {/* 1. TOP IMAGE CONTAINER (Flush Edge-to-Edge with Card Borders) */}
      {/* ============================================================ */}
      <div className="relative w-full aspect-[3/4] bg-[#f5f5f7] overflow-hidden">
        {/* Top-Left 'New' Badge */}
        {(product.isNew || product.isNewCollection) && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#1d4ed8] text-white shadow-2xs">
            New
          </span>
        )}

        {/* Top-Right Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-bold tracking-tight bg-[#dc2626] text-white shadow-2xs">
            Save ৳ {discountSavings}
          </span>
        )}

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs z-10 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-gray-900/90 text-white text-[11px] font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Edge-to-Edge Product / Model Image */}
        <Link href={productHref} className="block relative w-full h-full">
          <img
            src={productImage}
            alt={productName}
            className={`w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out ${
              !isInStock ? "opacity-60 grayscale-[30%]" : ""
            }`}
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button (Discreet in corner) */}
        <button
          type="button"
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute ${
            hasDiscount ? "top-8 right-2.5" : "top-2.5 right-2.5"
          } z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 flex items-center justify-center transition shadow-2xs opacity-0 group-hover:opacity-100`}
        >
          <FiHeart
            size={14}
            className={`transition-transform ${
              isWishlisted ? "fill-red-500 text-red-500 scale-110" : ""
            }`}
          />
        </button>

        {/* Centered View Details Eye Icon Button on Hover */}
        <Link
          href={productHref}
          aria-label="View Product Details"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#1d4ed8] hover:bg-[#FF5A5A] text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
        >
          <FiEye size={17} />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM CONTENT BOX (With Generous Padding matching Demo)  */}
      {/* ============================================================ */}
      <div className="px-3.5 pt-3.5 pb-4 sm:px-4 sm:pt-4 sm:pb-5 flex flex-col items-center justify-center text-center bg-white flex-1">
        {/* Price Row */}
        <div className="flex items-center gap-1.5 justify-center">
          <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            ৳ {price}
          </span>
          {hasDiscount && (
            <span className="text-xs text-red-500 line-through font-medium">
              ৳ {regularPrice}
            </span>
          )}
        </div>

        {/* Color Swatches (Small rounded squares matching demo) */}
        {colorList.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 mb-1 justify-center">
            {colorList.slice(0, 3).map((colHex: string, cIdx: number) => (
              <span
                key={cIdx}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs border border-gray-300/80 shadow-2xs inline-block"
                style={{ backgroundColor: colHex }}
              />
            ))}
          </div>
        )}

        {/* Product Title */}
        <Link
          href={productHref}
          className="text-xs sm:text-sm font-medium text-gray-800 hover:text-[#FF5A5A] transition-colors text-center line-clamp-2 w-full block mt-1"
          title={productName}
        >
          {productName}
        </Link>

        {/* Subtle Quick Add / In Cart Indicator on hover or mobile */}
        {isInStock && (
          <div className="mt-2.5 pt-2 border-t border-gray-100 w-full flex items-center justify-center">
            {quantity === 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold text-[#FF5A5A] hover:text-white bg-[#FF5A5A]/10 hover:bg-[#FF5A5A] transition-all active:scale-95"
              >
                <FiShoppingBag size={12} />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-5 h-5 flex items-center justify-center font-black text-emerald-700 hover:bg-emerald-100 rounded text-xs"
                >
                  -
                </button>
                <span className="text-xs font-bold text-emerald-800 px-1">
                  {quantity} in cart
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= totalStock}
                  className="w-5 h-5 flex items-center justify-center font-black text-emerald-700 hover:bg-emerald-100 rounded text-xs disabled:opacity-30"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
