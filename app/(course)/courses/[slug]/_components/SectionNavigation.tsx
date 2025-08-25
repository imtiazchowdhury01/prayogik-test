"use client";
import { useState } from "react";
import { scroller } from "react-scroll";

const SectionNavigation = ({ course }: { course: any }) => {
  const [activeNav, setActiveNav] = useState<string>("কোর্সের বিবরণ");
  let navigation = [{ name: "কোর্সের বিবরণ", href: "overview" }];

  if (
    course?.learningOutcomes?.length > 0 ||
    course?.requirements?.length > 0
  ) {
    navigation = [
      ...navigation,
      { name: "আউটকাম ও রিকোয়ারমেন্ট", href: "other-facilities" },
      { name: "সিলেবাস", href: "syllabas" },
      { name: "ইন্সট্রাক্টর পরিচিতি", href: "instructor" },
    ];
  } else {
    navigation = [
      ...navigation,
      { name: "সিলেবাস", href: "syllabas" },
      { name: "ইন্সট্রাক্টর পরিচিতি", href: "instructor" },
    ];
  }

  const scrollToSection = (sectionId: string) => {
    scroller.scrollTo(sectionId, {
      duration: 1500,
      delay: 0,
      offset: -100,
      // smooth: "ease",
    });
  };
  return (
    <section className="border-b-[1px] border-greyscale-200 my-6 mt-12 flex items-center overflow-x-auto hide-scrollbar space-x-5">
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
              "border-b-[3px] border-primary-brand bg-[#E7F4F3] text-primary-700"
            }`}
          >
            {navItem.name}
          </button>
        );
      })}
    </section>
  );
};

export default SectionNavigation;
