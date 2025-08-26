import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BootcampCard } from "./_component/BootcampCard";
import { TopicSelector } from "./_component/TopicSelector";
const BootcampListPage = () => {
  const bootcamps = [
    {
      id: 1,
      title: "গ্রাফিক্স ডিজাইন বুটক্যাম্প",
      image: "/images/teacher/teacher3.webp",
      altText: "Graphics Design Bootcamp",
      type: "ফুল-টাইম",
      location: "জিইসি, চট্টগ্রাম",
      paymentType: "পেইড বুটক্যাম্প",
      duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
      schedule: "সোমবার থেকে শুক্রবার",
      weeks: "১২ সপ্তাহের বুটক্যাম্প",
      registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
    },
    {
      id: 2,
      title: "ডিজিটাল মার্কেটিং বুটক্যাম্প",
      image: "/images/teacher/teacher3.webp",
      altText: "Digital Marketing Bootcamp",
      type: "ফুল-টাইম",
      location: "জিইসি, চট্টগ্রাম",
      paymentType: "পেইড বুটক্যাম্প",
      duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
      schedule: "সোমবার থেকে শুক্রবার",
      weeks: "১২ সপ্তাহের বুটক্যাম্প",
      registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
    },
    {
      id: 3,
      title: "ডিজিটাল মার্কেটিং বুটক্যাম্প",
      image: "/images/teacher/teacher3.webp",
      altText: "Digital Marketing Bootcamp",
      type: "ফুল-টাইম",
      location: "জিইসি, চট্টগ্রাম",
      paymentType: "পেইড বুটক্যাম্প",
      duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
      schedule: "সোমবার থেকে শুক্রবার",
      weeks: "১২ সপ্তাহের বুটক্যাম্প",
      registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
    },
    {
      id: 4,
      title: "UI UX ডিজাইন বুটক্যাম্প",
      image: "/images/teacher/teacher3.webp",
      altText: "UI UX Design Bootcamp",
      type: "ফুল-টাইম",
      location: "জিইসি, চট্টগ্রাম",
      paymentType: "পেইড বুটক্যাম্প",
      duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
      schedule: "সোমবার থেকে শুক্রবার",
      weeks: "১২ সপ্তাহের বুটক্যাম্প",
      registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
    },
  ];
  return (
    <main className="">
      {/* hero section */}
      <section className="w-full bg-[url('/images/teacher/herobg.webp')] px-3 bg-cover flex flex-col items-center justify-center object-cover bg-center bg-no-repeat h-72">
        <h2 className="text-3xl font-bold text-white md:text-5xl">
          ইন্ডাস্ট্রি ফোকাসড{" "}
          <span className="text-secondary-500">বুটক্যাম্প</span>
        </h2>
        <p className="mt-4 text-base md:text-lg font-medium text-center text-white leading-[1.6]">
          ডিজিটাল মার্কেটিংয়ে ক্যারিয়ার গড়ার জন্য দ্রুত গতিতে যান। এই
          সার্টিফিকেট প্রোগ্রামে, আপনি <br className="hidden md:block" /> আপনার
          নিজস্ব গতিতে চাহিদার মধ্যে দক্ষতা শিখবেন
        </p>
      </section>
      <section className="flex flex-col py-20 mx-auto my-0 app-container">
        <header className="flex items-center justify-between w-full mb-6 max-sm:flex-col max-sm:gap-4 max-sm:items-start">
          <h1 className="text-2xl font-bold leading-none text-slate-900">
            আপকামিং বুটক্যাম্প সমূহ
          </h1>
          <TopicSelector />
        </header>

        <div className="grid gap-5 w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] max-md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] max-sm:grid-cols-[1fr]">
          {bootcamps.map((bootcamp) => (
            <BootcampCard key={bootcamp.id} {...bootcamp} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BootcampListPage;
