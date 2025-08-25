import React from "react";
import IconContainer from "./IconContainer";
import Course from "./icon/Course";


const CourseTypesSection = () => {
  const types = [
    {
      id: 1,
      title: "কোর্স",
      duration: "৩০ মিনিটের কম",
      cardBg: "#E9F8F2",
      color: "#77BD7F",
      description:
        "আপনার শেখার লক্ষ্য অনুযায়ী সাজানো কোর্স, বাস্তব উদাহরণসহ সহজ ভাষায় উপস্থাপিত। যেকোনো সময়, যেকোনো জায়গা থেকে শেখা যাবে নিজের গতিতে। দক্ষতা গড়ার সহজ, কার্যকর ও নির্ভরযোগ্য পথ এখন এক প্ল্যাটফর্মেই।",
    },
    {
      id: 2,
      title: "লাইভ কোর্স",
      duration: "৩০-৬০ মিনিট",
      cardBg: "#EEF8E9",
      color: "#8ABD77",
      description:
        "সরাসরি প্রশিক্ষকের সঙ্গে ইন্টারঅ্যাক্ট করুন, প্রশ্ন করুন, শিখুন রিয়েল টাইমে। লাইভ কোর্সে পাবেন গাইডেন্স, প্র্যাকটিক্যাল টাস্ক আর শেখার স্পেস—যা আপনাকে স্কিল গড়তে সহায়তা করবে দ্রুত, গঠনমূলকভাবে ও আত্মবিশ্বাসের সঙ্গে।",
    },
    {
      id: 3,
      title: "ওয়ার্কশপ",
      duration: "১ ঘণ্টার কাছাকাছি",
      cardBg: "#E9F7F8",
      color: "#77B8BD",
      description:
        "কাজের দুনিয়ায় ব্যবহৃত স্কিল শেখার জন্য হাতে-কলমে ওয়ার্কশপ, অভিজ্ঞ মেন্টরদের সরাসরি গাইড, রিয়েল টাইমে প্রশ্নোত্তর এবং প্র্যাকটিক্যাল প্রজেক্ট—সব একসাথে, এক জায়গায়, একটাই লক্ষ্য—আপনাকে বাস্তব দক্ষতায় তৈরি করা।",
    },
  ];
  return (
    <section className="w-full pb-12 md:pb-16 lg:pb-24 xl:pb-32">
      <div className="app-container">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 lg:mb-10">
          <h2 className="course-proposal-heading">কেমন কোর্স চাই?</h2>
          <p className="course-proposal-description max-w-[450px]">
            আমরা সংক্ষিপ্ত, ফোকাসড এবং অ্যাকশনেবল মাইক্রো, মিনি ও শর্ট কোর্স
            খুঁজছি, যা শিক্ষার্থীদের নির্দিষ্ট দক্ষতা বা সমস্যার সমাধান শেখাবে।{" "}
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((types) => (
            <div
              key={types.id}
              className={`border-0 rounded-md`}
              style={{ backgroundColor: types.cardBg }}
            >
              <div className="p-6">
                {/* Header with icon and title */}
                <div className="flex items-start gap-3 mb-7">
                  <IconContainer color={types.color!}>
                    <Course />
                  </IconContainer>
                  <div>
                    <h3 className="font-semibold text-xl text-card-black-text">
                      {types.title}
                    </h3>
                    <p className="text-sm text-fontcolor-subtitle">
                      সময়সীমা: {types.duration}
                    </p>
                  </div>
                </div>

                {/* Description section */}
                <div>
                  <p className="text-sm text-fontcolor-subtitle leading-relaxed">
                    {types.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTypesSection;
