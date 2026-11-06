import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MiniCart from "@/components/shared/MiniCart";
import FloatingCartButton from "@/components/shared/FloatingCartButton";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]/50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      <MiniCart />
      <FloatingCartButton />
      <Footer />
    </div>
  );
}
