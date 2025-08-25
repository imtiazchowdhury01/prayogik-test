import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CourseCategory from "./_components/CourseCategory";

export const metadata: Metadata = {
  title: "কোর্স আইডিয়া লিস্ট | প্রায়োগিক",
  description:
    "প্রায়োগিক-এ মাইক্রো ও মিনি কোর্স তৈরি করে আপনার বিশেষজ্ঞ জ্ঞান অন্যদের ক্যারিয়ারকে এগিয়ে নিতে অবদান রাখুন এবং এককালীন পেমেন্ট গ্রহণ করুন। আজই আপনার কোর্স আইডিয়া আমাদের পাঠান!",
};

const CourseIdeas = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-tertiary-50/50">
        <div className="py-12 app-container">
          <CourseCategory />
          {/* Submit Your Idea CTA */}
          <div className="max-w-3xl mx-auto mt-16 overflow-hidden shadow-lg bg-gradient-to-br from-tertiary-600 to-tertiary-500 rounded-2xl">
            <div className="p-8 text-center text-white">
              <h3 className="mb-4 text-2xl font-bold md:text-3xl">
                আপনার নিজস্ব আইডিয়া আছে?
              </h3>
              <p className="max-w-xl mx-auto mb-6 text-white/90">
                আপনার দক্ষতার ওপর ভিত্তি করে নতুন কোর্স আইডিয়া প্রস্তাব করতে
                পারেন। আমরা সব ধরনের ইনোভেটিভ আইডিয়া স্বাগত জানাই।
              </p>
              <Link href={`${process.env.NEXT_PUBLIC_TEACHER_APP_URL}`}>
                <Button
                  size="lg"
                  className="px-8 font-medium transition-all bg-white shadow-md hover:bg-white/90 text-tertiary-700 hover:shadow-xl"
                >
                  আইডিয়া জমা দিন
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseIdeas;
