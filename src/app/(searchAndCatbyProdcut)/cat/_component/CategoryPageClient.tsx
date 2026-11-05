"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  useGetProductsByCategorySlugQuery,
} from "@/redux/api/productApi";
import ProductCard from "@/components/shared/ProductCard";
import ProductModal from "@/components/shared/ProductModal";

interface CategoryPageClientProps {
  slug: string;
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ slug }) => {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [slug]);

  const { data, isLoading, isFetching, error } =
    useGetProductsByCategorySlugQuery(
      { slug, page, limit: 15 },
      { skip: !slug },
    );

  const products = data?.data || [];
  const meta = data?.meta;
  const hasMore = meta ? meta.page < meta.totalPage : false;

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
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const categoryName = products[0]?.categoryDetails?.name || slug;

  return (
    <>
      <div className="mt-4">
        {isLoading && page === 1 && (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No products found.
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No products available in this category yet.
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
            {products.map((product: any) => (
              <div key={product._id} className="w-full">
                <ProductCard
                  product={product}
                  onQuickView={() => handleQuickView(product)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && (
          <div ref={observerRef} className="w-full flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <p className="text-center text-gray-400 text-xs sm:text-sm py-10">
            All products loaded
          </p>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </>
  );
};

export default CategoryPageClient;