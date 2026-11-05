"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/redux/api/authApi";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";

function VerifyNoticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation();

  const startCooldown = () => {
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }
    if (code.trim().length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyEmail({ email, code: code.trim() }).unwrap();

      const sessionRes = await signIn("credentials", {
        redirect: false,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpires: String(result.accessTokenExpires),
        userData: JSON.stringify(result.data),
      });

      if (sessionRes?.error) {
        toast.success("Email verified. Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Email verified. You are now signed in.");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Verification code is invalid or has expired."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    try {
      const data = await resendVerification(email).unwrap();
      toast.success(data?.message || "A new code has been sent!");
      startCooldown();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not resend code. Try again.");
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white p-8 rounded-md shadow-2xl shadow-gray-200 border border-gray-100 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-6">
        <FiMail size={28} className="text-[var(--color-primary)]" />
      </div>

      <h1 className="text-2xl font-black text-gray-900 mb-3">
        Check your email
      </h1>

      <p className="text-gray-500 font-medium mb-1">
        We&apos;ve sent a 6-digit verification code to
      </p>
      <p className="text-gray-900 font-bold mb-6 break-all">
        {email || "your email address"}
      </p>

      <form onSubmit={handleVerify} className="text-left mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
          Verification code
        </label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-center text-2xl tracking-[0.4em] font-bold focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none mb-4"
          placeholder="000000"
        />
        <button
          type="submit"
          disabled={isVerifying || code.length !== 6}
          className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-md font-bold shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify and continue"}
        </button>
      </form>

      <p className="text-sm text-gray-400 font-medium mb-6 leading-relaxed">
        The code expires in 10 minutes. Check your spam folder if you don&apos;t
        see the email.
      </p>

      <button
        onClick={handleResend}
        disabled={isResending || cooldown > 0 || !email}
        className="w-full flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-md font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        <FiRefreshCw size={16} className={isResending ? "animate-spin" : ""} />
        {cooldown > 0
          ? `Resend available in ${cooldown}s`
          : isResending
            ? "Sending..."
            : "Resend code"}
      </button>

      <div className="pt-6 border-t border-gray-50">
        <p className="text-sm text-gray-500 font-medium">
          Wrong email?{" "}
          <Link
            href="/register"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            Register again
          </Link>
        </p>
        <p className="text-sm text-gray-500 font-medium mt-2">
          Already verified?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyNoticePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <Suspense fallback={<div className="text-gray-500 font-medium">Loading...</div>}>
        <VerifyNoticeContent />
      </Suspense>
    </div>
  );
}
