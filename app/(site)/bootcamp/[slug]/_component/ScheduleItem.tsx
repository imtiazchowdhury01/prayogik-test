// @ts-nocheck 
import React from "react";

interface ScheduleItemProps {
  time: string;
  description: string;
  className?: string;
}

export default function ScheduleItem({
  time,
  description,
  className = "",
  isFirst = false,
  isLast = false,
}: ScheduleItemProps) {
  return (
    <article
      className={`relative flex gap-2 items-stretch w-full ${className}`}
    >
      <div className="relative flex flex-col items-center">
        {/* {!isFirst && (
          <div className="absolute   left-1/2  w-0.5 h-2 bg-teal-600 -translate-x-1/2 " />
        )} */}
        <div className="relative z-10 mt-6 flex justify-center items-center w-4 h-4 bg-teal-600 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        {!isLast && (
          <div className="absolute top-5 left-1/2 w-0.5 bg-teal-600 -translate-x-1/2 h-[calc(100%)] mt-5" />
        )}
      </div>
      <div className="flex flex-col md:flex-row flex-1 gap-1 md:gap-2 pt-6">
        <time className="w-24 text-base font-semibold text-slate-900 shrink-0">
          {time}
        </time>
        <p className="flex-1 text-base text-slate-600">{description}</p>
      </div>
    </article>
  );
}