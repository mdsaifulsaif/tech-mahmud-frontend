"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useResetPasswordMutation } from "@/lib/api/queries";
import { FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from "react-icons/fi";

type Status = "idle" | "submitting" | "success" | "error";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("submitting");

    try {
      await resetPassword({
        token: token as string,
        newPassword: password,
      }).unwrap();

      setStatus("success");
      setTimeout(() => router.push("/login"), 2200);
    } catch (err: any) {
      setStatus("error");
      setMessage(
        err?.data?.message || "This reset link is invalid or has expired."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-[420px] bg-white p-8 rounded-md shadow-2xl shadow-gray-200 border border-gray-100">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <SproutMark success={status === "success"} />
          <span className="text-lg font-black text-gray-900">Tech Mahmud</span>
        </div>

        {status === "success" ? (
          <div className="text-center">
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Password updated
            </h1>
            <p className="text-gray-500 font-medium">
              Your password has been reset. Taking you to login…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                Set a new password
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                Choose a strong password you haven&apos;t used before.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {password && (
                <div className="flex items-center gap-1.5 -mt-2 px-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor:
                          i < strength.level ? strength.color : "#F3F4F6",
                      }}
                    />
                  ))}
                  <span
                    className="text-xs font-bold ml-2 whitespace-nowrap"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {message && (
                <p className="text-sm text-red-500 font-medium px-1">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-md font-bold shadow-xl hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {status === "submitting" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Reset Password
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getStrength(pw: string) {
  if (!pw) return { level: 0, label: "", color: "#9CA3AF" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (pw.length >= 10 && /[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Weak", color: "#EF4444" };
  if (score === 2) return { level: 2, label: "Okay", color: "#F59E0B" };
  return { level: 3, label: "Strong", color: "#22C55E" };
}

function SproutMark({ success }: { success: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
        success ? "bg-[var(--color-primary)]" : "bg-gray-50"
      }`}
    >
      {success ? (
        <FiCheck className="text-white" size={18} strokeWidth={3} />
      ) : (
        <svg width="18" height="18" viewBox="0 0 34 34" fill="none">
          <path
            d="M17 23V14"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M17 14C17 14 13.5 14.5 13 11C13 11 17.5 10 17 14Z"
            fill="var(--color-primary)"
          />
          <path
            d="M17 14C17 14 20.5 14.5 21 11C21 11 16.5 10 17 14Z"
            fill="var(--color-primary)"
          />
        </svg>
      )}
    </span>
  );
}