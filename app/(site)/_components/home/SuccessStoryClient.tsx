//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import SuccessStorySlider from "./SuccessStorySlider";

const SuccessStoryClient = ({ testimonials }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <>
      {/* section tile and navigations */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-left text-2xl sm:text-4xl md:text-[40px]">
            স্টুডেন্টদের সাফল্যের কথা
          </h4>
          <p className="mt-2 md:mt-4 md:my-4 text-[14px] sm:text-base text-fontcolor-subtitle text-left">
            সাধারণ থেকে অসাধারণ হয়ে ওঠার এক অভিনব সফলতার গল্প।
          </p>
        </div>
        {/* Navigation Buttons */}
        <div className="flex gap-2 z-10">
          <Button
            variant="default"
            size="icon"
            disabled={isBeginning}
            className={`sm:h-11 sm:w-11 w-8 h-8 bg-zinc-200 rounded border-0 hover:bg-zinc-300 transition-all duration-300 ${
              isBeginning ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.9751 4.94189L2.91676 10.0002L7.9751 15.0586"
                stroke="#010F0E"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.0833 10H3.05825"
                stroke="#010F0E"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button
            variant="default"
            size="icon"
            disabled={isEnd}
            className={`sm:h-11 sm:w-11 w-8 h-8 border-0 rounded bg-zinc-300 hover:bg-zinc-300 transition-all duration-300 ${
              isEnd ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.0249 15.0581L17.0832 9.99977L12.0249 4.94144"
                stroke="#010F0E"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.91675 10H16.9417"
                stroke="#010F0E"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Testimonials Slider */}
      <SuccessStorySlider
        testimonials={testimonials}
        swiperRef={swiperRef}
        setIsBeginning={setIsBeginning}
        setIsEnd={setIsEnd}
      />
    </>
  );
};

export default SuccessStoryClient;
