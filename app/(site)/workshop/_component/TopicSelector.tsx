"use client";

import React from "react";

export const TopicSelector = () => {
  return (
    <div className="h-10 px-3 py-[7px] bg-white rounded-full justify-center items-center gap-1 inline-flex overflow-hidden">
      <div className="px-1 justify-center items-center gap-2 flex">
        <div className="text-center">
          <span className="text-slate-600 text-sm font-medium font-['Inter'] leading-[18px]">
            সাজান:{" "}
          </span>
          <span className="text-[#096961] text-sm font-semibold font-['Inter'] leading-[18px]">
            জনপ্রিয়
          </span>
        </div>
      </div>
      <div data-svg-wrapper>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.2797 5.96667L8.93306 10.3133C8.41973 10.8267 7.57973 10.8267 7.06639 10.3133L2.71973 5.96667"
            stroke="#475569"
            strokeWidth="1.5"
            stroke-miterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
