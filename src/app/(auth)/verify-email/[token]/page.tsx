"use client";

import Link from "next/link";

export default function LegacyVerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-[420px] bg-white p-8 rounded-md shadow-2xl shadow-gray-200 border border-gray-100 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-3">
          Use your verification code
        </h1>
        <p className="text-gray-500 font-medium mb-8">
          Email verification now uses a 6-digit code instead of a link. Check
          your inbox and enter the code on the verification page.
        </p>
        <Link
          href="/verify-email"
          className="block w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-md font-bold"
        >
          Enter verification code
        </Link>
      </div>
    </div>
  );
}
