


"use client";

import React, { useEffect, useRef, Suspense } from "react";
import MinHeader from "./MinHeader";
import CategoryNav from "./CategoryNav";
import MobileNav from "./MobileNav";
import { FiX } from "react-icons/fi";
import { useUI } from "@/context/UIContext";
import { MessageSquareWarning } from "lucide-react";

const HEADER_STICKY_OFFSET = 0;

const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openComplainModal,
  } = useUI();

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleToggleMobileMenu = toggleMobileMenu;
  const handleCloseMobileMenu = closeMobileMenu;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeaderHeight = () => {
      const fullHeight = el.offsetHeight;
      const visibleHeight = Math.max(fullHeight - HEADER_STICKY_OFFSET, 0);
      document.documentElement.style.setProperty("--header-height", `${visibleHeight}px`);
    };

    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(el);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50">
        <Suspense fallback={<div className="h-16 bg-[#081621]" />}>
          <MinHeader onToggleMobile={handleToggleMobileMenu} />
        </Suspense>
        <CategoryNav />
      </header>

      <div
        className={`fixed inset-0 z-[100] flex md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0 delay-300"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseMobileMenu}
          aria-hidden="true"
        />

        <aside
          className={`relative w-[85%] max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={handleCloseMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close Menu"
            >
              <FiX size={24} />
            </button>
          </div> */}

          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            </div>

            <button
              onClick={openComplainModal}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[var(--color-primary)] transition-all bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200/60"
            >
              <MessageSquareWarning size={16} className="text-[#FF5A5A]" />
              <span>Have Complaint?</span>
            </button>

            <button
              onClick={handleCloseMobileMenu}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              aria-label="Close Menu"
            >
              <FiX size={22} />
            </button>
          </div>

          <div className="flex-1 w-full">
            <MobileNav onClose={handleCloseMobileMenu} />
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;