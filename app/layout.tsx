import AuthProvider from "@/components/AuthProvider";
import HeadContent from "@/components/HeadContent";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import ServerCSSInliner from "@/components/ServerCSSInliner";
import { localNotoSerifBengali } from "@/lib/utils/font";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";
import QueryClientProviderLayout from "@/components/query-client-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "block", // prevents blocking
  preload: true,
});

export const metadata: Metadata = {
  title: "ডিজিটাল মার্কেটিং বিশেষজ্ঞ তৈরি কোর্স | অনলাইন শিক্ষা  | প্রায়োগিক",
  description:
    "প্রায়োগিক ডিজিটাল মার্কেটিংয়ে দক্ষতা অর্জন করুন। অভিজ্ঞ বিশেষজ্ঞদের দ্বারা তৈরি শর্ট কোর্স, মিনি কোর্স, বুটক্যাম্প, ক্যারিয়ার রোডম্যাপ ও সার্টিফিকেশন প্রোগ্রাম। আজই আপনার ডিজিটাল ক্যারিয়ার শুরু করুন।",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_META_TAG_CONTENT,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${localNotoSerifBengali.variable}`}>
      <HeadContent />
      <body
        className={`${inter.variable} ${localNotoSerifBengali.variable} font-sans`}
        style={{
          fontOpticalSizing: "auto",
          fontVariationSettings: '"wdth" 100',
        }}
        suppressHydrationWarning
      >
        <AuthProvider>
          <QueryClientProviderLayout>
            <Suspense>
              <div>{children}</div>
            </Suspense>
          </QueryClientProviderLayout>
          <ConfettiProvider />
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
