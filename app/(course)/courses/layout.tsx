import type { Metadata } from "next";
import Header from "@/app/(site)/_components/Header";
import Footer from "@/app/(site)/_components/Footer";

export const metadata: Metadata = {
  title:
    " ডিজিটাল মার্কেটিং কোর্স | বিশেষজ্ঞ পরিচালিত প্রশিক্ষণ প্রোগ্রাম | প্রায়োগিক",
  description:
    "প্রায়োগিকের বিশেষজ্ঞ পরিচালিত ডিজিটাল মার্কেটিং কোর্সের মাধ্যমে আপনার ক্যারিয়ার পরিবর্তন করুন। বহু বছরের অভিজ্ঞতাসম্পন্ন ইন্ডাস্ট্রি প্রফেশনালদের কাছ থেকে SEO, সোশ্যাল মিডিয়া, ইমেইল ও কনটেন্ট মার্কেটিং শিখুন। আজই আমাদের সম্পূর্ণ প্রোগ্রামগুলি দেখুন।",
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="min-h-[80vh]">{children}</div>
      <Footer />
    </div>
  );
}
