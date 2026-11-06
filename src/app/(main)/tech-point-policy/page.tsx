import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  FiChevronRight,
  FiAward,
  FiGift,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Tech Point Policy | Tech Mahmud - Customer Loyalty & Rewards",
  description:
    "Learn how to earn, redeem, and maximize Tech Points on Tech Mahmud. Earn points with every gadget, smartphone, and apparel purchase across Bangladesh.",
};

export default function TechPointPolicyPage() {
  const lastUpdated = "November 2026";

  const earningWays = [
    {
      icon: <FiShoppingBag size={24} className="text-[var(--color-primary)]" />,
      title: "Shop & Earn Automatically",
      desc: "Earn 1 Tech Point for every ৳100 spent on eligible orders. The more you upgrade your gadgets and tech gear, the more points you collect.",
    },
    {
      icon: <FiAward size={24} className="text-[var(--color-primary)]" />,
      title: "Write Verified Product Reviews",
      desc: "Help the community make smart buying decisions. Share a verified purchase review and earn 20 bonus Tech Points per approved review.",
    },
    {
      icon: <FiTrendingUp size={24} className="text-[var(--color-primary)]" />,
      title: "Festive & Campaign Multipliers",
      desc: "Enjoy 2X to 3X double/triple reward point boosts during exclusive festive sales (Eid, New Year, Black Friday, Gadget Festive).",
    },
    {
      icon: <FiGift size={24} className="text-[var(--color-primary)]" />,
      title: "Special Member Milestones",
      desc: "Receive surprise loyalty points on your account anniversary and for reaching VIP customer tiers.",
    },
  ];

  const redemptionRules = [
    {
      label: "Point Conversion Rate",
      value: "1 Tech Point = ৳1.00 BDT",
      desc: "Simple, honest, and transparent conversion with zero hidden fees.",
    },
    {
      label: "Minimum Redemption",
      value: "50 Points (৳50 Discount)",
      desc: "Redeem easily at checkout once you accumulate at least 50 points.",
    },
    {
      label: "Validity Period",
      value: "12 Months from Earning",
      desc: "Points stay active in your wallet for a full year from the date of credit.",
    },
    {
      label: "Redemption Flexibility",
      value: "Up to 50% of Order Value",
      desc: "Use your points to cover a substantial portion of your gadget purchases.",
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
            <span className="text-gray-900">Tech Point Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <FiAward size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Tech Point <span className="text-[var(--color-primary)]">Policy</span>
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Last Updated: {lastUpdated} • The official loyalty & reward guidelines for Tech Mahmud shoppers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-14">
        <div className="space-y-10 text-gray-600 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-200/80">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">01.</span> Introduction to Tech Points
            </h2>
            <p>
              The <strong>Tech Point Rewards Program</strong> is our way of expressing heartfelt gratitude to our loyal technology and lifestyle community in Bangladesh. Every time you purchase authentic smartphones, audio gear, computer peripherals, or trendy apparel on Tech Mahmud, you accumulate valuable <strong>Tech Points</strong> that can be redeemed for instant discounts on future orders.
            </p>
            <p className="mt-3">
              Membership is 100% free and automatically activated as soon as you create a registered account on our website.
            </p>
          </section>

          {/* Section 2: How to Earn */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">02.</span> How to Earn Tech Points
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {earningWays.map((way, idx) => (
                <div key={idx} className="p-5 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3.5 border border-gray-100">
                      {way.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1.5">{way.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{way.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Value & Redemption */}
          <section className="space-y-4 bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">03.</span> Point Value & Redemption Rules
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Redeeming your accumulated Tech Points is completely transparent and effortless during checkout:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {redemptionRules.map((rule, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    {rule.label}
                  </span>
                  <div className="text-base sm:text-lg font-black text-gray-900 mb-1">
                    {rule.value}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Terms & Expiration */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">04.</span> Expiration, Cancellations & Conditions
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 pl-2">
              <li>
                <strong>12-Month Validity:</strong> Tech Points remain valid for 365 days from the date they are credited. Points that are not redeemed within this period will expire automatically.
              </li>
              <li>
                <strong>Order Cancellations & Returns:</strong> If an order is canceled or returned for a refund, the points earned from that order will be deducted from your account. If you redeemed points on an order that was subsequently canceled by us or the courier, your points will be restored in full to your account.
              </li>
              <li>
                <strong>Non-Transferable & No Cash Payout:</strong> Tech Points belong strictly to the registered user profile, cannot be combined or transferred to another user account, and cannot be encashed or withdrawn as physical cash.
              </li>
              <li>
                <strong>Account Standing:</strong> Accounts found engaging in abusive behaviors (fraudulent duplicate accounts, bogus reviews) will have their Tech Point balances voided immediately.
              </li>
            </ul>
          </section>

          {/* Section 5: How to Check Balance */}
          <section className="bg-blue-50/70 border border-blue-100 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block mb-2">
                Check Your Reward Points
              </span>
              <h3 className="text-lg font-bold text-gray-900">Want to See Your Current Tech Points?</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Log in to your account and visit your User Profile to track your available points, transaction history, and active discounts.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[#e04848] text-white text-xs font-bold transition shadow-xs group"
              >
                <span>View Profile</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}