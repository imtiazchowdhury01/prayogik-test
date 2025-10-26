import React from "react";
import OfferVideoSection from "./OfferVideoSection";
import Image from "next/image";
import TrialCheckoutButton from "@/components/trial-checkout-button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

const OfferHero = ({
  trialPlan,
  trialPlanDuration,
  courseLimit,
}: {
  trialPlan: any;
  trialPlanDuration: any;
  courseLimit: any;
}) => {
  const dataSrc = {
    videoSrc: "",
    imageSrc: "/images/prime/video-frame-bg.webp",
  };
  return (
    <div className="bg-brand relative">
      {/* background block image shape */}
      <Image
        src="/Launching-offer-BG.svg"
        alt="Prayogik Hero background"
        fill
        priority
        quality={75}
        className="object-cover z-0 md:block hidden"
        sizes="100vw"
      />
      {/* hero details section */}
      <div className="app-container relative flex justify-center flex-col items-center pt-14 md:pt-20">
        {/* <div className="bg-[#10B1A2] gap-1 px-3.5 py-1.5 w-fit mx-auto md:inline-block rounded-lg text-lime-200 font-light text-xl">
          <div className="flex items-center gap-1.5">
            <PriceIcon />
            <p className="font-normal">প্রাইমের অফার দেখুন</p>
          </div>
        </div> */}
        <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white md:text-start text-center py-4 md:pt-8 md:pb-6">
          প্রায়োগিক প্রাইম
        </h1>
        <p className="text-md text-center md:text-[20px] text-gray-100 font-normal md:font-light max-w-full md:max-w-2xl leading-7">
          ডিজিটাল মার্কেটিংয়ে সাফল্যের জন্য প্রয়োজনীয় স্কিলগুলো শিখুন এক
          সাবস্ক্রিপশনে। দুই-একটা কোর্স নয়, দক্ষ ও অভিজ্ঞ প্রফেশনালদের তৈরি
          প্রায়োগিক প্রাইমের অধীনে সব গুলো কোর্সে এক্সেস নিন। গড়ে তুলুন সফল ও
          শক্ত ভিত্তির ক্যারিয়ার।
        </p>

        <TrialCheckoutButton
          trialPlan={trialPlan}
          size={"lg"}
          variant={"primary"}
          className="bg-white hover:bg-gray-50 text-brand block rounded-md transition-all duration-300 shadow-sm  text-base font-bold mt-12 px-4"
          subTextNode={
            <p className="text-sm mt-2 text-white font-light">
              *{convertNumberToBangla(trialPlanDuration)} জন্য যে কোনো{" "}
              {convertNumberToBangla(courseLimit)}টি কোর্স
            </p>
          }
        >
          <span>
            {trialPlan?.name} এক্সেস - মাত্র{" "}
            {convertNumberToBangla(trialPlan?.regularPrice)} টাকা
          </span>
        </TrialCheckoutButton>
      </div>

      {/* hero video section */}
      <div className="pt-8 pb-14 md:pt-14 md:pb-[60px]">
        <OfferVideoSection dataSrc={dataSrc} customOpacity={0.25} />
      </div>
    </div>
  );
};

export default OfferHero;
