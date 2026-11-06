import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiSmile,
  FiArrowRight,
  FiChevronRight,
  FiAward,
  FiHeadphones,
  FiSmartphone,
  FiWatch,
  FiCpu,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "About Us | Tech Mahmud - Premier Tech, Gadgets & Lifestyle in Bangladesh",
  description:
    "Learn about Tech Mahmud, Bangladesh's trusted e-commerce platform delivering 100% genuine smartphones, laptops, smart gadgets, audio gear, and trendy apparel directly to your doorstep with official warranty.",
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <FiShield className="text-[var(--color-primary)]" size={28} />,
      title: "100% Genuine Products",
      description:
        "Every single smartphone, laptop, gadget, and accessory is 100% authentic, sourced directly from authorized brand distributors with genuine manufacturer warranty.",
    },
    {
      icon: <FiAward className="text-[var(--color-primary)]" size={28} />,
      title: "Official Brand Warranty",
      description:
        "Enjoy total peace of mind with official brand warranties, valid service claims, and dedicated customer care across Bangladesh.",
    },
    {
      icon: <FiTruck className="text-[var(--color-primary)]" size={28} />,
      title: "Fast Nationwide Delivery",
      description:
        "Lightning-fast delivery across all 64 districts of Bangladesh. Next-day delivery in Dhaka city and secure express courier nationwide.",
    },
    {
      icon: <FiSmile className="text-[var(--color-primary)]" size={28} />,
      title: "7-Day Replacement Guarantee",
      description:
        "We stand firmly behind our products. In case of any manufacturing defects or transit damage, get hassle-free replacement or quick refund.",
    },
  ];

  const highlights = [
    { number: "50,000+", label: "Happy Customers Nationwide" },
    { number: "100+", label: "Leading Global & Local Brands" },
    { number: "64", label: "Districts Covered with Express Shipping" },
    { number: "100%", label: "Authentic & Genuine Guarantee" },
  ];

  const categories = [
    {
      icon: <FiSmartphone size={22} className="text-[var(--color-primary)]" />,
      title: "Smartphones & Tablets",
      desc: "Latest Apple iPhones, Samsung Galaxy, Xiaomi, and budget kings with official warranty.",
    },
    {
      icon: <FiCpu size={22} className="text-[var(--color-primary)]" />,
      title: "Laptops & PC Accessories",
      desc: "High-performance laptops, mechanical keyboards, precision mice, and hardware components.",
    },
    {
      icon: <FiHeadphones size={22} className="text-[var(--color-primary)]" />,
      title: "Audio & Smart Gadgets",
      desc: "ANC wireless earbuds, Bluetooth speakers, power banks, chargers, and smart home tech.",
    },
    {
      icon: <FiWatch size={22} className="text-[var(--color-primary)]" />,
      title: "Smartwatches & Lifestyle",
      desc: "AMOLED smartwatches, fitness trackers, bags, and trendy premium fashion wear.",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-['Poppins']">
      {/* Breadcrumb Header */}
      <div className="bg-gray-50/70 border-b border-gray-100 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <span className="text-gray-900">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            About <span className="text-[var(--color-primary)]">Tech Mahmud</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            Bangladesh&apos;s premier online technology & lifestyle destination, dedicated to delivering authentic tech gadgets, electronics, and fashion directly to your door with reliability and integrity.
          </p>
        </div>
      </div>

      {/* Main Story Section */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3.5 py-1.5 rounded-full">
                <FiAward size={16} /> Our Story & Mission
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Empowering Bangladesh with Authentic Technology & Modern Lifestyle
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                In an era where counterfeit electronics, inflated prices, and unreliable warranty claims are far too common, <strong>Tech Mahmud</strong> was established with a singular mission: to provide tech enthusiasts, students, professionals, and gamers with 100% genuine products at competitive prices backed by genuine customer care.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                From high-end smartphones and flagship laptops to wireless audio, smart wearables, and curated lifestyle apparel, every item in our catalog undergoes rigorous quality checks before dispatch. We partner with authorized importers and distributors to ensure you always get valid manufacturer warranties and after-sales support.
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <FiShield className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Zero Tolerance for Clones</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Strictly 100% authentic and verified genuine products.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <FiCheckCircle className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Transparent Pricing & Support</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Fair prices in BDT with responsive customer assistance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0b141d] to-[#060b10] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-[var(--color-primary)]/15 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xl font-bold mb-2">Our Reach in Numbers</h3>
              <p className="text-gray-400 text-xs mb-8">Serving technology enthusiasts across Bangladesh with pride.</p>

              <div className="grid grid-cols-2 gap-6">
                {highlights.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-800 pb-4">
                    <div className="text-2xl sm:text-3xl font-black text-[var(--color-primary)] mb-1">
                      {item.number}
                    </div>
                    <div className="text-xs text-gray-300 font-medium leading-snug">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <span>Nationwide Express Logistics</span>
                <span className="text-[var(--color-primary)] font-semibold">64 Districts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Why Tech Mahmud
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              The Standards We Live By
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              We operate with uncompromising standards to deliver consumer tech and lifestyle items you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-5 border border-gray-100">
                    {val.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {val.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                  <FiCheckCircle size={14} /> Guaranteed
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Grid */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              What You&apos;ll Find on Tech Mahmud
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your comprehensive hub for next-gen technology and modern style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200/70 hover:bg-white hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{cat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Call to Action Banner */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-[#0b141d] text-white rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-gray-800">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Experience Genuine Quality
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to Upgrade Your Tech & Lifestyle?
              </h2>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                Browse our collection of genuine smartphones, computer accessories, audio gadgets, and premium fashion with official warranty.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[#e04848] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md group"
              >
                <span>Explore Products</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}