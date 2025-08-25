import React from "react";
import Link from "next/link";
import Image from "next/image";
import ctaImg from "public/course-proposals/course-proposal-cta.webp";

const CtaSection = () => {
  return (
    <section className="w-full py-10 sm:py-16 lg:py-20 bg-brand-primary-light">
      <div className="app-container">
        <div className="w-full flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-[60px] relative">
          {/* Image container */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <Image
              src={ctaImg}
              alt=""
              width={448}
              height={216}
              quality={75}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 448px"
              className="object-cover w-full h-auto max-w-[448px] mx-auto lg:mx-0"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          
          {/* Text container */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="course-proposal-heading mb-3">
              আপনার ভাবনা আমাদের জানাতে পারেন
            </h2>
            <p className="course-proposal-description mb-6 sm:mb-8 lg:mb-10 max-w-full md:max-w-[34rem] lg:max-w-[37rem]">
              আপনার চিন্তা, জ্ঞান ও অভিজ্ঞতা থেকে তৈরি হতে পারে কার্যকর একটি
              কোর্স—শুধু প্রস্তাব জমা দিন, বাকি সব কিছুতেই থাকছে আমাদের সহযোগিতা
              ও সহায়তা।
            </p>
            
            {/* CTA Button */}
            <Link
              href="https://prayogik-teacherapp-dev-production.vercel.app/"
              className="inline-block bg-secondary-button p-3 sm:py-3 sm:px-4 rounded-[6px] text-white text-sm sm:text-base font-medium hover:opacity-90 transition-opacity duration-200 w-full sm:w-auto"
              target="_blank"
            >
              কোর্স আইডিয়া জমা দিন
            </Link>
          </div>
          
          {/* Decorative SVG */}
          <div className="absolute right-4 sm:right-8 lg:right-28 -bottom-2 sm:-bottom-3 lg:-bottom-5 hidden sm:block z-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="64"
              viewBox="0 0 84 90"
              fill="none"
              className="sm:w-[70px] sm:h-[75px] lg:w-[84px] lg:h-[90px]"
            >
              <path
                d="M40.9765 15.5156C40.9765 15.5156 43.6555 34.7083 52.0439 42.6986C60.872 51.1076 81.9531 52.7572 81.9531 52.7572C81.9531 52.7572 60.872 54.4068 52.0439 62.8158C43.6555 70.8061 40.9765 89.9988 40.9765 89.9988C40.9765 89.9988 38.2976 70.8061 29.9091 62.8158C21.0811 54.4068 0 52.7572 0 52.7572C0 52.7572 21.0811 51.1076 29.9091 42.6986C38.2976 34.7083 40.9765 15.5156 40.9765 15.5156Z"
                fill="#D9EEEC"
              />
              <path
                d="M66.9289 0C66.9289 0 68.045 7.91814 71.5398 11.2146C75.2177 14.6838 84.0005 15.3644 84.0005 15.3644C84.0005 15.3644 75.2177 16.0449 71.5398 19.5141C68.045 22.8106 66.9289 30.7287 66.9289 30.7287C66.9289 30.7287 65.8128 22.8106 62.3181 19.5141C58.6402 16.0449 49.8574 15.3644 49.8574 15.3644C49.8574 15.3644 58.6402 14.6838 62.3181 11.2146C65.8128 7.91814 66.9289 0 66.9289 0Z"
                fill="#D9EEEC"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;