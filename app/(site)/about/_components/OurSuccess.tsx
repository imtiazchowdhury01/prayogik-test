import Image from "next/image";
import React from "react";
const OurSuccess = () => {
  const successStats = [
    {
      title: "প্র্যাকটিকাল স্কিল",
      icon: "🎯",
      description: "থাকছে কেস স্টাডি ও বাস্তব উদাহরণ",
      color: "#0CAF60",
    },
    {
      title: "এক্সপার্ট মেন্টর",
      icon: "👨‍🏫",
      description: "শেখাচ্ছেন যারা নিজেরাও ফিল্ডে সক্রিয়",
      color: "#F9851A",
    },
    {
      title: "ছোট ছোট কোর্স",
      icon: "⚡",
      description: "কম সময়ে কার্যকরী স্কিল ডেভেলপমেন্ট",
      color: "#C649E2",
    },
    {
      title: "বার্ষিক সাবস্ক্রিপশন",
      icon: "💼 ",
      description: "১ বছরের জন্য সাশ্রয়ী মূল্যে সব কোর্স",
      color: "#52BDDA",
    },
  ];
  return (
    <section className="bg-white py-16 md:py-[100px]">
      <div className="flex flex-col items-center justify-between space-y-10 lg:space-x-10 lg:space-y-0 lg:flex-row xl:space-x-20 app-container">
        <div className="w-full max-w-xl lg:w-1/2">
          <div className="w-full h-[250px] sm:h-[300px] lg:h-auto">
            <Image
              src={"/about-success.png"}
              alt="success"
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-full rounded-lg"
              quality={75}
            />
          </div>
        </div>
        <div className="w-full max-w-xl lg:w-1/2">
          <h4 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.2] mb-5 sm:mb-8 lg:mb-10 font-bold lg:text-left text-center text-fontcolor-title">
            আপনার দক্ষতা গড়তে আমাদের বিশেষ উদ্যোগ
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {successStats.map((item, ind) => {
              return (
                <div
                  key={ind}
                  className="relative space-y-2 px-6 py-4 overflow-hidden rounded-lg"
                >
                  <div className="absolute  inset-0 bg-gradient-to-r pointer-events-none from-[#096961] to-[#096961]/40 opacity-[12%]"></div>
                  <div className="relative flex items-center justify-center rounded-full bg-white/60 p-2 w-10 h-10">
                    {item.icon}
                  </div>
                  <div>
                    <p
                      style={{ color: item.color }}
                      className="text-2xl font-bold"
                    >
                      {item.title}
                    </p>
                    <p className="text-base font-semibold text-fontcolor-description">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSuccess;
