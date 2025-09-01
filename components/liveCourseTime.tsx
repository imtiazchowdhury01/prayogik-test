"use client";

import { formatLiveCourseDate } from "@/lib/utils/formatLiveCourseTime";
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
              <p className="text-[#FF6709]  text-[14px] font-semibold">
                সময়: {formatLiveCourseDate(course?.courseLiveBatchStartedAt)}
              </p>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default LiveCourseTime;
