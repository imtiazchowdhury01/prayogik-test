import AuthProvider from "@/components/AuthProvider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import "./globals.css";
import { localNotoSerifBengali } from "@/lib/utils/font";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
// const plus_jakarta_sans = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--plus-jakarta-sans",
// });

export const metadata: Metadata = {
  title: "ডিজিটাল মার্কেটিং বিশেষজ্ঞ তৈরি কোর্স | অনলাইন শিক্ষা  | প্রায়োগিক",
  description:
    "প্রায়োগিক ডিজিটাল মার্কেটিংয়ে দক্ষতা অর্জন করুন। অভিজ্ঞ বিশেষজ্ঞদের দ্বারা তৈরি শর্ট কোর্স, মিনি কোর্স, বুটক্যাম্প, ক্যারিয়ার রোডম্যাপ ও সার্টিফিকেশন প্রোগ্রাম। আজই আপনার ডিজিটাল ক্যারিয়ার শুরু করুন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${localNotoSerifBengali.variable}`}>
      <AuthProvider>
        <body
          className={`${inter.variable} ${localNotoSerifBengali.variable} font-sans`}
          style={{
            fontOpticalSizing: "auto",
            fontVariationSettings: '"wdth" 100',
          }}
          suppressHydrationWarning
        >
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.fonts.ready.then(() => {
                  document.body.classList.add('fonts-loaded');
                });
              `,
            }}
          />
          <Suspense>
            <div>{children}</div>
          </Suspense>

          <ConfettiProvider />
          <ToastProvider />
        </body>
      </AuthProvider>
    </html>
  );
}
