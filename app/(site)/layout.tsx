import ThriveDesk from "@/components/thrivedesk";
import type { Metadata } from "next";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";

export const metadata: Metadata = {
  title: "ডিজিটাল মার্কেটিং বিশেষজ্ঞ তৈরি কোর্স | অনলাইন শিক্ষা  | প্রায়োগিক",
  description:
    "প্রায়োগিক ডিজিটাল মার্কেটিংয়ে দক্ষতা অর্জন করুন। অভিজ্ঞ বিশেষজ্ঞদের দ্বারা তৈরি শর্ট কোর্স, মিনি কোর্স, বুটক্যাম্প, ক্যারিয়ার রোডম্যাপ ও সার্টিফিকেশন প্রোগ্রাম। আজই আপনার ডিজিটাল ক্যারিয়ার শুরু করুন।",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="bg-white">{children}</div>
      <ThriveDesk />
      <Footer />
      <ThirdPartyScripts />
    </div>
  );
}
