import React from "react";




const CTA = () => {
  return (
    <section className="flex flex-col justify-center items-center px-72 py-20 text-center bg-zinc-100 max-md:px-5 mt-10 md:mt-20">
      <div className="flex flex-col w-full  max-md:max-w-full">
        <section className="flex flex-col items-center w-full max-md:max-w-full">
          <h2 className="text-4xl font-bold leading-tight  max-md:max-w-full">
            এখনই <span className="text-[#F9851A]">বুটক্যাম্পে</span>{" "}
            রেজিস্ট্রেশন করুন{" "}
          </h2>
          <p className="mt-4 text-lg leading-7 text-slate-600 w-[682px] max-md:max-w-full">
            দূরবর্তী শিক্ষার নমনীয়তার জন্য ক্লাসে যাতায়াতের বিকল্পটি ব্যবহার
            করুন। আমাদের ক্যারিয়ার পরিবর্তনকারী প্ল্যাটফর্মটি ব্যস্ত সময়সূচী
            মাথায় রেখে তৈরি করা হয়েছে, যাতে আপনি আপনার নিজস্ব সময়সূচ
          </p>
        </section>
        <div className="flex justify-center mt-10">
          <button
            className="flex overflow-hidden gap-1 justify-center items-center px-6 py-4 text-lg font-semibold leading-none text-white bg-teal-600 rounded-md min-h-14 hover:bg-teal-700 transition-colors"
            aria-label="রেজিস্ট্রেশন করুন"
          >
            <span className="gap-2 self-stretch px-1 my-auto">
              রেজিস্ট্রেশন করুন
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
