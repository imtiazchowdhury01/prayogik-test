"use client";
import { formatLiveCourseTime } from "@/lib/utils/formatLiveCourseTime";
import { usePathname } from "next/navigation";
import React from "react";

const LiveCourseTime = ({ CourseMode, course }: any) => {
  const pathname = usePathname();
  return (
    <div>
      {pathname === "/courses" ? null : (
        <>
          {course?.courseMode === CourseMode.LIVE ? (
            <>
              <p className="text-[#FF6709]  text-[14px] font-semibold">
                সময়: {formatLiveCourseTime(course?.courseLiveLinkScheduledAt)}
              </p>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default LiveCourseTime;
