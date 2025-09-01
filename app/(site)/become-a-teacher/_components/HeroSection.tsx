import React from "react";
import Image from "next/image";
// import becometeacherhero from "@/public/site/become-teacher/become-teacher-hero.webp";
import becometeacherhero from "@/public/course-proposals/course-proposal-hero.webp";

const HeroSection = () => {
  return (
    <section className="w-full relative bg-brand">
      {/* block image shape */}
      <Image
        src="/images/home/BG.svg"
        alt="Prayogik Hero background"
        fill
        priority
        quality={75}
        className="object-cover z-0 md:block hidden"
        sizes="100vw"
      />
      <div className="app-container mx-auto  md:py-6 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-10 2xl:gap-10 items-center md:items-center lg:items-start py-10">
          {/* Hero Details */}
          <div className="w-full mt-0 relative">
            <div className="bg-[#119D90] mb-2 w-fit md:inline-block px-3 py-2 rounded text-white font-light md:font-thin text-xs sm:text-sm">
              <p>প্রফেশনালদের জন্য সুযোগ </p>
            </div>
            <h1 className="text-3xl md:text-3xl lg:text-[2.3rem] xl:text-[3rem] 2xl:text-[3.2rem] font-bold text-white md:leading-[3rem] lg:leading-[4.87rem] xl:leading-[4.87rem] 2xl:leading-[4.87rem] text-wrap md:text-nowrap ">
              প্রায়োগিকের সাথে মেন্টর <br className="hidden md:block" /> হিসাবে
              যুক্ত হোন
            </h1>
            <p className="text-lg md:text-lg font-normal text-gray-100 max-w-3xl md:leading-8 mt-3 md:mt-4 lg:mt-6 font-primary">
              আপনি যদি সিনিয়র ও অভিজ্ঞ  প্রফেশনাল হন, তবে আপনার স্কিল ও অভিজ্ঞতা
              দিয়ে অন্যদের ক্যারিয়ার গড়তে অবদান রাখুন। কোর্স তৈরি করুন, লাইভ
              ট্রেনিং নিন এবং ওয়ার্কশপ ও সেমিনারে কী-নোট স্পিকার হিসেবে যুক্ত
              হোন।
            </p>

            <div className="flex flex-row justify-start md:justify-start gap-4 mt-10">
              <a
                href="tel:+8801814432875"
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-white hover:opacity-95 text-brand"
              >
                বিস্তারিত জানতে কল বুক করুন 
              </a>
            </div>
            {/* star shape */}
            <div className="absolute z-0 hidden lg:block lg:bottom-[-5%] lg:left-[70%] xl:bottom-[-5%] xl:left-[60%] w-[80px] h-[80px] xl:w-[110px] xl:h-[110px]">
              <Image
                src="/images/home/star.svg"
                alt="background star image"
                fill
                loading="lazy"
                quality={75}
                className="object-contain "
              />
            </div>
          </div>
          {/* image */}
          <div className="relative w-full md:max-w-[520px] aspect-[520/453] overflow-hidden pl-16  mt-8 md:mt-0">
            <Image
              src={becometeacherhero}
              alt="কোর্স হিরো"
              fill
              className="object-cover rounded-lg"
              placeholder="blur"
              quality={75}
              priority={true}
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (min-width: 1200px) 544px, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
