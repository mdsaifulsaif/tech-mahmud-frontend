"use client";

import React from "react";
import Link from "next/link";
import {
  FiPhoneCall,
  FiMapPin,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#081621] text-gray-400 pt-12 sm:pt-14 border-t border-gray-800 select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TOP SECTION: SUPPORT, ABOUT US (3 COLS), STAY CONNECTED   */}
        {/* Matches Star Tech layout from reference image             */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          {/* ----- COLUMN 1: SUPPORT (lg:col-span-3) ----- */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">
              SUPPORT
            </h3>

            {/* Helpline Pill */}
            <a
              href="tel:01783176838"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-full border border-gray-800 hover:border-[#FF5A5A] transition-all group bg-[#0d1e2c]/50 mb-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-[#FF5A5A] transition-colors shrink-0">
                <FiPhoneCall size={17} />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-gray-400 font-medium">
                  10 AM - 8 PM
                </span>
                <span className="text-base font-black text-[#FF5A5A] tracking-wider font-mono">
                  01783176838
                </span>
              </div>
            </a>

            {/* Store Locator Pill */}
            <Link
              href="/contact"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-full border border-gray-800 hover:border-[#FF5A5A] transition-all group bg-[#0d1e2c]/50 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-[#FF5A5A] transition-colors shrink-0">
                <FiMapPin size={17} />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-gray-400 font-medium">
                  Store Locator
                </span>
                <span className="text-sm font-bold text-[#FF5A5A] tracking-wide">
                  Find Our Stores
                </span>
              </div>
            </Link>
          </div>

          {/* ----- COLUMN 2: ABOUT US (3 SUB-COLUMNS) (lg:col-span-6) ----- */}
          <div className="lg:col-span-6">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">
              ABOUT US
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Sub-Col 1 */}
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Online Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Refund and Return Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>

              {/* Sub-Col 2 */}
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    EMI Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Tech Point Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>

              {/* Sub-Col 3 */}
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Career
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands"
                    className="hover:text-[#FF5A5A] transition-colors"
                  >
                    Brands
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ----- COLUMN 3: STAY CONNECTED (lg:col-span-3) ----- */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">
              STAY CONNECTED
            </h3>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-white text-sm">Tech Mahmud Ltd</p>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Head Office: 28 Kazi Nazrul Islam Ave, Navana Zohura Square, Dhaka 1000
              </p>
              <div className="pt-1">
                <span className="text-[11px] text-gray-400 block">Email:</span>
                <a
                  href="mailto:support@techmahmud.com"
                  className="text-xs font-semibold text-[#FF5A5A] hover:underline"
                >
                  support@techmahmud.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MIDDLE SECTION: APP DOWNLOAD + SOCIAL MEDIA CIRCLES       */}
        {/* ========================================================= */}
        <div className="border-t border-gray-800/80 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* App download section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-400 text-center sm:text-left">
            <span>Experience Tech Mahmud App on your mobile:</span>
            <div className="flex items-center gap-2">
              {/* Google Play badge */}
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-gray-500 transition text-white text-[11px]"
              >
                <svg className="w-4 h-4 fill-current text-[#FF5A5A]" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.328-.328-.516-.78-.516-1.28V3.094c0-.5.188-.952.516-1.28zm11.234 11.234l2.457-2.457-9.844-5.688 7.387 8.145zm0 1.898l-7.387 8.145 9.844-5.688-2.457-2.457zm1.047-.949l3.594-2.078c.844-.488.844-1.282 0-1.77l-3.594-2.078-1.516 1.516 1.516 4.41z" />
                </svg>
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[8px] text-gray-400 uppercase">Download on</span>
                  <span className="font-bold text-[10px]">Google Play</span>
                </div>
              </a>

              {/* App Store badge */}
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-gray-500 transition text-white text-[11px]"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.14.65-2.82 1.45-.6.7-.1.13 1.84-.97 2.98 1.07.08 2.18-.54 2.8-1.33z" />
                </svg>
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[8px] text-gray-400 uppercase">Download on</span>
                  <span className="font-bold text-[10px]">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Social media circle buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/8801783176838"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-gray-800/90 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <BsWhatsapp size={15} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-gray-800/90 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full bg-gray-800/90 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <FaYoutube size={15} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-gray-800/90 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <FaInstagram size={15} />
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM SECTION: COPYRIGHT & BRANDING                      */}
        {/* ========================================================= */}
        <div className="border-t border-gray-800/80 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} Tech Mahmud Ltd | All rights reserved</p>
          <p>Powered By: Tech Mahmud</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
