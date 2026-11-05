"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/lib/api/queries";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await forgotPassword(email).unwrap();
      setSubmitted(true);
      toast.success(data?.message || "Reset link sent!");
    } catch (err: any) {
      // security practice অনুযায়ী backend সবসময় same success message দেয়,
      // তাই এখানে error আসলেও network/validation issue ছাড়া কিছু না
      toast.error(err?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-[420px] bg-white p-8 rounded-md shadow-2xl shadow-gray-200 border border-gray-100">
        {submitted ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-6">
              <FiMail size={28} className="text-[var(--color-primary)]" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-3">
              Check your email
            </h1>

            <p className="text-gray-500 font-medium mb-1">
              If an account exists for
            </p>
            <p className="text-gray-900 font-bold mb-6 break-all">{email}</p>

            <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">
              We&apos;ve sent a password reset link. It will expire in 15
              minutes. Don&apos;t forget to check your spam folder.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full py-3.5 border border-gray-200 rounded-md font-bold text-gray-700 hover:bg-gray-50 transition-all mb-6"
            >
              Use a different email
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              <FiArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Forgot password?
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-md font-bold shadow-xl hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                <FiArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}