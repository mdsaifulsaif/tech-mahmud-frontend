"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronRight,
  FiStar,
  FiShoppingBag,
  FiZap,
  FiHeart,
  FiShare2,
  FiCheck,
  FiShield,
  FiTruck,
  FiRotateCcw,
  FiClock,
  FiAward,
  FiLayers,
  FiX,
  FiInfo,
  FiPlus,
  FiMinus,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertTriangle,
  FiHelpCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "@/redux/api/productApi";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/redux/api/reviewApi";
import { useAppDispatch, useAppSelector } from "@/redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import ProductCard from "@/components/shared/ProductCard";

interface ProductDetailsClientProps {
  slug: string;
}

export default function ProductDetailsClient({ slug }: ProductDetailsClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // 1. Fetch Product Data
  const {
    data: productResponse,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useGetProductByIdQuery(slug);

  const product = productResponse?.data || productResponse;
  const productId = product?._id;
  const categoryId =
    typeof product?.categoryID === "object"
      ? product?.categoryID?._id
      : product?.categoryID;

  // 2. Fetch Related Products
  const { data: relatedResponse, isLoading: isRelatedLoading } =
    useGetRelatedProductsQuery(
      { categoryId: categoryId as string, productId: productId as string },
      { skip: !categoryId || !productId }
    );
  const relatedProducts = relatedResponse?.data || [];

  // 3. Image Gallery States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // 4. Variant States (Color, Size, Storage/Version)
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // 5. Size Guide Modal State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // 6. Active Info Tab (Star Tech style: Specs, Description, Reviews, Warranty)
  const [activeTab, setActiveTab] = useState<
    "specifications" | "description" | "reviews" | "policy"
  >("specifications");

  // 7. Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [createReviewMutation] = useCreateReviewMutation();

  // 8. Fetch Product Reviews
  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = useGetProductReviewsQuery(
    { productId: productId as string, page: 1, limit: 20 },
    { skip: !productId }
  );
  const reviews = reviewsResponse?.data || [];
  const totalReviews =
    reviewsResponse?.meta?.total ?? product?.numReviews ?? reviews.length;

  // Extract all available colors from variants
  const colorOptions = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return [];
    const map = new Map<string, { name: string; hexCode: string; image?: string }>();
    product.variants.forEach((v: any) => {
      const color = v.attributes?.color;
      if (color?.name) {
        const key = color.name.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: color.name.trim(),
            hexCode: color.hexCode || "#000000",
            image: color.image || v.image,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [product?.variants]);

  // Extract all available sizes from variants (Clothing)
  const sizeOptions = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return [];
    const seen = new Set<string>();
    const sizes: string[] = [];
    product.variants.forEach((v: any) => {
      const size = v.attributes?.size;
      if (size) {
        const trimmed = size.trim().toUpperCase();
        if (!seen.has(trimmed)) {
          seen.add(trimmed);
          sizes.push(trimmed);
        }
      }
    });
    return sizes;
  }, [product?.variants]);

  // Extract all available storage options (Gadgets)
  const storageOptions = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return [];
    const seen = new Set<string>();
    const storages: string[] = [];
    product.variants.forEach((v: any) => {
      const st = v.attributes?.storage;
      if (st) {
        const trimmed = st.trim();
        if (!seen.has(trimmed)) {
          seen.add(trimmed);
          storages.push(trimmed);
        }
      }
    });
    return storages;
  }, [product?.variants]);

  // Auto initialize default selections when product loads
  useEffect(() => {
    if (colorOptions.length > 0 && !selectedColor) {
      setSelectedColor(colorOptions[0].name);
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      setSelectedSize(sizeOptions[0]);
    }
    if (storageOptions.length > 0 && !selectedStorage) {
      setSelectedStorage(storageOptions[0]);
    }
    setQuantity(1);
    setActiveImageIndex(0);
  }, [product, colorOptions, sizeOptions, storageOptions]);

  // Determine currently active variant based on selections
  const currentVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;

    // 1. Try to find an exact match for selected color, size, and storage
    const exact = product.variants.find((v: any) => {
      const matchColor =
        !selectedColor ||
        v.attributes?.color?.name?.trim().toLowerCase() ===
          selectedColor.trim().toLowerCase();
      const matchSize =
        !selectedSize ||
        v.attributes?.size?.trim().toUpperCase() ===
          selectedSize.trim().toUpperCase();
      const matchStorage =
        !selectedStorage ||
        v.attributes?.storage?.trim() === selectedStorage.trim();
      return matchColor && matchSize && matchStorage;
    });

    if (exact) return exact;

    // 2. Fallback: match by color first
    if (selectedColor) {
      const byColor = product.variants.find(
        (v: any) =>
          v.attributes?.color?.name?.trim().toLowerCase() ===
          selectedColor.trim().toLowerCase()
      );
      if (byColor) return byColor;
    }

    // 3. Fallback: match by size first
    if (selectedSize) {
      const bySize = product.variants.find(
        (v: any) =>
          v.attributes?.size?.trim().toUpperCase() ===
          selectedSize.trim().toUpperCase()
      );
      if (bySize) return bySize;
    }

    return product.variants[0];
  }, [product?.variants, selectedColor, selectedSize, selectedStorage]);

  // Gallery image list (main thumbnail + gallery images + variant image)
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (currentVariant?.image) {
      list.push(currentVariant.image);
    }
    if (product?.thumbnail && !list.includes(product.thumbnail)) {
      list.push(product.thumbnail);
    }
    if (Array.isArray(product?.images)) {
      product.images.forEach((img: string) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ["/img/sbb1.png"];
  }, [product, currentVariant]);

  // Price calculations
  const salePrice = Number(
    currentVariant?.salePrice !== undefined && currentVariant.salePrice > 0
      ? currentVariant.salePrice
      : product?.salePrice || 0
  );
  const regularPrice = Number(
    currentVariant?.regularPrice !== undefined && currentVariant.regularPrice > 0
      ? currentVariant.regularPrice
      : product?.regularPrice || 0
  );
  const activePrice = salePrice > 0 ? salePrice : regularPrice;
  const hasDiscount = salePrice > 0 && regularPrice > salePrice;
  const savings = hasDiscount ? regularPrice - salePrice : 0;
  const discountPercent =
    product?.discountPercent ||
    (hasDiscount && regularPrice > 0
      ? Math.round((savings / regularPrice) * 100)
      : 0);

  // Available stock
  const availableStock =
    currentVariant?.stock !== undefined
      ? currentVariant.stock
      : product?.stock !== undefined
      ? product.stock
      : 10;
  const isInStock = availableStock > 0;

  // Active SKU
  const activeSku = currentVariant?.sku || product?.sku || `TM-${productId?.slice(-6)?.toUpperCase()}`;

  // Average Rating
  const averageRating = useMemo(() => {
    if (reviews.length > 0) {
      const sum = reviews.reduce(
        (acc: number, r: any) => acc + (Number(r.rating) || 0),
        0
      );
      return Number((sum / reviews.length).toFixed(1));
    }
    return Number(product?.rating) || 5.0;
  }, [reviews, product?.rating]);

  // Wishlist state check
  const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(productId) || String(item._id) === String(productId)
  );

  // Cart item check
  const cartItems = useAppSelector((state) => state.cart?.items || []);
  const inCartItem = cartItems.find(
    (item) =>
      (String(item.id) === String(productId) || String(item._id) === String(productId)) &&
      (!currentVariant?._id || item.variantId === String(currentVariant._id))
  );

  // Handlers
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > availableStock) {
        toast.error(`Only ${availableStock} items available in stock!`);
        return availableStock;
      }
      return next;
    });
  };

  const handleColorSelect = (colorName: string, image?: string) => {
    setSelectedColor(colorName);
    if (image) {
      const idx = galleryImages.indexOf(image);
      if (idx > -1) {
        setActiveImageIndex(idx);
      }
    }
  };

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    dispatch(
      addToCart({
        id: String(productId),
        _id: String(productId),
        productID: String(productId),
        name: product.name,
        price: activePrice,
        salePrice: salePrice > 0 ? salePrice : undefined,
        regularPrice,
        mrp: regularPrice,
        image: galleryImages[activeImageIndex] || product.thumbnail,
        thumbnail: product.thumbnail,
        quantity,
        stock: availableStock,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        storage: selectedStorage || undefined,
        variantId: currentVariant?._id ? String(currentVariant._id) : undefined,
        variantID: currentVariant?._id ? String(currentVariant._id) : undefined,
        category:
          typeof product.categoryID === "object"
            ? product.categoryID?.name
            : "General",
        slug: product.slug || slug,
      })
    );
    toast.success(`Added ${quantity} item(s) to your cart! 🛒`);
  };

  const handleBuyNow = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    dispatch(
      addToCart({
        id: String(productId),
        _id: String(productId),
        productID: String(productId),
        name: product.name,
        price: activePrice,
        salePrice: salePrice > 0 ? salePrice : undefined,
        regularPrice,
        mrp: regularPrice,
        image: galleryImages[activeImageIndex] || product.thumbnail,
        thumbnail: product.thumbnail,
        quantity,
        stock: availableStock,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        storage: selectedStorage || undefined,
        variantId: currentVariant?._id ? String(currentVariant._id) : undefined,
        variantID: currentVariant?._id ? String(currentVariant._id) : undefined,
        category:
          typeof product.categoryID === "object"
            ? product.categoryID?.name
            : "General",
        slug: product.slug || slug,
      })
    );
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: String(productId),
        _id: String(productId),
        productID: String(productId),
        name: product.name,
        price: activePrice,
        mrp: regularPrice,
        regularPrice,
        image: galleryImages[0] || product.thumbnail,
        thumbnail: product.thumbnail,
        category:
          typeof product.categoryID === "object"
            ? product.categoryID?.name
            : "General",
        rating: averageRating,
        stock: availableStock,
        discountPercent,
      })
    );

    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleShareProduct = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard! 📋");
    }
  };

  const handleWhatsAppOrder = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    const phone =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801604321819";
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    let details = `Hello Tech Mahmud! I would like to order:\n` +
      `Product: ${product?.name}\n` +
      `Price: ৳${activePrice}\n` +
      `Quantity: ${quantity}\n`;

    if (selectedColor) details += `Color: ${selectedColor}\n`;
    if (selectedSize) details += `Size: ${selectedSize}\n`;
    if (selectedStorage) details += `Storage: ${selectedStorage}\n`;
    details += `Link: ${currentUrl}`;

    const encoded = encodeURIComponent(details);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please log in to submit a review.");
      router.push("/login");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please enter your review comment.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await createReviewMutation({
        productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      }).unwrap();
      toast.success("Thank you for your review! ⭐");
      setReviewComment("");
      refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Scroll smoothly to Specifications or Reviews tab
  const scrollToTab = (tab: "specifications" | "reviews") => {
    setActiveTab(tab);
    const element = document.getElementById("product-info-tabs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ---------------- Loading Skeleton ----------------
  if (isProductLoading) {
    return (
      <div className="container py-8 sm:py-12">
        <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 space-y-4">
            <div className="w-full aspect-[4/4] bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-28 bg-gray-100 rounded-xl animate-pulse" />
            <div className="w-1/2 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Not Found State ----------------
  if (isProductError || !product) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            The product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm hover:brightness-95 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryName =
    typeof product.categoryID === "object"
      ? product.categoryID?.name
      : "Products";
  const categorySlug =
    typeof product.categoryID === "object"
      ? product.categoryID?.slug
      : "";

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 sm:pb-24">
      {/* ============================================================ */}
      {/* 1. BREADCRUMBS BAR (Star Tech / Othoba Style)                 */}
      {/* ============================================================ */}
      <div className="bg-white border-b border-gray-200/90 py-3 shadow-2xs">
        <div className="container">
          <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-[var(--color-primary)] transition flex items-center gap-1 font-medium">
              Home
            </Link>
            <FiChevronRight className="text-gray-400 text-xs shrink-0" />
            {categorySlug ? (
              <Link
                href={`/${categorySlug}`}
                className="hover:text-[var(--color-primary)] transition font-medium"
              >
                {categoryName}
              </Link>
            ) : (
              <span className="font-medium text-gray-700">{categoryName}</span>
            )}
            <FiChevronRight className="text-gray-400 text-xs shrink-0" />
            <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        {/* ============================================================ */}
        {/* 2. MAIN PRODUCT SECTION (Gallery + Purchase Details)         */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 lg:p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* ---------------- LEFT: Image Gallery ---------------- */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Main Image Box */}
              <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-2xl border border-gray-200/80 overflow-hidden group flex items-center justify-center p-3 sm:p-4">
                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
                  {hasDiscount && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-[#dc2626] text-white shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.productType && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                      {product.productType}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-gray-600 hover:text-red-500 shadow-sm border border-gray-200/70 flex items-center justify-center transition active:scale-90"
                >
                  <FiHeart
                    size={18}
                    className={isWishlisted ? "fill-red-500 text-red-500 scale-110" : ""}
                  />
                </button>

                {/* Main Product Image */}
                <img
                  src={galleryImages[activeImageIndex] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setIsZoomModalOpen(true)}
                />

                {/* Stock Out Overlay */}
                {!isInStock && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs flex items-center justify-center z-20">
                    <span className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto pb-1.5 no-scrollbar">
                  {galleryImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 bg-[#F8FAFC] transition-all p-1 ${
                        activeImageIndex === idx
                          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges Strip (Othoba style below image) */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <FiShield className="text-[var(--color-primary)] shrink-0" size={16} />
                  <span className="font-semibold">100% Genuine</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <FiRotateCcw className="text-emerald-600 shrink-0" size={16} />
                  <span className="font-semibold">7 Days Return</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <FiTruck className="text-blue-600 shrink-0" size={16} />
                  <span className="font-semibold">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <FiAward className="text-amber-500 shrink-0" size={16} />
                  <span className="font-semibold">Warranty Assured</span>
                </div>
              </div>
            </div>

            {/* ---------------- RIGHT: Product Info & Actions ---------------- */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Top Meta Attributes Row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 pb-4 border-b border-gray-100 text-xs sm:text-sm">
                  {/* Rating */}
                  <button
                    type="button"
                    onClick={() => scrollToTab("reviews")}
                    className="flex items-center gap-1.5 hover:underline group"
                  >
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={14}
                          className={
                            star <= Math.round(averageRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800 ml-0.5">
                      {averageRating}
                    </span>
                    <span className="text-gray-500">
                      ({totalReviews} reviews)
                    </span>
                  </button>

                  <span className="text-gray-300">|</span>

                  {/* Stock Status Badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isInStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`font-bold ${
                        isInStock ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {isInStock
                        ? `In Stock (${availableStock} Units)`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <span className="text-gray-300">|</span>

                  {/* SKU / Product Code */}
                  <div className="text-gray-600">
                    <span className="text-gray-400">Product Code:</span>{" "}
                    <span className="font-semibold text-gray-800">{activeSku}</span>
                  </div>

                  {product.brandID && (
                    <>
                      <span className="text-gray-300">|</span>
                      <div className="text-gray-600">
                        <span className="text-gray-400">Brand:</span>{" "}
                        <span className="font-bold text-gray-900">
                          {typeof product.brandID === "object"
                            ? product.brandID.name
                            : product.brandID}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* ============================================================ */}
                {/* 2.1 STAR TECH SIGNATURE PRICE BOX                           */}
                {/* ============================================================ */}
                <div className="my-5 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-primary)] tracking-tight">
                      ৳ {activePrice.toLocaleString()}
                    </div>
                    {hasDiscount && (
                      <div className="text-sm sm:text-base text-gray-400 line-through font-medium">
                        ৳ {regularPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        Save ৳ {savings.toLocaleString()} ({discountPercent}% OFF)
                      </span>
                    </div>
                  )}
                </div>

                {/* ============================================================ */}
                {/* 2.2 KEY FEATURES / HIGHLIGHTS (Star Tech Signature Box)     */}
                {/* ============================================================ */}
                <div className="mb-6 p-4 rounded-xl border border-gray-200/70 bg-white">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center justify-between">
                    <span>Key Features / প্রধান বৈশিষ্ট্যসমূহ</span>
                    <button
                      type="button"
                      onClick={() => scrollToTab("specifications")}
                      className="text-[11px] font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 normal-case"
                    >
                      View Full Specs <FiChevronRight size={12} />
                    </button>
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                    {/* Warranty bullet */}
                    <li className="flex items-start gap-2">
                      <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-gray-900">Warranty:</strong>{" "}
                        {product.warranty?.hasWarranty
                          ? `${product.warranty.warrantyType || "Official Warranty"} (${
                              product.warranty.duration || "1 Year"
                            })`
                          : "7 Days Replacement Warranty & Authenticity Guarantee"}
                      </span>
                    </li>

                    {/* Top Specifications */}
                    {product.specifications && product.specifications.length > 0 ? (
                      product.specifications.slice(0, 4).map((spec: any, sIdx: number) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                          <span>
                            <strong className="text-gray-900">{spec.key}:</strong>{" "}
                            {spec.value}
                          </span>
                        </li>
                      ))
                    ) : (
                      <>
                        {product.shortDescription && (
                          <li className="flex items-start gap-2">
                            <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                            <span>{product.shortDescription}</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                          <span>Guaranteed original and QC checked before dispatch</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* ============================================================ */}
                {/* 2.3 VARIANT SELECTION (Clothing & Gadget Architecture)       */}
                {/* ============================================================ */}

                {/* COLOR SELECTION */}
                {colorOptions.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs sm:text-sm font-bold text-gray-900">
                        Color: <span className="text-[var(--color-primary)]">{selectedColor}</span>
                      </label>
                      <span className="text-[11px] text-gray-500">
                        {colorOptions.length} available colors
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2.5">
                      {colorOptions.map((col, idx) => {
                        const isSelected =
                          selectedColor.toLowerCase() === col.name.toLowerCase();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleColorSelect(col.name, col.image)}
                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isSelected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-gray-900 ring-2 ring-[var(--color-primary)]/20 shadow-xs"
                                : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-black/15 shadow-2xs shrink-0"
                              style={{ backgroundColor: col.hexCode }}
                            />
                            <span>{col.name}</span>
                            {isSelected && (
                              <FiCheck size={12} className="text-[var(--color-primary)]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SIZE SELECTION (Clothing Specific) */}
                {sizeOptions.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs sm:text-sm font-bold text-gray-900">
                        Select Size: <span className="text-[var(--color-primary)]">{selectedSize}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                      >
                        <FiHelpCircle size={13} /> Size Guide
                      </button>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      {sizeOptions.map((sizeStr, sIdx) => {
                        const isSelected =
                          selectedSize.toUpperCase() === sizeStr.toUpperCase();

                        // Check if variant has stock for this size & selected color
                        const matchingVariant = product?.variants?.find((v: any) => {
                          const sizeMatch =
                            v.attributes?.size?.trim().toUpperCase() ===
                            sizeStr.toUpperCase();
                          const colorMatch =
                            !selectedColor ||
                            v.attributes?.color?.name?.trim().toLowerCase() ===
                              selectedColor.trim().toLowerCase();
                          return sizeMatch && colorMatch;
                        });

                        const isSizeInStock = matchingVariant
                          ? (matchingVariant.stock || 0) > 0
                          : true;

                        return (
                          <button
                            key={sIdx}
                            type="button"
                            disabled={!isSizeInStock}
                            onClick={() => setSelectedSize(sizeStr)}
                            className={`min-w-[42px] px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                              isSelected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs scale-102"
                                : isSizeInStock
                                ? "border-gray-200 hover:border-gray-300 text-gray-800 bg-white hover:bg-gray-50"
                                : "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                            }`}
                          >
                            {sizeStr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STORAGE / VERSION SELECTION (Gadgets Specific) */}
                {storageOptions.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs sm:text-sm font-bold text-gray-900">
                        Storage / Variant: <span className="text-[var(--color-primary)]">{selectedStorage}</span>
                      </label>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      {storageOptions.map((st, idx) => {
                        const isSelected = selectedStorage === st;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedStorage(st)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              isSelected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                                : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Low Stock Warning */}
                {isInStock && availableStock <= 5 && (
                  <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                    <FiAlertTriangle className="text-amber-600 shrink-0" size={15} />
                    <span>Hurry! Only {availableStock} item(s) left in stock!</span>
                  </div>
                )}

                {/* ============================================================ */}
                {/* 2.4 QUANTITY & ACTION BUTTONS                               */}
                {/* ============================================================ */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                  {/* Quantity Row */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1 || !isInStock}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition active:scale-95"
                      >
                        <FiMinus size={13} />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= availableStock || !isInStock}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition active:scale-95"
                      >
                        <FiPlus size={13} />
                      </button>
                    </div>

                    <span className="text-xs text-gray-500">
                      Total: <strong className="text-gray-900 font-bold">৳ {(activePrice * quantity).toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Primary CTA Buttons (Star Tech & Othoba Style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Buy Now Button (Instant Checkout) */}
                    <button
                      type="button"
                      disabled={!isInStock}
                      onClick={handleBuyNow}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-[var(--color-primary)] hover:brightness-95 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                    >
                      <FiZap size={17} />
                      <span>{isInStock ? "Buy Now (অর্ডার করুন)" : "Out of Stock"}</span>
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      disabled={!isInStock}
                      onClick={handleAddToCart}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 active:scale-[0.99] transition border border-[var(--color-primary)]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                    >
                      <FiShoppingBag size={17} />
                      <span>{isInStock ? "Add to Cart (কার্টে যোগ করুন)" : "Out of Stock"}</span>
                    </button>
                  </div>

                  {/* Secondary Buttons: WhatsApp Order & Share */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!isInStock}
                      onClick={handleWhatsAppOrder}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                    >
                      <FaWhatsapp size={16} className={isInStock ? "text-emerald-600" : "text-gray-400"} />
                      <span>{isInStock ? "Order via WhatsApp" : "Out of Stock"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareProduct}
                      className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition flex items-center justify-center gap-1.5"
                    >
                      <FiShare2 size={15} />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 2.5 DELIVERY & SERVICE BOX (Othoba / Star Tech Style)       */}
                {/* ============================================================ */}
                <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <FiTruck className="text-[var(--color-primary)] mt-0.5 shrink-0" size={17} />
                    <div>
                      <strong className="text-gray-900 block">Nationwide Delivery</strong>
                      <span>Inside Dhaka: 24-48 Hours (৳60)</span><br />
                      <span>Outside Dhaka: 2-4 Days (৳120)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FiRotateCcw className="text-emerald-600 mt-0.5 shrink-0" size={17} />
                    <div>
                      <strong className="text-gray-900 block">Cash on Delivery</strong>
                      <span>Pay after receiving the product. 7 Days Replacement.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. STAR TECH SIGNATURE TABBED SPECIFICATION & REVIEWS        */}
        {/* ============================================================ */}
        <div id="product-info-tabs" className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden mb-12">
          {/* Tabs Navigation Header */}
          <div className="flex items-center border-b border-gray-200 overflow-x-auto bg-gray-50/70 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("specifications")}
              className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === "specifications"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Specifications (স্পেসিফিকেশন)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === "description"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Description (বিস্তারিত বিবরণ)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>Reviews ({totalReviews})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("policy")}
              className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === "policy"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Delivery & Warranty Policy
            </button>
          </div>

          {/* TAB 1: SPECIFICATION TABLE (Star Tech Signature Zebra Striped Table) */}
          {activeTab === "specifications" && (
            <div className="p-4 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Detailed Specifications
              </h3>

              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs sm:text-sm">
                {/* Basic Details Group */}
                <div className="bg-gray-100/70 px-4 py-2 font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Basic Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-white">
                  <div className="font-semibold text-gray-500 sm:col-span-1">Product Name</div>
                  <div className="text-gray-900 sm:col-span-2 font-medium">{product.name}</div>
                </div>
                {product.brandID && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-gray-50/50">
                    <div className="font-semibold text-gray-500 sm:col-span-1">Brand</div>
                    <div className="text-gray-900 sm:col-span-2 font-medium">
                      {typeof product.brandID === "object" ? product.brandID.name : product.brandID}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-white">
                  <div className="font-semibold text-gray-500 sm:col-span-1">Product Type</div>
                  <div className="text-gray-900 sm:col-span-2 font-medium capitalize">
                    {product.productType || "Standard"}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-gray-50/50">
                  <div className="font-semibold text-gray-500 sm:col-span-1">Product SKU / Code</div>
                  <div className="text-gray-900 sm:col-span-2 font-medium">{activeSku}</div>
                </div>

                {/* Technical / Physical Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <>
                    <div className="bg-gray-100/70 px-4 py-2 font-bold text-gray-800 text-xs uppercase tracking-wider">
                      Technical / Material Specifications
                    </div>
                    {product.specifications.map((spec: any, idx: number) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <div className="font-semibold text-gray-500 sm:col-span-1">{spec.key}</div>
                        <div className="text-gray-900 sm:col-span-2 font-medium">{spec.value}</div>
                      </div>
                    ))}
                  </>
                )}

                {/* Warranty Information Group */}
                <div className="bg-gray-100/70 px-4 py-2 font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Warranty Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-white">
                  <div className="font-semibold text-gray-500 sm:col-span-1">Warranty Coverage</div>
                  <div className="text-gray-900 sm:col-span-2 font-medium">
                    {product.warranty?.hasWarranty
                      ? `${product.warranty.warrantyType || "Official Brand Warranty"} - ${
                          product.warranty.duration || "1 Year"
                        }`
                      : "7 Days Replacement Warranty & 100% Genuine Quality Guarantee"}
                  </div>
                </div>
                {product.warranty?.details && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-gray-50/50">
                    <div className="font-semibold text-gray-500 sm:col-span-1">Warranty Details</div>
                    <div className="text-gray-900 sm:col-span-2 font-medium">
                      {product.warranty.details}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION */}
          {activeTab === "description" && (
            <div className="p-4 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Product Description
              </h3>
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                {product.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description.replace(/\n/g, "<br/>"),
                    }}
                  />
                ) : (
                  <p>{product.shortDescription || "No detailed description available for this product."}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REVIEWS & RATINGS */}
          {activeTab === "reviews" && (
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Overall Rating Summary */}
                <div className="lg:col-span-4 p-5 rounded-xl bg-gray-50 border border-gray-200 text-center flex flex-col items-center justify-center">
                  <div className="text-5xl font-black text-gray-900 mb-1">{averageRating}</div>
                  <div className="flex items-center text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        size={18}
                        className={
                          star <= Math.round(averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Based on {totalReviews} customer reviews</p>
                </div>

                {/* Right: Review Submission Form */}
                <div className="lg:col-span-8 p-5 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Write a Customer Review</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-115 transition"
                          >
                            <FiStar
                              size={20}
                              className={
                                star <= reviewRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Feedback / Review
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write your honest opinion about this product..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-xs sm:text-sm font-bold hover:brightness-95 transition disabled:opacity-50"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Reviews List */}
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-bold text-gray-900">
                  Verified Reviews ({reviews.length})
                </h4>
                {reviews.length > 0 ? (
                  reviews.map((rev: any, rIdx: number) => (
                    <div
                      key={rIdx}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-gray-800">
                          {rev.user?.firstName || rev.userName || "Verified Customer"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={12}
                            className={
                              star <= (Number(rev.rating) || 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 py-4">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY & WARRANTY POLICY */}
          {activeTab === "policy" && (
            <div className="p-4 sm:p-8 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <FiTruck className="text-[var(--color-primary)]" /> Delivery Timelines & Charges
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                  <li><strong>Inside Dhaka:</strong> Regular delivery within 24 to 48 hours (Charge: ৳60).</li>
                  <li><strong>Outside Dhaka:</strong> Nationwide courier delivery via Steadfast / Pathao / RedX within 2 to 4 business days (Charge: ৳120).</li>
                  <li><strong>Cash on Delivery:</strong> Available nationwide across all 64 districts in Bangladesh.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <FiRotateCcw className="text-emerald-600" /> 7-Day Easy Return & Replacement Policy
                </h4>
                <p className="text-gray-600">
                  If you receive any damaged, defective, or incorrect product, you are eligible for an immediate replacement or full refund within 7 days of receiving the parcel.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <FiShield className="text-amber-500" /> 100% Genuine Authenticity Guarantee
                </h4>
                <p className="text-gray-600">
                  Tech Mahmud directly sources products from verified official distributors and manufacturers. Every gadget and fashion apparel undergoes thorough QC (Quality Control) before shipping.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 4. RELATED PRODUCTS SECTION (Star Tech / Othoba Style)       */}
        {/* ============================================================ */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Related Products (সম্পর্কিত পণ্যসমূহ)
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customers who viewed this item also explored
                </p>
              </div>
              {categorySlug && (
                <Link
                  href={`/${categorySlug}`}
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                  View All <FiChevronRight size={13} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 5).map((relProduct: any) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 5. SIZE GUIDE MODAL (Clothing Specific Feature)              */}
      {/* ============================================================ */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
            >
              <FiX size={18} />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              <FiInfo className="text-[var(--color-primary)]" /> Clothing Size Guide (Inches)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Standard measurements for regular fit apparel.
            </p>

            <div className="border border-gray-200 rounded-xl overflow-hidden text-xs text-center">
              <table className="w-full">
                <thead className="bg-gray-100 text-gray-800 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 border-b border-gray-200">Size</th>
                    <th className="py-2.5 px-3 border-b border-gray-200">Chest</th>
                    <th className="py-2.5 px-3 border-b border-gray-200">Length</th>
                    <th className="py-2.5 px-3 border-b border-gray-200">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-bold">M</td>
                    <td className="py-2 px-3">38 - 39"</td>
                    <td className="py-2 px-3">27.5"</td>
                    <td className="py-2 px-3">8.0"</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-bold">L</td>
                    <td className="py-2 px-3">40 - 41"</td>
                    <td className="py-2 px-3">28.5"</td>
                    <td className="py-2 px-3">8.5"</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-bold">XL</td>
                    <td className="py-2 px-3">42 - 43"</td>
                    <td className="py-2 px-3">29.5"</td>
                    <td className="py-2 px-3">9.0"</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-bold">XXL</td>
                    <td className="py-2 px-3">44 - 45"</td>
                    <td className="py-2 px-3">30.5"</td>
                    <td className="py-2 px-3">9.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-[11px] text-blue-800">
              💡 <em>Note: If you fall between two sizes, we recommend ordering one size larger for a comfortable relaxed fit.</em>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. FULLSCREEN IMAGE ZOOM MODAL                               */}
      {/* ============================================================ */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 w-10 h-10 flex items-center justify-center"
            >
              <FiX size={26} />
            </button>
            <img
              src={galleryImages[activeImageIndex] || product.thumbnail}
              alt={product.name}
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MOBILE STICKY BOTTOM ACTION BAR (Daraz/StarTech Mobile)   */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Price</span>
          <span className="text-base font-black text-[var(--color-primary)]">
            ৳ {activePrice.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            disabled={!isInStock}
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
          >
            <FiShoppingBag size={16} />
          </button>
          <button
            type="button"
            disabled={!isInStock}
            onClick={handleBuyNow}
            className="flex-1 max-w-[180px] py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[var(--color-primary)] hover:brightness-95 active:scale-95 transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            <FiZap size={15} />
            <span>{isInStock ? "Buy Now" : "Out of Stock"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
