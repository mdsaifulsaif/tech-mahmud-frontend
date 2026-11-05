"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FiMail, FiRefreshCw, FiArrowRight, FiCheckCircle, FiEdit2 } from "react-icons/fi";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/lib/api/queries";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  // Sync email if search param changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setIsEditingEmail(false);
    }
  }, [initialEmail]);

  // Focus first input on mount
  useEffect(() => {
    if (!isEditingEmail) {
      inputRefs.current[0]?.focus();
    }
  }, [isEditingEmail]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric character
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const digit = sanitized.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);

    // Focus on the next empty box or the last box
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const fullCode = otp.join("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      setIsEditingEmail(true);
      return;
    }

    if (fullCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyEmail({
        email: trimmedEmail,
        code: fullCode,
      }).unwrap();

      // Automatically sign in with tokens and user data
      const sessionRes = await signIn("credentials", {
        redirect: false,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpires: String(result.accessTokenExpires),
        userData: JSON.stringify(result.data),
      });

      if (sessionRes?.error) {
        toast.success("Email verified successfully! Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Email verified successfully! Welcome to Tech Mahmud.", {
        icon: "🎉",
        duration: 4000,
      });

      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Verification code is invalid or has expired."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Please enter your email address first.");
      setIsEditingEmail(true);
      return;
    }

    if (cooldown > 0) return;

    try {
      const data = await resendVerification(trimmedEmail).unwrap();
      toast.success(data?.message || "A new 6-digit verification code has been sent!");
      setCooldown(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Could not resend code. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-[460px] bg-white p-8 md:p-10 rounded-xl shadow-2xl shadow-gray-200 border border-gray-100 text-center">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-6 shadow-inner">
        <FiMail size={36} />
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
        Verify Your Email
      </h1>

      <p className="text-gray-500 font-medium text-sm mb-4">
        We sent a 6-digit verification code to
      </p>

      {/* Email Display & Edit */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-150 flex items-center justify-between gap-2">
        {isEditingEmail ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        ) : (
          <span className="font-bold text-gray-900 text-sm break-all text-left">
            {email || "No email specified"}
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsEditingEmail(!isEditingEmail)}
          className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 shrink-0 px-2 py-1"
        >
          {isEditingEmail ? (
            <>
              <FiCheckCircle size={14} /> Done
            </>
          ) : (
            <>
              <FiEdit2 size={14} /> Change
            </>
          )}
        </button>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 text-left">
            Enter 6-Digit Code
          </label>

          <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-full h-14 sm:h-16 text-center text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="•"
              />
            ))}
          </div>

          <p className="text-xs text-gray-400 font-medium text-left mt-2">
            The code expires in 10 minutes. Check your spam folder if not received.
          </p>
        </div>

        <button
          type="submit"
          disabled={isVerifying || fullCode.length !== 6 || !email}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-bold shadow-xl hover:shadow-gray-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Verifying & Signing In...
            </>
          ) : (
            <>
              Verify & Sign In
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Resend Section */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || cooldown > 0 || !email}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw size={15} className={isResending ? "animate-spin" : ""} />
          {cooldown > 0
            ? `Resend code in ${cooldown}s`
            : isResending
            ? "Sending new code..."
            : "Resend Code"}
        </button>

        <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-2">
          <Link
            href="/register"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            ← Register again
          </Link>
          <Link
            href="/login"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            Back to Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Suspense fallback={<div className="text-gray-500 font-medium">Loading verification...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
