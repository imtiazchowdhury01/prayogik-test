import React from "react";

export const BootcampInfo = () => {
  return (
    <section className="flex flex-col flex-1 p-8 bg-white rounded-lg border-l-4 border-solid basis-0 border-l-[color:var(--Secondary-Main-500,#f9851a)] min-w-60 max-md:p-6 max-sm:p-4">
      <header className="flex flex-col w-full">
        <h1 className="text-3xl font-bold leading-none  max-sm:text-2xl">
          <span>ডিজিটাল মার্কেটিং {" "}</span>
          <span className="text-orange-500">বুটক্যাম্প</span>
        </h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          ডিজিটাল মার্কেটিংয়ে ক্যারিয়ার গড়ার জন্য দ্রুত গতিতে যান। এই
          সার্টিফিকেট প্রোগ্রামে, আপনি আপনার নিজস্ব গতিতে চাহিদার মধ্যে দক্ষতা
          শিখবেন
        </p>
      </header>

      <section className="flex flex-col mt-6 w-full text-slate-600">
        <h2 className="text-xl font-medium leading-snug">
          বুটক্যাম্প প্রতি সিটের মূল্য:
        </h2>
        <p className="text-4xl font-bold leading-tight text-teal-600 max-sm:text-3xl">
          ৬০,০০০ টাকা
        </p>
        <div className="flex gap-1.5 items-center w-full text-base">
          <p>মাসিক ইনস্টলমেন্ট সুবিধা</p>
          <img src="/icon/info-circle.png" />
        </div>
      </section>

      <section className="flex flex-col mt-6 w-full text-base text-slate-600">
        <div className="flex gap-2 items-center w-full">
          <img src="/icon/clock.png" />
          <p>ফুল-টাইম</p>
        </div>
        <div className="flex gap-2 items-center mt-3 w-full">
          <img src="/icon/money-3.png" />
          <p>পেইড বুটক্যাম্প</p>
        </div>
        <div className="flex gap-2 items-center mt-3 w-full">
          <img src="/icon/location.png" />
          <p>জিইসি, চট্টগ্রাম</p>
        </div>
        <div className="flex flex-col mt-3 w-full">
          <div className="flex gap-2 items-center w-full">
            <img src="/icon/calendar.png" />
            <p>২১ জানুয়ারী থেকে ১১ এপ্রিল</p>
          </div>
          <p className="pl-7 mt-1">সোমবার থেকে শুক্রবার</p>
          <p className="pl-7 mt-1">১২ সপ্তাহের বুটক্যাম্প</p>
        </div>
        <div className="flex gap-2 items-start mt-3 w-full">
          <img src="/icon/receipt-add.png" />
          <p>১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ</p>
        </div>
      </section>
    </section>
  );
};
