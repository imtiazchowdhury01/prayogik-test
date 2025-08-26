import React from "react";
import { Breadcrumb } from "./Breadcrumb";
import { CourseInfo } from "./CourseInfo";

export const BootcampHeader: React.FC = () => {
  const breadcrumbItems = [
    { label: "হোম", href: "#" },
    { label: "বুটক্যাম্প", href: "#" },
    { label: "UI UX ডিজাইন বুটক্যাম্প" },
  ];

  return (
    <article className="flex flex-col justify-center py-5 text-base">
      <header className="flex flex-col w-full">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 max-sm:text-3xl">
          <span>UI UX ডিজাইন {" "}</span>
          <span className="text-orange-500">বুটক্যাম্প</span>
        </h1>

        <section className="flex flex-col mt-5 w-full">
          <p className="mb-3 leading-6 text-slate-900">
            <span>ইন্সট্রাক্টর</span>
            <span className="font-semibold text-slate-900">আমজাদ হোসেন</span>
            <span>
              , ডিজিটাল মার্কেটিং এক্সপার্ট এবং 12 বছর এর অভিগতা সম্পুর্ন
            </span>
          </p>
          <CourseInfo />
        </section>
      </header>

      
    </article>
  );
};
