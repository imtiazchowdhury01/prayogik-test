"use client";
import { useState } from "react";
import { scroller } from "react-scroll";

const CertificationTabs = ({ data }: { data: any }) => {
  const [activeNav, setActiveNav] = useState<string>("সংক্ষিপ্ত বিবরণ");
  let navigation = [{ name: "সংক্ষিপ্ত বিবরণ", href: "course-description" }];

  if (data?.learningOutcomes?.length > 0 || data?.requirements?.length > 0) {
    navigation = [
      ...navigation,
      { name: "আউটকাম ও অ্যাচিভমেন্ট", href: "course-outcome-achievement" },
      { name: "প্রশিক্ষক", href: "instructor" },
      { name: "রিভিউ", href: "review" },
      { name: "সার্টিফিকেশন ফি", href: "certification-fee" },
      { name: "FAQs", href: "course-faq" },
    ];
  } else {
    navigation = [
      ...navigation,
      { name: "আউটকাম ও অ্যাচিভমেন্ট", href: "course-outcome-achievement" },
      { name: "প্রশিক্ষক", href: "instructor" },
      { name: "রিভিউ", href: "review" },
      { name: "সার্টিফিকেশন ফি", href: "certification-fee" },
      { name: "FAQs", href: "course-faq" },
    ];
  }

  const scrollToSection = (sectionId: string) => {
    scroller.scrollTo(sectionId, {
      duration: 1500,
      delay: 0,
      offset: -100,
    });
  };

  return (
    <section
      id="certification-tabs" // Add this ID
      className="border-b-[1px] border-greyscale-200 mb-8  flex items-center overflow-x-auto hide-scrollbar space-x-5 max-w-4xl"
    >
      {navigation.map((navItem, ind) => {
        return (
          <button
            key={ind}
            onClick={() => {
              setActiveNav(navItem.name);
              scrollToSection(navItem.href);
            }}
            className={`text-[#475569] inline-block text-nowrap hover:bg-[#e7f4f3] rounded-t-lg font-semibold p-2 transition-all duration-300   ${
              activeNav === navItem.name &&
              "border-b-[3px] border-brand text-brand"
            }`}
          >
            {navItem.name}
          </button>
        );
      })}
    </section>
  );
};

export default CertificationTabs;
