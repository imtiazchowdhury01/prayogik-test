// @ts-nocheck
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import ExpertCard from "@/components/ExpertCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MoreBtn from "@/components/more-btn";
import EventCard from "@/components/EventCard";
const EventDetailsPage = () => {
  const eventDetails = [
    {
      id: "type",
      title: "ফ্রি ইভেন্ট",
      icon: "/icon/money.svg",
    },
    {
      id: "location",
      title: "জিইসি, চট্টগ্রাম",
      icon: "/icon/location.svg",
    },
    {
      id: "time",
      title: "৯:৩০ am - ১১:৩০ pm",
      icon: "/icon/clock.svg",
    },
  ];
  const schedule = [
    { time: "9:30 AM", description: "কফি এবং জলখাবার।" },
    { time: "9:50 AM", description: "প্যানেল আলোচনা শুরু।" },
    { time: "11:15 AM", description: "প্রশ্ন উত্তর পর্ব" },
    {
      time: "11:30 AM",
      description: "সমাপ্তি এবং পরবর্তী পদক্ষেপ",
      last: true,
    },
  ];
  const faqData = [
    {
      id: "1",
      question: "কোর্সের ভর্তি বাতিল করা কী সম্ভব ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: "2",
      question: "সার্টিফিকেটের মেয়াদ কী শেষ হবে ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: "3",
      question: "কোন টেকনিকাল সমস্যা কিভাবে রিপোর্ট করবো ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: "4",
      question: "পাসওয়ার্ড ভুলে গেলে কিভাবে ঠিক করবো ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
  ];
  return (
    <main className="w-full min-h-[70vh]">
      {/* navigation-- */}
      <div className="bg-background-primary-darker">
        <div className="app-container">
          <Breadcrumb className="py-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/courses"
                    className="text-sm font-medium text-white sm:text-base hover:text-white/80"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-fontcolor-disable" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/courses"
                    className="text-sm font-medium text-white sm:text-base hover:text-white/80"
                  >
                    ইভেন্ট
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-fontcolor-disable" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-fontcolor-disable sm:text-base">
                  UI UX ডিজাইন ইভেন্ট
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      {/* hero section-- */}
      <section className="w-full relative bg-[url('/gradient-hero-bg.svg')] px-3 bg-cover flex flex-col items-center justify-center object-cover bg-center bg-no-repeat h-96 sm:px-0">
        <div className="flex flex-col items-center justify-between lg:flex-row app-container">
          <div>
            <h2 className="text-3xl leading-[1.5] font-bold text-center text-white sm:text-5xl lg:text-6xl sm:text-left ">
              UI UX ডিজাইন <span className="text-secondary-500">ইভেন্ট</span>
            </h2>
            <p className="mt-2 sm:mt-4 text-base lg:text-lg font-medium text-center sm:text-left text-white leading-[1.6]">
              ডিজিটাল মার্কেটিংয়ে ক্যারিয়ার গড়ার জন্য দ্রুত গতিতে যান। এই
              সার্টিফিকেট <br className="hidden sm:block" /> প্রোগ্রামে, আপনি
              আপনার নিজস্ব গতিতে চাহিদার মধ্যে দক্ষতা শিখবেন
            </p>
          </div>
          <div className="bg-white border-t-[4px] border-secondary-500 p-6 rounded-lg lg:relative absolute z-10 w-full max-w-[330px] left-1/2 sm:left-auto transform -translate-x-1/2  sm:transform-none -bottom-44 lg:bottom-auto sm:right-6">
            <h6 className="text-2xl sm:text-3xl font-semibold text-fontcolor-title">
              ০৬ ফেব্রুয়ারী ২০২৫
            </h6>
            <div className="flex flex-col my-6 space-y-2">
              {eventDetails.map((detail) => {
                return (
                  <div className="flex items-center space-x-2" key={detail.id}>
                    <Image
                      src={detail.icon}
                      alt={detail.title}
                      width={20}
                      height={20}
                    />
                    <p className="text-sm sm:text-base text-fontcolor-description">
                      {detail.title}
                    </p>
                  </div>
                );
              })}
            </div>
            <Link
              href={"/event/registration"}
              className="block w-full py-3 text-sm text-center text-white transition-all duration-300 rounded-lg sm:text-base bg-primary-brand hover:opacity-70"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </div>
        </div>
      </section>
      {/* overview section-- */}
      <section className="pt-56 sm:pt-60 lg:py-20 bg-background-gray">
        <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-16 app-container">
          <div className="w-full space-y-4 md:w-3/5">
            <h4 className="text-3xl font-bold text-fontcolor-title">
              সংক্ষিপ্ত বিবরণ
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              কোল্ড ইমেল আউটরিচ হল একটি ইমেল মার্কেটিং পদ্ধতি যা অতিথি পোস্টিং
              অনুরোধ, কন্টেন্ট মার্কেটিং, অথবা পরিষেবা প্রচারের জন্য ব্যবহৃত
              হয়। অর্থাৎ, আপনি ইমেল মালিককে এমনভাবে ইমেল করছেন যাতে ইমেল মালিক
              বুঝতে না পারেন যে আপনি তাকে কিছু প্রচার করেছেন।
            </p>
            <p className="text-base font-medium text-fontcolor-description">
              কোল্ড ইমেল আউটরিচ কী, কেন এটি প্রয়োজন এবং এটি কীভাবে কাজ করে তার
              বিস্তারিত তথ্য আমি আমার গবেষণা এবং অভিজ্ঞতা থেকে শেয়ার করেছি, যদি
              আপনি কোনও অংশ বুঝতে না পারেন, তাহলে একটি মন্তব্য বাক্স আছে।
            </p>
            <p className="text-base font-medium text-fontcolor-description">
              আমি গুগল, ইউটিউব অনুসন্ধান করে এবং পরীক্ষা-নিরীক্ষা করে বেশিরভাগ
              সরঞ্জাম এবং বিষয় শিখেছি। তাই যদি আপনার আরও ভাল কোনও পদ্ধতি বা
              সরঞ্জাম জানা থাকে, তাহলে দয়া করে মন্তব্য বাক্সে আমাকে জানান।
            </p>
          </div>
          <div className="w-full p-6 bg-white rounded-md md:w-2/5">
            <h2 className="mb-4 text-xl font-bold text-fontcolor-title">
              সময়সূচী
            </h2>
            <ol className="space-y-8 overflow-hidden">
              {schedule.map(({ time, description, last }, index) => (
                <li
                  key={index}
                  className={`relative flex-1 ${
                    !last
                      ? "after:content-[''] after:w-0.5 after:h-[70px] after:bg-primary-brand after:inline-block after:absolute after:-bottom-11 after:left-3"
                      : ""
                  }`}
                >
                  <div className="flex items-start w-full">
                    <div className="flex items-center justify-center w-6 h-6 mr-3 text-sm text-white border-2 border-transparent rounded-full bg-primary-brand">
                      <span className="w-3 h-3 bg-white rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold leading-5 text-fontcolor-title font-ternary">
                        {time}
                      </h4>
                      <span className="text-sm font-medium text-fontcolor-description">
                        {description}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      {/* event speaker section-- */}
      <section className="py-16 lg:pb-20 lg:pt-0 bg-background-gray">
        <div className="app-container">
          <h4 className="text-3xl font-bold text-fontcolor-title">
            ইভেন্ট এর স্পিকার
          </h4>
          <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, ind) => {
              return <ExpertCard key={ind} />;
            })}
          </div>
        </div>
      </section>
      {/* FAQ section-- */}
      <section className="pb-20 bg-background-gray">
        <div className="app-container">
          <h4 className="mb-4 text-3xl font-bold text-fontcolor-title">
            কিছু প্রশ্ন এবং উত্তর
          </h4>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((data, ind) => {
              return (
                <AccordionItem
                  value={data.id}
                  key={ind}
                  className="data-[state=open]:border-[1px]  data-[state=open]:shadow-md p-3 rounded-lg data-[state=open]:border-border-greyscale-200 data-[state=open]:bg-white border-b-[1px] border-greyscale-200"
                >
                  <AccordionTrigger className="text-lg font-medium data-[state=open]:border-b-[1px] data-[state=open]:border-greyscale-100 hover:no-underline text-fontcolor-title ">
                    {data.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-fontcolor-description pt-3">
                    {data.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>
      {/* events section-- */}
      <section className="pb-20 bg-background-gray">
        <div className="app-container">
          <div className="flex items-center justify-between">
            <h4 className="mb-4 text-3xl font-bold text-fontcolor-title">
              আরো ইভেন্ট
            </h4>
            <MoreBtn
              href="/event"
              title="আরো দেখুন"
              className="hidden text-xs font-semibold md:flex"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, ind) => {
              return <EventCard key={ind} />;
            })}
          </div>
          <div className="flex items-center justify-center mt-5">
            <MoreBtn
              href="/event"
              title="আরো দেখুন"
              className="flex text-xs font-semibold md:hidden"
            />
          </div>
        </div>
      </section>
      {/* event registration-- */}
      <section className="flex flex-col items-center justify-center px-3 py-20 bg-white">
        <h4 className="mb-4 text-3xl font-bold text-center sm:text-4xl text-fontcolor-title">
          এখনই <span className="text-secondary-brand">ইভেন্ট</span> রেজিস্ট্রেশন
          করুন
        </h4>
        <p className="text-center text-fontcolor-description">
          দূরবর্তী শিক্ষার নমনীয়তার জন্য ক্লাসে যাতায়াতের বিকল্পটি ব্যবহার
          করুন। আমাদের ক্যারিয়ার পরিবর্তনকারী{" "}
          <br className="hidden md:block" /> প্ল্যাটফর্মটি ব্যস্ত সময়সূচী
          মাথায় রেখে তৈরি করা হয়েছে, যাতে আপনি আপনার নিজস্ব সময়সূচ
        </p>
        <button className="py-4 mt-10 text-base font-semibold text-white transition-all duration-300 rounded-lg hover:opacity-70 bg-primary-brand px-7">
          <Link href={"/event/registration"}>রেজিস্ট্রেশন করুন</Link>
        </button>
      </section>
    </main>
  );
};

export default EventDetailsPage;
