import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import { Toaster } from "react-hot-toast";
import MarketingScripts from "@/components/analytics/MarketingScripts";

export const metadata: Metadata = {
  metadataBase: new URL("https://techmahmud.com"),
  title: "Tech Mahmud | Premier Tech, Gadgets & Clothing Store",
  description:
    "Shop authentic smartphones, laptops, smart gadgets, audio, and trendy clothing online at Tech Mahmud. 100% genuine products with official warranty and fast shipping across Bangladesh.",
  keywords: [
    "Tech Mahmud",
    "Gadget Store",
    "Clothing Store",
    "Smartphones",
    "Laptops",
    "Accessories",
    "Men Fashion",
    "Women Fashion",
    "Bangladesh",
  ],
  openGraph: {
    title: "Tech Mahmud | Premier Tech, Gadgets & Clothing Store",
    description:
      "Original gadgets, accessories, and premium apparel with fast nationwide delivery.",
    type: "website",
    locale: "en_US",
    siteName: "Tech Mahmud",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Mahmud | Online Tech & Clothing Store",
    description: "Premium tech gadgets and apparel delivered to your doorstep.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <MarketingScripts />
        <AppProviders>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
