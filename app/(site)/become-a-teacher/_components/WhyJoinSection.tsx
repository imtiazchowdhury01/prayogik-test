import React from "react";
import IconContainer from "./IconContainer";
import Course from "./icon/Course";
import Idea from "./icon/Idea";
import User from "./icon/User";
import Award from "./icon/Award";

const WhyJoinSection = () => {
  const data = [
    {
      title: "ক্যারিয়ার তৈরিতে অবদান",
      description:
        "আপনার নলেজ ও দক্ষতা অনেককে ভালো ভাবে ক্যারিয়ার তৈরিতে সাহায্য করবে",
      icon: <Course />,
      color: "#8ABD77",
      cardBg: "#EEF8E9",
    },
    {
      title: "স্কিল গ্যাপ পুরনে অবদান",
      description:
        "আপনার এগিয়ে আসা, জ্ঞান শেয়ার করা ও গাইডেন্স প্রদান- দেশে দক্ষ প্রফেশনালের যে ঘাটতি রয়েছে, তা পূরণে বাস্তবিক ভূমিকা রাখবে। ",
      icon: <Idea />,
      color: "#77BD7F",
      cardBg: "#E9F8F2",
    },
    {
      title: "পার্সোনাল ব্রান্ড",
      description:
        "এক্সপার্ট হিসাবে আপনার সুনাম ও খ্যাতি আরো ছড়িয়ে পড়বে ।দেশ-বিদেশে থাকা বাংলা ভাষাভাষী শিক্ষার্থীদের সাথে তৈরি হবে যোগাযোগ ও সম্পর্ক। ",
      icon: <User />,
      color: "#BDAA77",
      cardBg: "#F8F3E9",
    },
    {
      title: "আর্থিক রিওয়ার্ড",
      description:
        "জবের পাশাপাশি বাড়তি আয়ের একটি সুযোগ। কোর্স, লাইভ ক্লাস, মেন্টরশিপ কিংবা স্পিকার ফি- আপনার সময় ও জ্ঞানের জন্য পাবেন ন্যায্য সম্মানী।",
      icon: <Award />,
      color: "#77BDBD",
      cardBg: "#E9F7F8",
    },
  ];

  return (
    <section className="w-full pt-12 md:pt-16 lg:pt-24 xl:pt-32">
      <div className="app-container">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="course-proposal-heading">
            কেন যুক্ত হবেন আমাদের সাথে?
          </h2>
          <p className="course-proposal-description max-w-3xl">
            সহজ তিন ধাপে কোর্স প্রস্তাব পাঠিয়ে শুরু করুন শেখানো, আয় করুন এবং
            শিক্ষার্থীদের জীবনে রাখুন প্রভাব।
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col px-4 sm:px-6 py-5 sm:py-6 md:py-[28px] rounded-lg"
              style={{ backgroundColor: item.cardBg }}
            >
              <IconContainer color={item.color}>{item.icon}</IconContainer>
              <h3 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl font-semibold text-card-black-text leading-snug">
                {item.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-fontcolor-subtitle leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;