import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  FiChevronRight,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiMail,
  FiPhone,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Terms & Conditions | Tech Mahmud - Online Tech & Lifestyle Store",
  description:
    "Review the terms, rules, and conditions for purchasing genuine smartphones, laptops, electronics, and lifestyle products from Tech Mahmud in Bangladesh.",
};

export default function TermsPage() {
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
            <span className="text-gray-900">Terms & Conditions</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <FiFileText size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Terms & <span className="text-[var(--color-primary)]">Conditions</span>
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Last Updated: {lastUpdated} • Please read carefully before purchasing from Tech Mahmud
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-14">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">01.</span> Agreement to Terms
            </h2>
            <p>
              These Terms & Conditions constitute a legally binding agreement between you (&ldquo;Customer&rdquo;, &ldquo;User&rdquo;) and <strong>Tech Mahmud</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), governing your access to and purchase of tech gadgets, consumer electronics, computer hardware, audio accessories, and lifestyle apparel across Bangladesh.
            </p>
            <p className="mt-3">
              By accessing our website, creating an account, or placing an order, you accept and agree to abide by these Terms and our related policies (Privacy Policy, Refund Policy, Tech Point Policy).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">02.</span> Account Registration & Accuracy
            </h2>
            <p>To place orders and manage purchases on Tech Mahmud:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2">
              <li>You must provide accurate, current, and verifiable contact information, including an active Bangladesh mobile number and complete delivery address.</li>
              <li>You are solely responsible for keeping your login credentials confidential and for all actions performed under your account.</li>
              <li>You must notify us immediately if you suspect unauthorized access or any security breach.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">03.</span> Product Authenticity & Pricing
            </h2>
            <p>
              We pride ourselves on offering 100% authentic tech and lifestyle merchandise:
            </p>
            <div className="space-y-3 mt-3">
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-1">
                  <FiShield className="text-[var(--color-primary)]" />
                  <h4>Authenticity Guarantee</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  All electronic devices, accessories, and apparel sold on Tech Mahmud are authentic, sourced from authorized distributors or brand-certified suppliers. We have zero tolerance for counterfeit or cloned merchandise.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-1">
                  <FiCreditCard className="text-[var(--color-primary)]" />
                  <h4>Currency & Transparent Pricing</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  All prices are displayed in Bangladeshi Taka (BDT ৳). While we strive for accuracy, if a product is mistakenly listed at an incorrect price or with erroneous specifications, Tech Mahmud reserves the right to cancel or adjust the order with prior customer notice.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">04.</span> Order Placement & Verification
            </h2>
            <p>
              Placing an order constitutes an offer to purchase. An order is finalized once verified by our logistics team:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2">
              <li><strong>Order Confirmation:</strong> Orders may require telephonic or SMS confirmation prior to shipment dispatch.</li>
              <li><strong>Advance Delivery Charge:</strong> For deliveries outside Dhaka or for high-value orders (e.g., flagship smartphones, laptops), an advance shipping fee of ৳100–৳200 may be requested to verify genuine intent and prevent non-acceptance at delivery.</li>
              <li><strong>Right to Cancel:</strong> We reserve the right to decline or cancel any order due to product unavailability, stock depletion, suspicious activity, or delivery address ambiguity.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">05.</span> Shipping, Delivery & Inspection
            </h2>
            <p>
              We deliver to all 64 districts in Bangladesh through trusted express couriers (Steadfast, Pathao, RedX, Paperfly):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-1">
                  <FiTruck className="text-[var(--color-primary)]" />
                  <h4>Dhaka City Delivery</h4>
                </div>
                <p className="text-xs text-gray-600">
                  Typically delivered within 24 to 48 hours. Express same-day delivery may be available for select items upon request.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-1">
                  <FiTruck className="text-[var(--color-primary)]" />
                  <h4>Nationwide Courier Delivery</h4>
                </div>
                <p className="text-xs text-gray-600">
                  Delivered within 2 to 4 business days to any district or upazila across Bangladesh with real-time tracking IDs.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm mt-3 flex items-start gap-3">
              <FiAlertCircle size={20} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Parcel Inspection:</strong> Customers are requested to inspect the external security seal and package integrity in front of the courier rider before accepting and signing. In case of evident tampering, refuse the parcel and contact our helpline immediately.
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">06.</span> Official Brand Warranty
            </h2>
            <p>
              Electronics and computer hardware carry official manufacturer warranties where indicated on the product page:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2">
              <li>Warranty claims are serviced through authorized brand service centers or Tech Mahmud&apos;s customer care hub.</li>
              <li>Warranty covers internal hardware defects and manufacturing flaws occurring under normal usage.</li>
              <li><strong>Warranty Void:</strong> Physical drops, cracks, liquid spillage, burned ICs, unauthorized repairs, or removed/tampered serial stickers void the warranty immediately.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">07.</span> Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions and all related disputes are governed and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.
            </p>
          </section>

          {/* Support Banner */}
          <div className="p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Need Clarification on Our Terms?</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Reach out to our customer support desk for any questions or commercial inquiries.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:01783176838"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[#e04848] text-white text-xs font-bold transition shadow-xs"
              >
                <FiPhone size={14} />
                <span>Call 01783176838</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}