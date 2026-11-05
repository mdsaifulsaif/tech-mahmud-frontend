"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  _id: string;
  id?: string;
  productID?: string;
  name: string;
  price: number;
  salePrice?: number;
  discountPrice?: number;
  mrp?: number;
  regularPrice?: number;
  image?: string;
  thumbnail?: string;
  quantity: number;
  stock?: number;
  size?: string;
  color?: string;
  variantId?: string;
  variantID?: string;
  slug?: string;
  weight?: string;
  unit?: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  isMiniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  toggleMiniCart: () => void;
  addToCart: (item: any, quantity?: number) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  increaseQuantity: (id: string, variantId?: string) => void;
  decreaseQuantity: (id: string, variantId?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "tech_mahmud_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [items, isInitialized]);

  const getItemPrice = (item: CartItem) => {
    if (typeof item.discountPrice === "number" && item.discountPrice > 0) {
      return item.discountPrice;
    }
    if (typeof item.salePrice === "number" && item.salePrice > 0) {
      return item.salePrice;
    }
    return Number(item.price) || 0;
  };

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity || 1),
    0
  );
  const subtotal = totalPrice;

  const openMiniCart = () => setIsMiniCartOpen(true);
  const closeMiniCart = () => setIsMiniCartOpen(false);
  const toggleMiniCart = () => setIsMiniCartOpen((prev) => !prev);

  const addToCart = (product: any, qty: number = 1) => {
    setItems((prev) => {
      const id = product._id || product.id;
      const variantKey = product.variantId || product.size || product.color || "";

      const existingIndex = prev.findIndex(
        (item) =>
          item._id === id &&
          (item.variantId || item.size || item.color || "") === variantKey
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const nextQty = (next[existingIndex].quantity || 1) + qty;
        next[existingIndex] = { ...next[existingIndex], quantity: nextQty };
        toast.success(`Updated "${product.name || "Item"}" quantity in cart`);
        return next;
      } else {
        const newItem: CartItem = {
          _id: id,
          name: product.name || product.title || "Product",
          price: Number(product.price) || 0,
          salePrice: product.salePrice,
          discountPrice: product.discountPrice,
          image: product.image || product.images?.[0] || product.thumbnail || "/img/sbb1.png",
          quantity: qty,
          stock: product.stock,
          size: product.size,
          color: product.color,
          variantId: product.variantId,
          slug: product.slug,
          weight: product.weight,
          unit: product.unit,
        };
        toast.success(`Added "${newItem.name}" to cart 🛒`);
        return [...prev, newItem];
      }
    });

    setIsMiniCartOpen(true);
  };

  const removeFromCart = (id: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        if (item._id !== id) return true;
        if (variantId && item.variantId !== variantId) return true;
        return false;
      })
    );
    toast.success("Item removed from cart");
  };

  const increaseQuantity = (id: string, variantId?: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item._id === id && (!variantId || item.variantId === variantId)) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (id: string, variantId?: string) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item._id === id && (!variantId || item.variantId === variantId)) {
            const nextQty = (item.quantity || 1) - 1;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        subtotal,
        isMiniCartOpen,
        openMiniCart,
        closeMiniCart,
        toggleMiniCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
