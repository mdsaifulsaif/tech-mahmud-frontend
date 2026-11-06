import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  FiChevronRight,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
  FiCreditCard,
  FiTruck,
  FiPhone,
  FiMail,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Tech Mahmud - 7-Day Replacement Guarantee",
  description:
    "Learn about Tech Mahmud's customer-friendly 7-day return and refund policy for smartphones, gadgets, electronics, and lifestyle apparel across Bangladesh.",
};

export default function RefundPolicyPage() {
  const lastUpdated = "November 2026";

  const eligibleScenarios = [
    {
      title: "Manufacturing Defect (DOA)",
      desc: "If your electronics or gadget is dead-on-arrival or develops a hardware malfunction within 7 days of delivery.",
    },
    {
      title: "Damaged in Transit",
      desc: "If the product arrived physically broken, scratched, or damaged due to courier handling.",
    },
    {
      title: "Wrong Item / Variant Delivered",
      desc: "If the item delivered differs in model, specification, color, or size from what you ordered on our platform.",
    },
    {
      title: "Missing Parts or Accessories",
      desc: "If the package arrived incomplete without standard bundled accessories, chargers, or user manuals.",
    },
  ];

  const nonEligibleScenarios = [
    {
      title: "Physical or Liquid Damage",
      desc: "Devices damaged due to drops, excessive impact, cracked screens, or water spillage after delivery handover.",
    },
    {
      title: "Missing Original Packaging or Seals",
      desc: "Products without original retail boxes, warranty stickers, serial barcode labels, or missing accessories.",
    },
    {
      title: "Software & Digital Licenses",
      desc: "Digital gift cards, downloaded games, or digital license keys that have already been activated or revealed.",
    },
    {
      title: "Consumed or Altered Merchandise",
      desc: "Worn or washed apparel, tempered electronics, or customized orders that cannot be restocked.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Notify Our Support Team",
      desc: "Contact us via WhatsApp / Call at 01783176838 or email support@techmahmud.com within 7 days of receiving your parcel. Share your Order ID and photos/videos demonstrating the issue.",
    },
    {
      step: "02",
      title: "Courier Return Dispatch",
      desc: "Pack the item safely in its original box with all accessories. Hand it over to our pickup rider or ship it to our Dhaka office via your local courier.",
    },
    {
      step: "03",
      title: "Technical Quality Inspection",
      desc: "Our quality assurance team inspects the device within 24 to 48 hours of arrival to verify the reported issue and serial number.",
    },
    {
      step: "04",
      title: "Instant Replacement or Refund",
      desc: "Upon verification, an immediate brand-new replacement is dispatched, or a 100% refund is initiated to your bKash, Nagad, or Bank account.",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-['Poppins']">
      {/* Header */}
      <div className="bg-gray-50/70 border-b border-gray-100 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <span className="text-gray-900">Refund & Return Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <FiRefreshCw size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Refund & <span className="text-[var(--color-primary)]">Return Policy</span>
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Last Updated: {lastUpdated} • Simple, transparent 7-day replacement and money-back guarantee
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-14">
        <div className="space-y-10 text-gray-600 text-sm sm:text-base leading-relaxed">
          {/* Overview */}
          <section className="bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-200/80">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">01.</span> 7-Day Hassle-Free Replacement
            </h2>
            <p>
              At <strong>Tech Mahmud</strong>, customer satisfaction is our highest priority. We understand that purchasing electronics, smart gadgets, and fashion online requires absolute confidence. To protect your investment, we provide an easy, transparent <strong>7-Day Replacement & Return Guarantee</strong> on all eligible items purchased through our platform.
            </p>
            <p className="mt-3">
              If an item you received is defective, damaged, or incorrect, you have a full 7 days from the delivery date to file a replacement or refund claim.
            </p>
          </section>

          {/* When You Can Return */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">02.</span> Eligibility for Return or Replacement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eligibleScenarios.map((item, idx) => (
                <div key={idx} className="p-5 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-base mb-1.5">
                    <FiCheckCircle size={18} />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Non-Eligible Scenarios */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">03.</span> Non-Eligible Conditions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              The following situations are not covered under the 7-day replacement guarantee:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nonEligibleScenarios.map((item, idx) => (
                <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-rose-200/70">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-base mb-1.5">
                    <FiXCircle size={18} />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4 Steps How to Return */}
          <section className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">04.</span> How to Request a Return or Replacement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((st, idx) => (
                <div key={idx} className="p-5 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-mono font-black text-sm flex items-center justify-center mb-3">
                      {st.step}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{st.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Details */}
          <section className="space-y-4 bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">05.</span> Refund Methods & Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm mb-1">
                  <FiClock className="text-[var(--color-primary)]" />
                  <h4>Inspection Window</h4>
                </div>
                <p className="text-xs text-gray-500">
                  Inspected within 24–48 hours of reaching our Dhaka tech service hub.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm mb-1">
                  <FiCreditCard className="text-[var(--color-primary)]" />
                  <h4>bKash / Nagad Refund</h4>
                </div>
                <p className="text-xs text-gray-500">
                  Dispatched directly to your mobile wallet within 3 to 5 business days.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm mb-1">
                  <FiTruck className="text-[var(--color-primary)]" />
                  <h4>Card & Bank Refund</h4>
                </div>
                <p className="text-xs text-gray-500">
                  Processed via payment gateway to your card or bank in 5 to 7 working days.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Box */}
          <div className="p-6 sm:p-8 bg-[#0b141d] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-3 py-1 rounded-full inline-block mb-2">
                Need Help with a Return?
              </span>
              <h3 className="text-lg font-bold">Our Support Team is Ready to Assist</h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Reach out to our customer care helpline daily between 10:00 AM and 8:00 PM.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:01783176838"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[#e04848] text-white text-xs font-bold transition shadow-xs"
              >
                <FiPhone size={14} />
                <span>01783176838</span>
              </a>
              <a
                href="mailto:support@techmahmud.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition border border-gray-700"
              >
                <FiMail size={14} />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}