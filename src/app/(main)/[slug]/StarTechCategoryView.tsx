"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronRight,
  FiSliders,
  FiX,
  FiCheck,
  FiHeart,
  FiShoppingBag,
  FiZap,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetAllBrandsQuery } from "@/redux/api/brandApi";
import ProductCard from "@/components/shared/ProductCard";
import ProductModal from "@/components/shared/ProductModal";
import toast from "react-hot-toast";

interface StarTechCategoryViewProps {
  slug: string;
}

export default function StarTechCategoryView({ slug }: StarTechCategoryViewProps) {
  const router = useRouter();

  // 1. Fetch Categories and Brands to resolve slug
  const { data: catResponse, isLoading: isCatLoading } = useGetCategoriesQuery({ limit: 100 });
  const allCategories: any[] = catResponse?.data || [];

  const { data: brandResponse, isLoading: isBrandLoading } = useGetAllBrandsQuery({ limit: 100 });
  const allBrands: any[] = brandResponse?.data || [];

  // Bulletproof slug normalizer: trims, collapses multiple dashes, strips leading/trailing dashes
  const normalizeSlug = (str: string) =>
    (str || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const cleanSlug = useMemo(() => normalizeSlug(decodeURIComponent(slug || "")), [slug]);

  // Determine if this slug matches a Category or a Brand (with dash flexibility)
  const matchedCategory = useMemo(() => {
    if (!allCategories.length) return null;
    return allCategories.find((c: any) => {
      const cSlug = normalizeSlug(c.slug);
      const cName = normalizeSlug(c.name);
      return (
        cSlug === cleanSlug ||
        cName === cleanSlug ||
        cSlug.replace(/-/g, "") === cleanSlug.replace(/-/g, "") ||
        cName.replace(/-/g, "") === cleanSlug.replace(/-/g, "")
      );
    });
  }, [allCategories, cleanSlug]);

  const matchedBrand = useMemo(() => {
    if (matchedCategory) return null; // Category takes priority
    if (!allBrands.length) return null;
    return allBrands.find((b: any) => {
      const bSlug = normalizeSlug(b.slug);
      const bName = normalizeSlug(b.name);
      return (
        bSlug === cleanSlug ||
        bName === cleanSlug ||
        bSlug.replace(/-/g, "") === cleanSlug.replace(/-/g, "") ||
        bName.replace(/-/g, "") === cleanSlug.replace(/-/g, "")
      );
    });
  }, [allBrands, cleanSlug, matchedCategory]);

  const isBrandPage = Boolean(!matchedCategory && matchedBrand);
  const pageTitle =
    matchedCategory?.name ||
    matchedBrand?.name ||
    cleanSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  // 2. Filter States
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<"all" | "inStock" | "outOfStock">("all");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [brandSearchQuery, setBrandSearchQuery] = useState<string>("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Reset filters when the category or brand slug changes
  useEffect(() => {
    setSelectedBrandSlug("");
    setSelectedAvailability("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinPriceInput("");
    setMaxPriceInput("");
    setSortBy("default");
    setCurrentPage(1);
    setBrandSearchQuery("");
  }, [cleanSlug]);

  // 3. Fetch Products based on Category or Brand
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: currentPage,
      limit: itemsPerPage,
      status: "active",
    };

    if (matchedCategory) {
      params.category = matchedCategory._id || matchedCategory.slug;
    } else if (matchedBrand) {
      params.brand = matchedBrand.name || matchedBrand.slug;
    } else {
      // Default directly to category by slug (supported natively by backend)
      params.category = cleanSlug;
    }

    if (selectedBrandSlug) {
      params.brand = selectedBrandSlug;
    }

    if (sortBy === "price_asc") params.sort = "salePrice";
    else if (sortBy === "price_desc") params.sort = "-salePrice";
    else if (sortBy === "newest") params.sort = "-createdAt";

    return params;
  }, [
    matchedCategory,
    matchedBrand,
    cleanSlug,
    selectedBrandSlug,
    sortBy,
    currentPage,
    itemsPerPage,
  ]);

  const { data: productsResponse, isLoading: isProductsLoading } =
    useGetProductsQuery(queryParams);
  const rawProducts: any[] = productsResponse?.data || [];
  const totalProducts: number = productsResponse?.meta?.total ?? rawProducts.length;

  // Filter products by inStock and price range
  const displayedProducts = useMemo(() => {
    let prods = rawProducts;
    if (selectedAvailability === "inStock") {
      prods = prods.filter((p: any) => (p.stock || 0) > 0);
    } else if (selectedAvailability === "outOfStock") {
      prods = prods.filter((p: any) => (p.stock || 0) <= 0);
    }
    if (minPrice !== undefined) {
      prods = prods.filter((p: any) => {
        const pr = Number(p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice || 0);
        return pr >= minPrice;
      });
    }
    if (maxPrice !== undefined) {
      prods = prods.filter((p: any) => {
        const pr = Number(p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice || 0);
        return pr <= maxPrice;
      });
    }
    return prods;
  }, [rawProducts, selectedAvailability, minPrice, maxPrice]);

  // 4. Extract Category Brands for Horizontal Strip & Sidebar
  const categoryBrands = useMemo(() => {
    const brandMap = new Map<string, { name: string; slug: string; count: number }>();

    // Collect brands from actual products in this category
    rawProducts.forEach((p: any) => {
      let bName = "";
      let bSlug = "";

      if (p.brandDetails?.name) {
        bName = p.brandDetails.name;
        bSlug = p.brandDetails.slug || bName.toLowerCase().replace(/\s+/g, "-");
      } else if (typeof p.brandID === "object" && p.brandID?.name) {
        bName = p.brandID.name;
        bSlug = p.brandID.slug || bName.toLowerCase().replace(/\s+/g, "-");
      } else if (typeof p.brandID === "string" && p.brandID !== "nonebrand") {
        const found = allBrands.find(
          (b) => b._id === p.brandID || b.slug === p.brandID || b.name === p.brandID
        );
        if (found) {
          bName = found.name;
          bSlug = found.slug || bName.toLowerCase().replace(/\s+/g, "-");
        }
      } else if (p.brand && typeof p.brand === "string" && p.brand !== "nonebrand") {
        bName = p.brand;
        bSlug = bName.toLowerCase().replace(/\s+/g, "-");
      }

      if (bName && bName.toLowerCase() !== "nonebrand") {
        const key = bName.toLowerCase().trim();
        if (brandMap.has(key)) {
          brandMap.get(key)!.count += 1;
        } else {
          brandMap.set(key, { name: bName, slug: bSlug, count: 1 });
        }
      }
    });

    return Array.from(brandMap.values());
  }, [rawProducts, allBrands]);

  // Filtered brands for sidebar search
  const filteredCategoryBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return categoryBrands;
    return categoryBrands.filter((b) =>
      b.name.toLowerCase().includes(brandSearchQuery.toLowerCase().trim())
    );
  }, [categoryBrands, brandSearchQuery]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    selectedBrandSlug ||
    selectedAvailability !== "all" ||
    minPrice !== undefined ||
    maxPrice !== undefined
  );

  const handleBrandSelect = (bName: string) => {
    if (selectedBrandSlug.toLowerCase() === bName.toLowerCase()) {
      setSelectedBrandSlug(""); // toggle off
    } else {
      setSelectedBrandSlug(bName);
    }
    setCurrentPage(1);
  };

  const handleApplyPriceFilter = () => {
    const min = minPriceInput ? Number(minPriceInput) : undefined;
    const max = maxPriceInput ? Number(maxPriceInput) : undefined;
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedBrandSlug("");
    setSelectedAvailability("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinPriceInput("");
    setMaxPriceInput("");
    setSortBy("default");
    setCurrentPage(1);
    toast.success("Filters cleared");
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      {/* ============================================================ */}
      {/* 1. BREADCRUMBS (Clean & Professional, No Background Box)    */}
      {/* ============================================================ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/" className="hover:text-[var(--color-primary)] transition font-medium">
            Home
          </Link>
          <FiChevronRight className="text-gray-400 text-xs shrink-0" />
          {isBrandPage && (
            <>
              <Link href="/brands" className="hover:text-[var(--color-primary)] transition font-medium">
                Brands
              </Link>
              <FiChevronRight className="text-gray-400 text-xs shrink-0" />
            </>
          )}
          <span className="text-gray-800 font-semibold">{pageTitle}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3">
        {/* ============================================================ */}
        {/* 2. HORIZONTAL BRAND PILLS STRIP (Star Tech Signature)        */}
        {/* As requested: "r ekhaen oi category er brand gual eivaee asbe" */}
        {/* ============================================================ */}
        {categoryBrands.length > 0 && (
          <div className="mb-6 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap sm:flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedBrandSlug("")}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap shadow-2xs ${
                  !selectedBrandSlug
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs scale-102"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-[var(--color-primary)]"
                }`}
              >
                All Brands
              </button>

              {categoryBrands.map((brand) => {
                const isSelected =
                  selectedBrandSlug.toLowerCase() === brand.name.toLowerCase();
                return (
                  <button
                    key={brand.slug || brand.name}
                    type="button"
                    onClick={() => handleBrandSelect(brand.name)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap shadow-2xs ${
                      isSelected
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs scale-102"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <span>{brand.name}</span>
                    {brand.count > 0 && (
                      <span
                        className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {brand.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs"
          >
            <FiSliders className="text-[var(--color-primary)]" />
            <span>Filter Products</span>
          </button>
          <span className="text-xs text-gray-500 font-medium">
            {totalProducts} Items found
          </span>
        </div>

        {/* ============================================================ */}
        {/* 4. MAIN CONTENT (Filter Sidebar 3 Cols + Products 9 Cols)     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ---------------- LEFT: STAR TECH FILTER SIDEBAR ---------------- */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-5 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:p-0 lg:shadow-none lg:bg-transparent lg:col-span-3 ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Mobile Sidebar Close */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 lg:hidden">
              <span className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <FiFilter /> Filter
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-5 space-y-6">
              {/* Sidebar Header with Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <FiSliders className="text-[var(--color-primary)]" /> Filter
                </span>
                {(selectedBrandSlug || selectedAvailability !== "all" || minPrice !== undefined || maxPrice !== undefined) && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[11px] font-bold text-[var(--color-primary)] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Price Range Filter (Star Tech Signature) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Price Range
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-gray-400 text-xs">৳</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <span className="text-gray-400 text-xs font-bold">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-gray-400 text-xs">৳</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPriceFilter}
                  className="w-full py-2 bg-gray-900 hover:bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg transition"
                >
                  Apply Price
                </button>
              </div>

              {/* Availability Filter (Star Tech Signature) */}
              <div className="space-y-2.5 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Availability
                </h3>
                <div className="space-y-1.5 text-xs text-gray-700">
                  <label className="flex items-center gap-2.5 cursor-pointer p-1 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === "all"}
                      onChange={() => setSelectedAvailability("all")}
                      className="text-[var(--color-primary)] focus:ring-0"
                    />
                    <span className="font-semibold">All Items</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer p-1 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === "inStock"}
                      onChange={() => setSelectedAvailability("inStock")}
                      className="text-[var(--color-primary)] focus:ring-0"
                    />
                    <span className="font-semibold text-emerald-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer p-1 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === "outOfStock"}
                      onChange={() => setSelectedAvailability("outOfStock")}
                      className="text-[var(--color-primary)] focus:ring-0"
                    />
                    <span className="font-semibold text-gray-500">Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Brand Filter with Search (Star Tech Signature) */}
              {categoryBrands.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Brands
                  </h3>
                  {categoryBrands.length > 5 && (
                    <div className="relative">
                      <FiSearch className="absolute left-2.5 top-2.5 text-gray-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Search Brand..."
                        value={brandSearchQuery}
                        onChange={(e) => setBrandSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  )}

                  <div className="max-h-52 overflow-y-auto pr-1 no-scrollbar space-y-1.5 text-xs text-gray-700">
                    {filteredCategoryBrands.map((b) => {
                      const isChecked = selectedBrandSlug.toLowerCase() === b.name.toLowerCase();
                      return (
                        <label
                          key={b.slug || b.name}
                          className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleBrandSelect(b.name)}
                              className="w-3.5 h-3.5 text-[var(--color-primary)] rounded focus:ring-0"
                            />
                            <span className={isChecked ? "font-bold text-[var(--color-primary)]" : "font-medium"}>
                              {b.name}
                            </span>
                          </div>
                          {b.count > 0 && (
                            <span className="text-[10px] text-gray-400">({b.count})</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ---------------- RIGHT: PRODUCT LISTING & STAR TECH GRID ---------------- */}
          <main className="lg:col-span-9 space-y-4">
            {/* Top Sort & Count Bar (Star Tech Style) */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-bold text-gray-800">
                <span>{pageTitle}</span>
                <span className="text-gray-400 font-normal ml-2">
                  (Showing {displayedProducts.length} of {totalProducts} items)
                </span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                {/* Show Items Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value={20}>20</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="default">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 space-y-3 animate-pulse">
                    <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                    <div className="w-1/2 h-3 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              /* No Products Found */
              <div className="bg-white rounded-2xl border border-gray-200/90 p-12 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  <FiSearch />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {hasActiveFilters ? "No products found for this filter" : `No products found in ${pageTitle}`}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {hasActiveFilters
                    ? "Try adjusting your price range, clearing brand selections, or checking back soon."
                    : `Currently there are no products listed under ${pageTitle}. Please explore our other categories or check back soon.`}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-[var(--color-primary)] transition"
                  >
                    Reset All Filters
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="inline-block px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition"
                  >
                    Browse All Products
                  </Link>
                )}
              </div>
            ) : (
              /* Product Grid using shared ProductCard */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {displayedProducts.map((product: any) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onQuickView={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* 5. PAGINATION (Star Tech Style)                              */}
            {/* ============================================================ */}
            {totalPages > 1 && (
              <div className="bg-white p-3.5 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-center gap-1.5 mt-6 text-xs font-bold text-gray-700">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition"
                >
                  PREV
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-lg border transition ${
                        currentPage === pNum
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition"
                >
                  NEXT
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* 6. STAR TECH BOTTOM PRICE TABLE & BUYING GUIDE               */}
            {/* ============================================================ */}
            {displayedProducts.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs mt-10 space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 mb-3">
                    {pageTitle} Price list in BD 2026
                  </h2>
                  <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-800 font-bold uppercase text-[11px]">
                        <tr>
                          <th className="py-2.5 px-4">{pageTitle} Model & Name</th>
                          <th className="py-2.5 px-4 text-right">Price in BD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {displayedProducts.slice(0, 6).map((item: any, tIdx: number) => {
                          const p = item.salePrice && item.salePrice > 0 ? item.salePrice : item.regularPrice;
                          return (
                            <tr key={tIdx} className="hover:bg-gray-50/70">
                              <td className="py-2 px-4 font-medium text-gray-900">
                                <Link href={`/product/${item.slug || item._id}`} className="hover:underline">
                                  {item.name}
                                </Link>
                              </td>
                              <td className="py-2 px-4 text-right font-bold text-gray-900">
                                ৳{Number(p).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-600 leading-relaxed space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Why Buy {pageTitle} from Tech Mahmud?
                  </h3>
                  <p>
                    Tech Mahmud is one of the leading genuine gadget and lifestyle apparel retailers in Bangladesh. Every product is sourced directly from certified brand distributors and passes through comprehensive QC before shipping. Enjoy reliable customer support, easy warranty replacement, and nationwide courier delivery.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
