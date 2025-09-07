import { Radio } from "lucide-react";
import React from "react";

const LiveCourseIcon = ({ isCourseCard = true }) => {
  return (
    <div
      className={`${
        isCourseCard && "absolute top-4 left-4"
      } flex gap-1 items-center flex-row ${
        isCourseCard ? "bg-white border border-[#FFC4C2]" : "bg-[#FFE8E7]"
      } text-[#FF140C] text-xs font-bold px-2 py-1 rounded-md z-10 w-fit mt-6 lg:mt-0`}
    >
      <Radio className="w-4 h-4" />
      লাইভ কোর্স
    </div>
  );
};

export default LiveCourseIcon;
