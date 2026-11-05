"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface WishlistItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  salePrice?: number;
  discountPrice?: number;
  mrp?: number;
  regularPrice?: number;
  discountPercent?: number;
  image?: string;
  thumbnail?: string;
  slug?: string;
  stock?: number;
  rating?: number;
  category?: string;
  unit?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  totalWishlistItems: number;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: any) => void;
  addToWishlist: (product: any) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "tech_mahmud_wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [items, isInitialized]);

  const isInWishlist = (id: string) => {
    return items.some((item) => item._id === id);
  };

  const toggleWishlist = (product: any) => {
    const id = product._id || product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const addToWishlist = (product: any) => {
    const id = product._id || product.id;
    if (isInWishlist(id)) return;

    const newItem: WishlistItem = {
      _id: id,
      name: product.name || product.title || "Product",
      price: Number(product.price) || 0,
      salePrice: product.salePrice,
      discountPrice: product.discountPrice,
      image: product.image || product.images?.[0] || product.thumbnail || "/img/sbb1.png",
      slug: product.slug,
      stock: product.stock,
      rating: product.rating,
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(`Added "${newItem.name}" to wishlist ❤️`);
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    toast.success("Removed from wishlist");
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalWishlistItems: items.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
