"use client";

import React, { useEffect, useRef, useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import ProductModal from "@/components/shared/ProductModal";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { FiSearch, FiX, FiRefreshCw, FiShoppingBag, FiAward, FiLayers } from "react-icons/fi";

interface SearchPageClientProps {
  query?: string;
}

const SearchPageClient: React.FC<SearchPageClientProps> = ({ query = "" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read query directly from URL parameters
  const urlQuery = searchParams.get("q");
  const activeQuery = (urlQuery !== null ? urlQuery : query).trim();
  const filter = searchParams.get("filter");
  const productType = searchParams.get("type");
  const brand = searchParams.get("brand");
  const brandName = searchParams.get("brandName");

  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // When active query, filter, productType or brand changes: reset page, clear products, and scroll to TOP
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeQuery, filter, productType, brand]);

  // Build query arguments dynamically
  const queryArgs: any = {
    page,
    limit: 16,
    status: "active",
  };
  if (activeQuery) {
    queryArgs.searchTerm = activeQuery;
  }
  if (filter === "featured") {
    queryArgs.isFeatured = "true";
  }
  if (productType) {
    queryArgs.productType = productType;
  }
  if (brand) {
    queryArgs.brand = brand;
  }

  // Fetch products
  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const meta = data?.meta;
  const hasMore = meta ? meta.page < meta.totalPage : false;

  // Append new page data or set initial page data
  useEffect(() => {
    if (!data?.data) return;

    if (page === 1) {
      setAllProducts(data.data);
    } else {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((p: any) => p._id));
        const newUnique = data.data.filter((p: any) => !existingIds.has(p._id));
        return [...prev, ...newUnique];
      });
    }
  }, [data, page]);

  // Infinite scroll loader
  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Resolve brand title name from brandDetails, brandName param, or formatted brand slug
  const resolvedBrandName = React.useMemo(() => {
    if (brandName) return brandName;
    if (!brand) return "";
    const fromProduct = allProducts.find((p) => p.brandDetails?.name)?.brandDetails?.name;
    if (fromProduct) return fromProduct;
    return brand.replace(/-/g, " ");
  }, [brandName, brand, allProducts]);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.replace("/search", { scroll: true });
    });
  };

  const hasActiveFilters = Boolean(activeQuery || filter || productType || brand);

  return (
    <div className="w-full pb-16">
      {/* Header Result Bar */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div>
          {activeQuery ? (
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Results for:</span>
              <span className="text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-0.5 rounded-lg">
                &ldquo;{activeQuery}&rdquo;
              </span>
            </h1>
          ) : filter === "featured" ? (
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <FiAward size={18} />
              </div>
              <span>Featured Products</span>
            </h1>
          ) : productType === "combo" ? (
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <FiLayers size={18} />
              </div>
              <span>Combo Packs & Deals</span>
            </h1>
          ) : resolvedBrandName ? (
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <FiShoppingBag size={18} />
              </div>
              <span className="capitalize">{resolvedBrandName} Products</span>
            </h1>
          ) : (
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <FiShoppingBag size={18} />
              </div>
              <span>All Products</span>
            </h1>
          )}

          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            {isFetching && page === 1
              ? "Loading products..."
              : meta
              ? `${meta.total} Products Found`
              : `${allProducts.length} Products`}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <FiX size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Initial Loading Skeleton */}
      {(isLoading || (isFetching && allProducts.length === 0)) && page === 1 && (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse flex flex-col justify-between h-72"
            >
              <div className="w-full h-36 bg-gray-150 rounded-xl mb-3" />
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-gray-150 rounded" />
                <div className="w-1/2 h-4 bg-gray-100 rounded" />
              </div>
              <div className="w-full h-8 bg-gray-100 rounded-xl mt-3" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto my-8">
          <p className="text-gray-700 font-semibold mb-4 text-sm">
            Failed to load products. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer"
          >
            <FiRefreshCw size={14} /> Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && !isError && allProducts.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch size={28} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {activeQuery
              ? `No products found matching "${activeQuery}"`
              : "No products available"}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-6">
            {activeQuery
              ? "Check your spelling or try searching with different keywords."
              : "New products will be added soon."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              View All Products
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {allProducts.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
          {allProducts.map((product: any) => (
            <div key={product._id} className="w-full">
              <ProductCard
                product={product}
                onQuickView={() => handleQuickView(product)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Indicator */}
      {hasMore && (
        <div ref={observerRef} className="w-full flex justify-center py-12">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-gray-500 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-150">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
            <span>Loading more products...</span>
          </div>
        </div>
      )}

      {!hasMore && allProducts.length > 0 && (
        <p className="text-center text-gray-400 text-xs font-medium py-12">
          All products loaded
        </p>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default SearchPageClient;