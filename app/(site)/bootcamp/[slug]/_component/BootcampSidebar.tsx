import Link from "next/link";
import * as React from "react";

export default function BootcampSidebar() {
  const schedule = [
    { time: "9:30 AM", description: "কফি এবং জলখাবার।" },
    { time: "9:50 AM", description: "প্যানেল আলোচনা শুরু।" },
    { time: "11:15 AM", description: "প্রশ্ন উত্তর পর্ব" },
    { time: "9:30 AM", description: "কফি এবং জলখাবার।" },
    { time: "9:50 AM", description: "প্যানেল আলোচনা শুরু।" },
    { time: "11:15 AM", description: "প্রশ্ন উত্তর পর্ব" },
    {
      time: "11:30 AM",
      description: "সমাপ্তি এবং পরবর্তী পদক্ষেপ",
      last: true,
    },
  ];
  return (
    <div className="flex flex-col gap-5 mt-5 md:mt-10">
      <article className="overflow-hidden  w-full md:max-w-xs rounded-lg border-solid bg-teal-600 bg-opacity-10 border-[1.5px] border-[color:var(--Primary-Light-300,#5DB7AF)]">
        <img
          loading="lazy"
          src="/images/teacher/bootcamp.webp"
          className="object-contain w-full aspect-[1.7]"
          alt="Course preview"
        />
        <div className="p-6 w-full">
          <header className="w-full text-slate-600">
            <h2 className="text-xl font-medium leading-snug">
              বুটক্যাম্পপ্রতি সিট:
            </h2>
            <p className="text-4xl font-bold leading-tight text-teal-600">
              ৬০,০০০ টাকা
            </p>
            <div className="flex gap-1.5 items-center w-full text-base">
              <p className="self-stretch my-auto">মাসিক ইনস্টলমেন্ট সুবিধা</p>
              <img src="/icon/clock.png" alt="icon" />
            </div>
          </header>

          <section className="mt-5 w-full text-base text-slate-600">
            <div className="flex gap-2 items-center w-full whitespace-nowrap">
              <img src="/icon/clock.png" alt="icon" />
              <p className="flex-1 shrink self-stretch my-auto basis-0">
                ফুল-টাইম
              </p>
            </div>

            <div className="flex gap-2 items-center mt-3 w-full">
              <img src="/icon/location.png" alt="icon" />
              <p className="flex-1 shrink self-stretch my-auto basis-0">
                জিইসি, চট্টগ্রাম
              </p>
            </div>

            <div className="flex gap-2 items-center mt-3 w-full">
              <img src="/icon/money-3.png" alt="icon" />
              <p className="flex-1 shrink self-stretch my-auto basis-0">
                পেইড বুটক্যাম্প
              </p>
            </div>

            <div className="flex flex-col justify-center mt-3 w-full">
              <div className="flex gap-2 items-center w-full">
                <img src="/icon/calendar.png" alt="icon" />
                <p className="flex-1 shrink self-stretch my-auto basis-0">
                  ২১ জানুয়ারী থেকে ১১ এপ্রিল
                </p>
              </div>
              <p className="mt-1 flex-1 shrink gap-2 self-stretch pl-3.5 w-full">
                সোমবার থেকে শুক্রবার
              </p>
              <p className="mt-1 flex-1 shrink gap-2 self-stretch pl-3.5 w-full">
                ১২ সপ্তাহের বুটক্যাম্প
              </p>
            </div>

            <div className="flex gap-2 items-start mt-3 w-full leading-6">
              <img src="/icon/receipt-add.png" alt="icon" />
              <p className="flex-1 shrink basis-0">
                ১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ
              </p>
            </div>
          </section>

          <footer className="mt-5 w-full font-semibold text-center">
            <Link
              href={"/bootcamp/registration"}
              className="flex  overflow-hidden gap-1 justify-center items-center px-2.5 py-3 w-full text-base text-white bg-teal-600 hover:bg-teal-400 transition-all duration-300 rounded-md min-h-12"
            >
              <span className="gap-2 self-stretch px-1 my-auto">
                রেজিস্ট্রেশন করুন
              </span>
            </Link>
            <button className="flex overflow-hidden gap-0.5 justify-center items-center px-1.5 py-2 mt-2 w-full text-xs leading-none text-teal-600 rounded min-h-8">
              <span className="gap-2 self-stretch px-1 my-auto">
                বুকমার্কে যুক্ত করুন
              </span>
            </button>
          </footer>
        </div>
      </article>
      <div className="w-full  bg-white rounded-md">
        <div className="p-6 mt-4 rounded-lg border border-slate-200">
          <div>
            <h2 className="mb-2 text-xl font-bold text-fontcolor-title">
              সময়সূচী
            </h2>
            {schedule.map((item, index) => {
              const isFirst = index === 0;
              const isLast = item.last || index === schedule.length - 1;

              return (
                <article
                  key={index}
                  className="relative flex gap-2 items-stretch w-full"
                >
                  <div className="relative flex flex-col items-center">
                    {!isFirst && (
                      <div className="absolute left-1/2 w-0.5 h-2 bg-teal-600 -translate-x-1/2" />
                    )}
                    <div className="relative z-10 mt-6 flex justify-center items-center w-4 h-4 bg-teal-600 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    {!isLast && (
                      <div className="absolute top-5 left-1/2 w-0.5 bg-teal-600 -translate-x-1/2 h-[calc(100%)] mt-5" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 gap-1 md:gap-2 pt-6">
                    <time className="w-24 text-base font-semibold text-slate-900 shrink-0">
                      {item.time}
                    </time>
                    <p className="flex-1 text-base text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
