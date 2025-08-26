import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="mx-auto py-10 lg:py-16 max-w-4xl">
      <div className="bg-white rounded-lg drop-shadow overflow-hidden w-full p-8 md:p-10">
        <h1 className="mt-2 text-3xl md:text-3xl font-bold mb-[30px]">
          কোর্সে অংশগ্রহণ কারীদের মন্তব্য
        </h1>
        {/* Content */}
        <p className="text-base text-gray-700 mt-[30px]">
          আমরা বেশ কয়েকটি সাইট থেকে আমাদের ট্রেনিং, বুটক্যাম্প ও কোর্স পরিচালনা
          করেছি। এখানে আমাদের পুরানো কিছু কার্যক্রমের মন্তব্যও সংযুক্ত করা
          হয়েছে।
        </p>
        <figure>
          <Image
            src="/testimonial-image.png"
            alt="Testimonial Image"
            width={600}
            height={400}
            className="md:w-7/12 mt-12 mx-auto h-auto"
            priority
          />
        </figure>
      </div>
    </div>
  );
}
