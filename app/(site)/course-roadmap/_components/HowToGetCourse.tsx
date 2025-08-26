import Course from "../../become-a-teacher/_components/icon/Course";
import IconContainer from "../../become-a-teacher/_components/IconContainer";
import List from "../../become-a-teacher/_components/icon/List";
import Aggrement from "../../become-a-teacher/_components/icon/Aggrement";
import Link from "next/link";
import { link } from "fs";

const HowToGetCourse = () => {
  const data = [
    {
      title: "নির্দিস্ট কোর্স",
      description:
        "আপনার প্রয়োজনীয় যে কোন কোর্স আপনি একক ভাবে  এনরোল  করতে পারবেন।      ",
      icon: <Course />,
      color: "#8ABD77",
      cardBg: "#EEF8E9",
      link: "/courses",
    },
    {
      title: "প্রাইম মেম্বার",
      description:
        "প্রাইমের অধিনে সব গুলো কোর্স ফ্রিতে একসেস। রেগুলার কোর্সে ৫০-৭০% ডিসকাউণ্ট ফিতে এনরোল করতে পারা যাবে।",
      icon: <List />,
      color: "#BDAA77",
      cardBg: "#F8F3E9",
      link: "/prime",
    },
    {
      title: "লাইভ ট্রেনিং",
      description:
        "প্রায়োগিক নিয়মিত লাইভ অনলাইন ও অফলাইন ট্রেনিং আয়োজন করে। আপনি চাইলে সেই লাইভ ট্রেনিংগুলোতেও অংশ নিতে পারবেন।",

      icon: <Aggrement />,
      color: "#77BDBD",
      cardBg: "#E9F7F8",
      link: "#",
    },
  ];

  return (
    <section className="w-full pb-12 md:pt-12 md:pb-16 lg:pb-24 xl:pb-32">
      <div className="">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="course-proposal-heading">
            কিভাবে প্রায়োগিকের কোর্স করা যাবে?
          </h2>
          <p className="course-proposal-description max-w-3xl">
            প্রায়োগিকের কোর্সগুলো কয়েক ভাবে করা যাবে
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
              <Link
                href={item.link}
                className="group flex items-center gap-1 mt-6 text-base font-semibold text-foreground hover:text-brand transition-colors duration-300"
              >
                <span>কোর্স গুলো দেখুন</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-colors duration-300 group-hover:stroke-brand"
                >
                  <path
                    d="M9.62012 3.95337L13.6668 8.00004L9.62012 12.0467"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.33301 8H13.553"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToGetCourse;
