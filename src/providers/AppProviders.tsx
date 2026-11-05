"use client";

import React from "react";
import QueryProvider from "./QueryProvider";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { ReduxProvider } from "@/redux/provider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { UIProvider } from "@/context/UIContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ReduxProvider>
        <AuthSessionProvider>
          <CartProvider>
            <WishlistProvider>
              <UIProvider>
                {children}
              </UIProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthSessionProvider>
      </ReduxProvider>
    </QueryProvider>
  );
}
