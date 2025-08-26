// @ts-nocheck
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const BootcampCurriculum: React.FC = () => {
  const curriculumItems = [
    {
      id: 1,
      title: "১. UX রিসার্চ ভূমিকা",
      week: "১ম সপ্তাহ",
      content: `ডিজাইন হলো আপনার ব্যবহারকারীদের সমস্যা সমাধানের বিষয়, এবং ব্যবহারকারী গবেষণা কেন সমস্যাটি বিদ্যমান তা আবিষ্কার করে। এই ইউনিটে, আপনি ডিজাইন ক্ষেত্রে বিভিন্ন ধরণের ব্যবহারকারী গবেষণার মধ্য দিয়ে যাবেন এবং তারপরে আরও দক্ষ এবং কার্যকর ব্যবহারকারী গবেষণার জন্য কীভাবে AI ব্যবহার করা যেতে পারে তা শিখবেন।

  বিভিন্ন ডিজাইন-ভিত্তিক গবেষণা পদ্ধতির সাথে পরিচিত হন
  ডিজাইন প্রক্রিয়ার বিভিন্ন পর্যায়ে কোন গবেষণা পদ্ধতি ব্যবহার করবেন তা নির্ধারণ করুন
  কোনও অ্যাপ বা ওয়েবসাইট থেকে ডেটা ব্যবহার কীভাবে ব্যাখ্যা করতে হয় তা শিখুন
  ব্যবহারকারী গবেষণায় ChatGPT ব্যবহার করুন
  স্বয়ংক্রিয় ডেটা সংগ্রহ এবং বিশ্লেষণ অন্বেষণ করুন`,
    },
    {
      id: 2,
      title: "২. UX প্ল্যানিং & স্ক্রীনিং",
      week: "২য় এবং ৩য় সপ্তাহ",
    },
    {
      id: 3,
      title: "৩.ওয়্যারফ্রেমিং",
      week: "৪থ সপ্তাহ",
    },
    {
      id: 4,
      title: "৪. হাই ফেডালিটি মকাপ",
      week: "৫ম এবং ৬ষ্ঠ সপ্তাহ",
    },
    {
      id: 5,
      title: "৫. ডেভেলপারের সাথে কোলাবোরেট",
      week: "৭ম এবং ৮ম সপ্তাহ",
    },
    {
      id: 6,
      title: "৬. AI & UX",
      week: "৯ম এবং ১০ম সপ্তাহ",
    },
    {
      id: 7,
      title: "৭. ক্যাপস্টোন প্রকল্প এবং ক্যারিয়ার সহায়তা",
      week: "১১তম এবং ১২তম সপ্তাহ",
    },
  ];

  return (
    <>
      <main className="w-full flex flex-col py-5 mx-auto my-0 ">
        <header className="flex gap-2 justify-between items-center mb-4 w-full text-slate-900 max-sm:flex-col max-sm:gap-1 max-sm:items-start">
          <h1 className="text-2xl font-bold leading-none max-sm:text-lg">
            বুটক্যাম্প কারিকুলাম
          </h1>
          <p className="text-lg font-medium leading-none text-slate-600 max-sm:text-sm">
            ৭টি লেসন
          </p>
        </header>

        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {curriculumItems.map((data, ind) => {
              return (
                <AccordionItem
                  value={data?.id}
                  key={ind}
                  className="data-[state=open]:border-[1px] border-b-0 data-[state=open]:shadow-md p-3 rounded-lg data-[state=open]:border-[#E2E8F0] data-[state=open]:bg-white"
                >
                  <AccordionTrigger className="text-lg font-medium data-[state=open]:border-b-[1px] data-[state=open]:border-[#F1F5F9] hover:no-underline text-fontcolor-title ">
                    {data?.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-[#475569] pt-3">
                    <div className="text-sm leading-5 text-slate-900 max-sm:text-sm max-sm:leading-4">
                      {data?.content &&
                        data?.content.split("\n").map((text, index) => (
                          <React.Fragment key={index}>
                            <p>{text}</p>
                            {index < data?.content.split("\n").length - 1 && (
                              <br />
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </main>
    </>
  );
};
