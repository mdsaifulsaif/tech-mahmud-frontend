"use client";

import React, { createContext, useContext, useState } from "react";

interface UIContextType {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  isComplainModalOpen: boolean;
  openComplainModal: () => void;
  closeComplainModal: () => void;
  quickViewProduct: any | null;
  openQuickView: (product: any) => void;
  closeQuickView: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComplainModalOpen, setIsComplainModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const openComplainModal = () => setIsComplainModalOpen(true);
  const closeComplainModal = () => setIsComplainModalOpen(false);

  const openQuickView = (product: any) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  return (
    <UIContext.Provider
      value={{
        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
        isComplainModalOpen,
        openComplainModal,
        closeComplainModal,
        quickViewProduct,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

