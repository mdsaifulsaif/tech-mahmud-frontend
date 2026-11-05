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
  FiHeart,
} from "react-icons/fi";
import { BiLeaf } from "react-icons/bi";
import { RiEBike2Line } from "react-icons/ri";

export const metadata: Metadata = {
  title: "About Us | Tech Mahmud - Fresh Tech & Lifestyle Delivery in Dhaka",
  description:
    "Learn about Tech Mahmud, Dhaka's trusted online tech & lifestyle platform delivering 100% farm-fresh vegetables, fruits, fish, meat, and ready-to-cook essentials directly to your doorstep.",
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <BiLeaf className="text-[var(--color-primary)]" size={28} />,
      title: "100% Farm-Fresh Sourcing",
      description:
        "We source our vegetables and fruits daily from trusted local farmers across the Dhaka division. No stale cold-storage produce, only morning-harvested goodness.",
    },
    {
      icon: <FiShield className="text-[var(--color-primary)]" size={28} />,
      title: "Hygienic Sorting & Packing",
      description:
        "Every item is inspected, hand-sorted, and carefully packed under strict hygienic standards so you receive only clean, unblemished produce.",
    },
    {
      icon: <FiTruck className="text-[var(--color-primary)]" size={28} />,
      title: "Fast Doorstep Delivery",
      description:
        "Our logistics team ensures fast, reliable shipping across Bangladesh with premium parcel protection.",
    },
    {
      icon: <FiSmile className="text-[var(--color-primary)]" size={28} />,
      title: "Zero-Hassle Replacement",
      description:
        "We stand by our quality. If any item does not meet your expectations at delivery, we replace it or refund you instantly without debate.",
    },
  ];

  const highlights = [
    { number: "5,000+", label: "Happy Households in Dhaka" },
    { number: "150+", label: "Daily Fresh Farm Products" },
    { number: "98.8%", label: "On-Time Morning & Evening Delivery" },
    { number: "100%", label: "Freshness & Satisfaction Guarantee" },
  ];

  const categories = [
    {
      title: "Fresh Vegetables",
      desc: "Leafy greens, roots, tubers, and seasonal favorites sourced fresh at dawn.",
    },
    {
      title: "Ready-to-Cook",
      desc: "Peeled, chopped, and recipe-ready veggies designed to save you prep time.",
    },
    {
      title: "Fresh Fruits",
      desc: "Sweet, naturally ripened local and seasonal fruits packed with vitamins.",
    },
    {
      title: "Fish & Halal Meat",
      desc: "Cleaned and fresh river fish and responsibly sourced meat delivered cold.",
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
            Dhaka&apos;s homegrown online tech & lifestyle destination committed to making fresh, safe, and nutritious produce easily accessible to every family.
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
                <BiLeaf size={16} /> Our Story & Mission
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Bridging the Gap Between Local Farmers and City Kitchens
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Navigating crowded morning wet markets in Dhaka is often exhausting, time-consuming, and uncertain in terms of hygiene and pricing. <strong>Tech Mahmud</strong> was born out of a simple conviction: families deserve pure, nutritious groceries without the friction.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                By partnering directly with farmers and trusted regional suppliers in Dhaka, we cut out unnecessary middlemen. This guarantees fairer wages for local growers and ensures our customers receive vegetables, fruits, fish, and meat that are remarkably fresher and competitively priced.
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <FiAward className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Direct Farm Sourcing</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Freshly picked every dawn with strict quality checks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <FiHeart className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Customer First</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Committed to genuine technology products and prompt service.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1b221a] to-[#121612] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xl font-bold mb-2">Our Promise in Numbers</h3>
              <p className="text-gray-400 text-xs mb-8">Serving Dhaka city with relentless dedication and quality.</p>

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
                <span>Serving Dhaka City</span>
                <span className="text-[var(--color-primary)] font-semibold">Every Single Day</span>
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
              We operate with uncompromising standards to deliver food you can confidently feed your family.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all duration-300 flex flex-col justify-between"
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
              Your one-stop daily bazaar for everything fresh and wholesome.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200/70 hover:bg-white hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{cat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rider & Customer Call to Action Banner */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-[#141613] text-white rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Experience the Freshness
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to Taste the Difference?
              </h2>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                Order today and have fresh vegetables, fruits, and ready-to-cook packs delivered straight to your home in Dhaka.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md group"
              >
                <span>Shop Tech & Fashion</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
