import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  FiChevronRight,
  FiShield,
  FiLock,
  FiMail,
  FiPhone,
  FiDatabase,
  FiUserCheck,
  FiCheckCircle,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Privacy Policy | Tech Mahmud - Protecting Your Personal Information",
  description:
    "Tech Mahmud's Privacy Policy explains how we collect, protect, and handle your personal data when ordering authentic tech gadgets, electronics, and lifestyle products in Bangladesh.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 2026";

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
            <span className="text-gray-900">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <FiShield size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Privacy <span className="text-[var(--color-primary)]">Policy</span>
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Last Updated: {lastUpdated} • Applies to all users and customers of Tech Mahmud
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-14">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">01.</span> Commitment to Your Privacy
            </h2>
            <p>
              Welcome to <strong>Tech Mahmud</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are deeply dedicated to maintaining your trust by protecting the personal information you share with us. This Privacy Policy details our practices concerning data collection, storage, processing, and protection across our website, web platform, and nationwide e-commerce services in Bangladesh.
            </p>
            <p className="mt-3">
              By accessing Tech Mahmud, creating an account, or placing an order for electronics, gadgets, or apparel, you consent to the practices described herein.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">02.</span> Information We Collect
            </h2>
            <p>We only collect data strictly necessary to fulfill your orders, provide warranty support, and improve your shopping experience:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-base">
                  <FiUserCheck className="text-[var(--color-primary)]" />
                  <h3>Personal & Account Information</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>Full name and account credentials</li>
                  <li>Active mobile phone number (for OTP and delivery coordination)</li>
                  <li>Email address (for order receipts, serial numbers & warranty records)</li>
                </ul>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-base">
                  <FiDatabase className="text-[var(--color-primary)]" />
                  <h3>Nationwide Shipping & Address</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>Complete street address, division, district, and thana</li>
                  <li>Local landmark instructions for courier delivery personnel</li>
                  <li>Alternative recipient contact details if designated</li>
                </ul>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-base">
                  <FiLock className="text-[var(--color-primary)]" />
                  <h3>Payment & Transaction Details</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>Selected payment mode: Cash on Delivery (COD), bKash, Nagad, Cards</li>
                  <li>Gateway transaction reference IDs and order invoices</li>
                  <li><strong>Notice:</strong> We do NOT store debit/credit card CVVs or MFS PIN numbers</li>
                </ul>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-base">
                  <FiShield className="text-[var(--color-primary)]" />
                  <h3>Technical & Session Data</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>IP address, browser type, device information, and screen resolution</li>
                  <li>Session cookies to maintain cart contents and user preferences</li>
                  <li>Order history and reward point balances</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">03.</span> How We Use Your Information
            </h2>
            <p>Your information is used strictly for legitimate commercial and customer-support purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2">
              <li><strong>Order Processing & Dispatch:</strong> Verifying product availability, printing serial numbers, packing, and dispatching your items.</li>
              <li><strong>Courier Coordination:</strong> Handing over contact and shipping details to verified logistics partners (Steadfast, Pathao, RedX) for parcel delivery across Bangladesh.</li>
              <li><strong>Official Warranty Registration:</strong> Documenting product serial numbers and invoices to facilitate manufacturer warranty service.</li>
              <li><strong>Customer Support:</strong> Responding to inquiries, replacement claims, order tracking, and troubleshooting assistance.</li>
              <li><strong>Fraud Prevention:</strong> Monitoring suspicious transactions to protect customers and prevent unauthorized order placement.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">04.</span> Sharing & Third-Party Disclosure
            </h2>
            <p>
              <strong>We do not sell, rent, or trade your personal information to third parties.</strong> Data is shared only under strict operational safeguards:
            </p>
            <div className="space-y-2 mt-2">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Logistics & Courier Services</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  We provide your recipient name, address, and mobile number to reputable courier services exclusively to deliver your parcel and collect COD payments.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Licensed Payment Gateways</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Card and mobile banking transactions are processed securely through PCI-DSS compliant payment gateways with bank-grade encryption.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Legal & Law Enforcement Obligations</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  We may disclose information if required by the laws of Bangladesh or valid court subpoenas to protect against fraud, public harm, or crime.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">05.</span> Data Security & Storage
            </h2>
            <p>
              We implement industry-standard technical measures, including HTTPS encryption (SSL/TLS), hashed passwords, firewalls, and restricted administrative database access. While no internet transmission is 100% immune from risks, we continuously monitor and upgrade our infrastructure to protect your personal information.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">06.</span> Your Rights & Control
            </h2>
            <p>As a valued Tech Mahmud customer, you retain full rights over your data:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2">
              <li>Access and review your profile details and full order history from your dashboard.</li>
              <li>Update or correct your shipping addresses, contact numbers, and passwords anytime.</li>
              <li>Request full account deletion or data anonymization by contacting our support team.</li>
              <li>Opt-out of promotional SMS or email newsletters while retaining transactional order alerts.</li>
            </ul>
          </section>

          {/* Contact Box */}
          <div className="p-6 sm:p-8 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Have Questions About Your Privacy?</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Our Data Protection & Customer Support Team is ready to assist you anytime.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@techmahmud.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-[var(--color-primary)] transition"
              >
                <FiMail size={14} />
                <span>support@techmahmud.com</span>
              </a>
              <a
                href="tel:01783176838"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[#e04848] transition shadow-xs"
              >
                <FiPhone size={14} />
                <span>01783176838</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}