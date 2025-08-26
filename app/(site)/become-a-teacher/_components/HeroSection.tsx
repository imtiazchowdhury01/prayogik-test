import React from "react";
import Image from "next/image";

import Link from "next/link";
import { cn } from "@/lib/utils";
import coursehero from "public/course-proposals/course-proposal-hero.webp";
const HeroSection = () => {
  const programTypes = [
    "তৈরি করুন অনলাইন কোর্স",
    "নিন লাইভ ক্লাস",
    "থাকুন ওয়ার্কশপ, সেমিনার ও ক্যারিয়ার গাইডেন্স প্রোগ্রামে কি-নোট স্পিকার হিসেবে",
  ];
  return (
    <section className="w-full relative" data-testid="hero-section">
      {/* Next.js Image component for optimized hero image */}
      <Image
        src="/images/home/Hero.webp"
        alt="Prayogik Hero background"
        fill
        priority
        quality={75}
        className="object-cover z-0"
        sizes="100vw"
      />
      <div className="container mx-auto px-0 md:px-5 lg:px-5 xl:px-4 2xl:px-4 md:py-20 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-0 lg:gap-0 xl:gap-10 2xl:gap-10 items-center md:items-center lg:items-start mx-auto max-w-7xl p-6 py-10 lg:px-1">
          {/* Hero Details */}
          <div className="w-full lg:mt-6 mt-0">
            <div className="bg-[#119D90] mb-2 w-fit md:inline-block px-3 py-2 rounded text-white font-thin text-xs sm:text-sm">
              <p>প্রফেশনালদের জন্য সুযোগ </p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold text-white md:leading-[3rem] lg:leading-[4.87rem] xl:leading-[4.87rem] 2xl:leading-[4.87rem]">
              এক্সপার্ট বা সিনিয়র প্রফেশনাল?
            </h1>
            <p className="md:text-xl lg:text-[1.6rem] font-medium text-gray-100  max-w-3xl md:leading-9 mt-3 md:mt-4 lg:mt-6 font-primary">
              আপনার স্কিল ও অভিজ্ঞতা দিয়ে অন্যদের ক্যারিয়ার তৈরি ও এগিয়ে নিতে
              অবদান রাখতে যুক্ত হোন{" "}
              <span className="font-bold">প্রায়োগিকের</span> সাথে:
            </p>
            <ul className="mt-3 lg:mt-4 pl-5">
              {programTypes.map((type, index) => (
                <li
                  key={index}
                  className={cn(
                    "md:text-start text-sm md:text-xl font-light max-w-3xl leading-relaxed text-white md:mt-2 list-disc list-outside",
                    index === 2 && "md:w-[69%]"
                  )}
                >
                  {type}
                </li>
              ))}
            </ul>
            <div className="flex flex-row justify-center md:justify-start gap-4 mt-10">
              <a
                href="tel:+8801814432875"
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-white hover:opacity-95 text-brand"
              >
                বিস্তারিত জানতে কল বুক করুন 
              </a>
            </div>
          </div>
          {/* image */}
          <div className="w-full items-center justify-end lg:flex xl:mt-0 2xl:mt-0 lg:mt-6 mt-6 hidden sm:block">
            <Image
              src={coursehero}
              alt=""
              width={520}
              height={474}
              quality={100}
              priority
              sizes="(max-width: 768px) 100vw, (min-width: 1200px) 544px, 50vw"
              className="w-full h-auto object-cover md:px-4 md:pl-12 pl-0 px-0"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
