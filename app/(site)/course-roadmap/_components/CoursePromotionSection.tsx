import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CoursePromotionSection = () => {
  return (
    <section className="w-full py-12 mb-8 md:mb-0">
      <div className="bg-[#e7f5f5] rounded-lg px-8 pt-8 flex flex-col md:flex-row items-center justify-between relative">
        <div className="hidden lg:block absolute -top-4 -right-10 md:top-[90px] lg:right-[300px] xl:right-[420px] opacity-70 md:opacity-100">
          <svg
            width="66"
            height="71"
            viewBox="0 0 66 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.1948 12.073C32.1948 12.073 34.2997 27.0056 40.8904 33.2224C47.8265 39.7649 64.3897 41.0483 64.3897 41.0483C64.3897 41.0483 47.8265 42.3318 40.8904 48.8743C34.2997 55.091 32.1948 70.0237 32.1948 70.0237C32.1948 70.0237 30.09 55.091 23.4993 48.8743C16.5632 42.3318 0 41.0483 0 41.0483C0 41.0483 16.5632 39.7649 23.4993 33.2224C30.09 27.0056 32.1948 12.073 32.1948 12.073Z"
              fill="#D9EBEA"
            />
            <path
              d="M52.6521 0C52.6521 0 53.5248 6.19083 56.2572 8.76818C59.1328 11.4806 65.9996 12.0127 65.9996 12.0127C65.9996 12.0127 59.1328 12.5448 56.2572 15.2572C53.5248 17.8346 52.6521 24.0254 52.6521 24.0254C52.6521 24.0254 51.7795 17.8346 49.0471 15.2572C46.1715 12.5448 39.3047 12.0127 39.3047 12.0127C39.3047 12.0127 46.1715 11.4806 49.0471 8.76818C51.7795 6.19083 52.6521 0 52.6521 0Z"
              fill="#D9EBEA"
            />
          </svg>
        </div>
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            আমাদের কোর্সে গড়ুন আপনার ভবিষ্যৎ
          </h2>
          <p className="course-proposal-description max-w-md md:max-w-lg lg:max-w-xl">
            আমাদের বিশেষজ্ঞ প্রশিক্ষকদের তত্ত্বাবধানে সঠিক দক্ষতা অর্জন করুন, যা
            আপনার স্বপ্নের ভবিষ্যৎ ও একটি সফল ক্যারিয়ার গড়তে সহায়ক হবে।
          </p>
        </div>
        <Link href="/courses" className="w-full md:w-auto">
          <Button
            variant={"primary"}
            className="w-full md:w-auto bg-secondary-button transition-all duration-300 hover:bg-secondary-button hover:opacity-85 py-3 sm:py-4 h-12 text-sm sm:text-base mb-4 md:mb-4 text-nowrap"
          >
            কোর্সগুলো দেখুন
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CoursePromotionSection;
