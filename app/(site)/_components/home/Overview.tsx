import { overviewData } from "@/data";
import Image from "next/image";
import React from "react";

const Overview = () => {
  return (
    <section className="w-full bg-background-primary-dark  py-16 sm:py-[100px]">
      <div className="app-container">
        <div className="flex flex-col justify-between mb-10 text-center md:text-left md:space-x-4 md:flex-row">
          <h4 className="font-bold md:w-1/2 text-white w-full text-3xl sm:text-4xl md:text-[40px] leading-10 md:leading-[48px] mb-3 md:mb-0">
            প্রায়োগিকেই পাচ্ছেন যেসব সুবিধা!
          </h4>
        </div>
        {/* overview cards */}
        <div
          className="grid w-full grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
          data-testid="overview-cards-grid"
        >
          {overviewData.map((item) => {
            return (
              <div
                key={item.id}
                className="relative flex flex-col gap-6 items-start p-5 space-x-4 overflow-hidden rounded-lg "
                data-testid={`overview-card-${item.id}`}
              >
                <div className="absolute inset-0 bg-no-repeat opacity-[12%] pointer-events-none bg-gradient-to-r from-white/100 to-white/40"></div>
                <div className="bg-white/10 rounded-full p-3 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt="icon"
                    width={50}
                    height={50}
                    priority={false}
                    data-testid={`overview-image-${item.id}`}
                  />
                </div>
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: item.color }}
                    data-testid={`overview-title-${item.id}`}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-1 font-semibold text-white"
                    data-testid={`overview-description-${item.id}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Overview;
