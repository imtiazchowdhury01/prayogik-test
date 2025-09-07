"use client";

import { formatLiveCourseDate } from "@/lib/utils/formatLiveCourseTime";
import { CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const LiveCourseTime = ({ CourseMode, course }: any) => {
  const pathname = usePathname();
  // console.log("courses result:", course);
  return (
    <div>
      {pathname === "/courses" ? null : (
        <>
          {course?.courseMode === CourseMode.LIVE ? (
            <>
              <p className="text-[#FF6709]  text-[14px] font-semibold flex items-center gap-1.5">
                <CalendarDays
                  size={14}
                  strokeWidth={2}
                  className="inline-block"
                />
                <span className="mt-1.5">
                  সময়: {formatLiveCourseDate(course?.courseLiveBatchStartedAt)}
                </span>
              </p>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default LiveCourseTime;
