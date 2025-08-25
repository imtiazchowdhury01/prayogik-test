import Image from "next/image";
import React from "react";
const JoinWithUs = () => {
  const cardData = [
    {
      title: "শিক্ষার্থী হিসেবে",
      description: "কোর্স করে শিখুন । দক্ষ হয়ে ওঠুন । ক্যারিয়ার গড়ে তুলুন।",
      icon: "/icon/blue-certificate.svg",
      iconBg: "#F2F6FE",
    },
    {
      title: "শিক্ষক হিসেবে",
      description: "কোর্স তৈরি করুন। দক্ষতা শেয়ার করুন। নিয়মিত আয় করুন।",
      icon: "/icon/copper-avatar.svg",
      iconBg: "#FBF6F1",
    },
  ];
  return (
    <section className="bg-background-gray py-16 md:py-[100px]">
      <div className="app-container">
        <h4 className="mb-10 text-3xl font-bold text-center sm:text-4xl lg:text-5xl text-fontcolor-title">
          প্রায়োগিকের যাত্রায় আপনিও যুক্ত হতে পারেন
        </h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {cardData.map((card, ind) => {
            return (
              <div
                key={ind}
                className="flex flex-col items-center justify-center p-8 space-y-4 bg-white rounded-lg"
              >
                <div
                  style={{ backgroundColor: card.iconBg }}
                  className="inline-block p-4 rounded-xl"
                >
                  <Image
                    src={card.icon}
                    alt={"icon"}
                    width={0}
                    height={0}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
                <p className="text-2xl font-bold text-fontcolor-title">
                  {card.title}
                </p>
                <p className="text-base text-center text-gray-500">
                  {card.description.split("।").map((item, ind) => {
                    return (
                      <span key={ind} className="block">
                        {item}
                      </span>
                    );
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JoinWithUs;
