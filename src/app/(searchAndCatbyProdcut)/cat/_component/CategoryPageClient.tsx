"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
  FiX,
  FiGrid,
  FiColumns,
  FiSearch,
} from "react-icons/fi";
import ProductCard from "@/components/shared/ProductCard";
import ProductModal from "@/components/shared/ProductModal";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetAllBrandsQuery } from "@/redux/api/brandApi";

// Predefined demo brands matching Image 2
const popularWatchBrands = [
  "Casio",
  "CURREN",
  "Fastrack",
  "Naviforce",
  "SKMEI",
  "SONATA",
  "Titan",
  "Fossil",
  "Citizen",
];

// Price presets matching Image 2
const priceRanges = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "0 to 500 ৳", min: 0, max: 500 },
  { label: "501 to 1000 ৳", min: 501, max: 1000 },
  { label: "1001 to 1500 ৳", min: 1001, max: 1500 },
  { label: "1501 to 2000 ৳", min: 1501, max: 2000 },
  { label: "2001 to 3000 ৳", min: 2001, max: 3000 },
  { label: "More than 3000 ৳", min: 3001, max: undefined },
];

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const router = useRouter();

  // Filters State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number>(0);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>(undefined);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("default");
  const [gridCols, setGridCols] = useState<"4" | "3">("4");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Accordion open states
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Fetch all categories to build the subcategory carousel and tree
  const { data: catResponse } = useGetCategoriesQuery({ limit: 100 });
  const allCategories: any[] = catResponse?.data || [];

  // Fetch brands
  const { data: brandResponse } = useGetAllBrandsQuery({ limit: 50 });
  const apiBrands: any[] = brandResponse?.data || [];
  const brandList = apiBrands.length > 0 ? apiBrands.map((b) => b.name) : popularWatchBrands;

  // Find current active category
  const currentCategory = useMemo(() => {
    return (
      allCategories.find((c) => c.slug === slug) || {
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        slug,
      }
    );
  }, [allCategories, slug]);

  // Subcategories matching Image 2
  const subCategories = useMemo(() => {
    if (allCategories.length === 0) {
      return [
        {
          name: "Lifestyle Accessories",
          slug: "lifestyle-accessories",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80",
        },
        {
          name: "Watch & Accessories",
          slug: "watch-accessories",
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&q=80",
        },
        {
          name: "Analog Watches",
          slug: "analog-watches",
          image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&q=80",
        },
        {
          name: "Men",
          slug: "men-watches",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&q=80",
        },
        {
          name: "Women",
          slug: "women-watches",
          image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&q=80",
        },
        {
          name: "Unisex",
          slug: "unisex-watches",
          image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&q=80",
        },
        {
          name: "Couple Watches",
          slug: "couple-watches",
          image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=150&q=80",
        },
      ];
    }
    // Return child categories or related categories
    return allCategories.slice(0, 8).map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || cat.icon || "/img/sbb1.png",
    }));
  }, [allCategories]);

  // Build query args for product fetching
  const queryArgs: any = {
    category: currentCategory._id || currentCategory.slug || slug,
    status: "active",
    limit: 24,
  };
  if (selectedBrands.length > 0) {
    queryArgs.brand = selectedBrands[0]; // Filter by selected brand
  }
  if (appliedMinPrice !== undefined) {
    queryArgs.minPrice = appliedMinPrice;
  }
  if (appliedMaxPrice !== undefined) {
    queryArgs.maxPrice = appliedMaxPrice;
  }
  if (sortBy === "price_low") {
    queryArgs.sort = "salePrice";
  } else if (sortBy === "price_high") {
    queryArgs.sort = "-salePrice";
  } else if (sortBy === "newest") {
    queryArgs.sort = "-createdAt";
  }

  // Fetch products
  const { data: prodResponse, isLoading, isFetching } = useGetProductsQuery(queryArgs);
  const products: any[] = prodResponse?.data || [];
  const totalItems = prodResponse?.meta?.total || products.length;

  // Filter brands by search keyword
  const filteredBrandList = brandList.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  const handleApplyPrice = () => {
    const min = minPriceInput ? Number(minPriceInput) : undefined;
    const max = maxPriceInput ? Number(maxPriceInput) : undefined;
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRangeIndex(0);
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedMinPrice(undefined);
    setAppliedMaxPrice(undefined);
    setSortBy("default");
  };

  const handleSelectPriceRange = (index: number) => {
    setSelectedPriceRangeIndex(index);
    const range = priceRanges[index];
    setAppliedMinPrice(range.min);
    setAppliedMaxPrice(range.max);
    setMinPriceInput(range.min !== undefined ? String(range.min) : "");
    setMaxPriceInput(range.max !== undefined ? String(range.max) : "");
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 select-none">
      {/* ========================================================= */}
      {/* 1. BREADCRUMBS (Matching Image 2: Home / Cat / Subcat)    */}
      {/* ========================================================= */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-[#FF5A5A] transition">
          Home
        </Link>
        <FiChevronRight size={13} className="text-gray-400 shrink-0" />
        <Link href="/categories" className="hover:text-[#FF5A5A] transition">
          Categories
        </Link>
        <FiChevronRight size={13} className="text-gray-400 shrink-0" />
        <span className="font-semibold text-gray-900 truncate">
          {currentCategory.name}
        </span>
      </nav>

      {/* ========================================================= */}
      {/* 2. SUB-CATEGORIES CIRCULAR CAROUSEL (Matching Image 2)    */}
      {/* ========================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
          {subCategories.map((sub, idx) => {
            const isActive = sub.slug === slug;
            return (
              <Link
                key={sub.slug || idx}
                href={`/cat/${sub.slug}`}
                className="group flex flex-col items-center shrink-0 w-20 sm:w-24 text-center cursor-pointer"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 p-1 bg-white shadow-2xs overflow-hidden flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "border-[#1d4ed8] ring-4 ring-[#1d4ed8]/15 scale-105"
                      : "border-gray-200 group-hover:border-[#FF5A5A] group-hover:scale-105"
                  }`}
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-xs leading-tight line-clamp-2 transition-colors ${
                    isActive
                      ? "font-bold text-[#1d4ed8]"
                      : "font-semibold text-gray-700 group-hover:text-[#FF5A5A]"
                  }`}
                >
                  {sub.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN CONTENT: FILTER SIDEBAR (LEFT) + PRODUCTS (RIGHT) */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row items-start gap-5 sm:gap-6">
        {/* Mobile Filter Trigger Button */}
        <div className="w-full lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-800">
            {totalItems} Items in {currentCategory.name}
          </span>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1d4ed8] text-white text-xs font-bold rounded-lg shadow-xs"
          >
            <FiSliders size={13} />
            <span>Filters</span>
          </button>
        </div>

        {/* --------------------------------------------------------- */}
        {/* LEFT SIDEBAR: FILTERS (Matching Image 2)                  */}
        {/* --------------------------------------------------------- */}
        <aside
          className={`fixed inset-0 z-50 bg-black/50 lg:static lg:z-auto lg:bg-transparent lg:block w-full lg:w-64 shrink-0 transition-opacity ${
            mobileFilterOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-5 max-h-[90vh] overflow-y-auto lg:max-h-none lg:overflow-visible m-4 lg:m-0">
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 lg:hidden">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FiSliders /> Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* ----- 1. CATEGORIES ACCORDION ----- */}
            <div className="border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider py-1 hover:text-[#FF5A5A] transition"
              >
                <span>Categories</span>
                {isCatOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>

              {isCatOpen && (
                <div className="mt-3 space-y-1.5 pl-1 max-h-48 overflow-y-auto custom-scrollbar">
                  {allCategories.slice(0, 10).map((cat) => {
                    const isSelected = cat.slug === slug;
                    return (
                      <Link
                        key={cat._id || cat.slug}
                        href={`/cat/${cat.slug}`}
                        className={`block text-xs py-1 transition truncate ${
                          isSelected
                            ? "font-bold text-[#1d4ed8]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ----- 2. BRANDS CHECKBOX FILTER ----- */}
            <div className="border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => setIsBrandOpen(!isBrandOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider py-1 hover:text-[#FF5A5A] transition"
              >
                <span>Brands</span>
                {isBrandOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>

              {isBrandOpen && (
                <div className="mt-3 space-y-2">
                  {/* Brand search box */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-[11px] rounded-md border border-gray-200 outline-none focus:border-[#1d4ed8]"
                    />
                    <FiSearch
                      size={12}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  {/* Brand Checkboxes */}
                  <div className="max-h-44 overflow-y-auto space-y-1.5 pl-1 custom-scrollbar">
                    {filteredBrandList.map((brand) => {
                      const isChecked = selectedBrands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900 select-none py-0.5"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brand)}
                            className="rounded border-gray-300 text-[#1d4ed8] focus:ring-[#1d4ed8] w-3.5 h-3.5"
                          />
                          <span className="truncate">{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ----- 3. PRICE RANGE RADIO & MIN/MAX INPUTS ----- */}
            <div>
              <button
                type="button"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider py-1 hover:text-[#FF5A5A] transition"
              >
                <span>Price</span>
                {isPriceOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>

              {isPriceOpen && (
                <div className="mt-3 space-y-2.5">
                  {/* Radio buttons for price intervals */}
                  <div className="space-y-1.5 pl-1">
                    {priceRanges.map((range, rIdx) => {
                      const isSelected = selectedPriceRangeIndex === rIdx;
                      return (
                        <label
                          key={range.label}
                          className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900 select-none py-0.5"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            checked={isSelected}
                            onChange={() => handleSelectPriceRange(rIdx)}
                            className="text-[#1d4ed8] focus:ring-[#1d4ed8] w-3.5 h-3.5"
                          />
                          <span>{range.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Min / Max inputs */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-md outline-none focus:border-[#1d4ed8]"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-md outline-none focus:border-[#1d4ed8]"
                    />
                  </div>

                  {/* Reset & Apply Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition active:scale-95"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyPrice}
                      className="w-full py-1.5 px-3 bg-[#1d4ed8] hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* --------------------------------------------------------- */}
        {/* RIGHT MAIN CONTENT: HEADER + PRODUCT GRID (Image 2)       */}
        {/* --------------------------------------------------------- */}
        <section className="flex-1 min-w-0 w-full space-y-4">
          {/* Top Bar: Title, Count, Sort By Dropdown, View Toggle */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {currentCategory.name}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalItems} Items Found
              </p>
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-medium border border-gray-200 rounded-lg outline-none bg-white text-gray-800 cursor-pointer focus:border-[#1d4ed8]"
                >
                  <option value="default">Default</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Grid Column Toggles */}
              <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setGridCols("4")}
                  title="4 Columns"
                  className={`p-1 rounded ${
                    gridCols === "4" ? "bg-white text-[#1d4ed8] shadow-2xs" : "text-gray-400"
                  }`}
                >
                  <FiGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols("3")}
                  title="3 Columns"
                  className={`p-1 rounded ${
                    gridCols === "3" ? "bg-white text-[#1d4ed8] shadow-2xs" : "text-gray-400"
                  }`}
                >
                  <FiColumns size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-white rounded-xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/90 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
                <FiSliders size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                No Products Found In This Category
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try resetting your filters or exploring another category from the top carousel.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-[#1d4ed8] text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 ${
                gridCols === "4"
                  ? "md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                  : "md:grid-cols-3 lg:grid-cols-3"
              } gap-3 sm:gap-4`}
            >
              {products.map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard
                    product={product}
                    onQuickView={() => setSelectedProduct(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
