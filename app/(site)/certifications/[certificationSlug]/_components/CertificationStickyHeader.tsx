// _components/certification-sticky-header.tsx
"use client";
import { useState, useEffect } from "react";
import { scroller } from "react-scroll";
import CertificationEnrollButton from "./certification-enroll-button";

const CertificationStickyHeader = ({ title, data }: any) => {
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const tabsElement = document.getElementById("certification-tabs");
      if (tabsElement) {
        const tabsPosition = tabsElement.getBoundingClientRect();
        setIsVisible(tabsPosition.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    scroller.scrollTo(sectionId, {
      duration: 1500,
      delay: 0,
      offset: -150, // Adjusted for sticky header height
    });
  };

  return (
    <div
      className={`fixed left-0 right-0 bg-white shadow-lg z-[3000] transition-transform duration-300 
        sm:top-0 bottom-0 sm:bottom-auto
        ${
          isVisible ? "translate-y-0" : "sm:-translate-y-full translate-y-full"
        }`}
    >
      <div className="app-container">
        {/* Title and Enroll Button Section */}
        <div className="flex md:flex-row flex-col items-center justify-between py-4 sm:border-b border-t sm:border-t-0 border-gray-200">
          <h1 className="md:text-xl text-md font-bold text-[#021614] truncate max-w-2xl hidden md:block">
            {title}
          </h1>
          <div className="ml-4 w-full md:w-auto">
            <CertificationEnrollButton initialCertification={data} />
          </div>
        </div>

        {/* Tabs Section - Hidden on mobile */}
        <div className="items-center overflow-x-auto hide-scrollbar space-x-5 py-2 hidden sm:flex">
          {navigation.map((navItem, ind) => (
            <button
              key={ind}
              onClick={() => {
                setActiveNav(navItem.name);
                scrollToSection(navItem.href);
              }}
              className={`text-[#475569] inline-block text-nowrap hover:bg-[#e7f4f3] rounded-t-lg font-semibold p-2 transition-all duration-300 ${
                activeNav === navItem.name &&
                "border-b-[3px] border-brand text-brand"
              }`}
            >
              {navItem.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationStickyHeader;
