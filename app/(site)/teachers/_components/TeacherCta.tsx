import Link from "next/link";
import React from "react";
import Image from "next/image";

const TeacherCta = () => {
  return (
    <section className="relative rounded-none sm:rounded-xl py-10 px-2 sm:p-20 app-container mx-auto overflow-hidden mb-28">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/teacher/teacher-cta-bg.webp"
          alt="Background"
          fill
          className="object-cover"
          quality={75}
          priority
        />
      </div>

      {/* CTA Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 pb-0 leading-tight">
          শিক্ষক হিসেবে যোগদান করতে চান?
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-light text-white max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 leading-5 sm:leading-6 md:leading-7 mb-6 sm:mb-7 md:mb-8 mt-1 sm:mt-2">
          আপনার দক্ষতা শেয়ার করুন, আয় করুন নিজের নিয়মে, আর গড়ে তুলুন
          শিক্ষার্থীদের শেখার নতুন সম্ভাবনা প্রয়োগিকে প্ল্যাটফর্মে।
        </p>
        <Link
          href={"/become-a-teacher"}
          className="block w-full bg-secondary-button hover:bg-secondary-button hover:opacity-95 px-4 py-3 text-sm md:text-base text-center text-white transition-all duration-300 rounded-lg sm:w-auto sm:inline-block sm:px-6 sm:py-3"
        >
          রেজিস্ট্রেশন করুন
        </Link>
      </div>
    </section>
  );
};

export default TeacherCta;
