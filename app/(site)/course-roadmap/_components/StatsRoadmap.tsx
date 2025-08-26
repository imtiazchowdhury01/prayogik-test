import { CourseRoadmap } from "@prisma/client";
import React from "react";

// convert count into bangla
const toBanglaNumber = (num: number | string) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => banglaDigits[+d] ?? d)
    .join("");
};

const StatsRoadmap = ({
  roadmaps,
  plannedRoadmaps,
  inProgressRoadmaps,
  completedRoadmaps,
}: {
  roadmaps: CourseRoadmap[];
  plannedRoadmaps: CourseRoadmap[];
  inProgressRoadmaps: CourseRoadmap[];
  completedRoadmaps: CourseRoadmap[];
}) => (
  <section className="rounded-md h-auto bg-white px-4 py-3">
    <div className="grid grid-cols-2 md:grid-cols-4 text-center">
      {[
        { label: "টোটাল রোডম্যাপ", count: roadmaps.length },
        { label: "সম্পন্ন", count: completedRoadmaps.length },
        { label: "চলমান", count: inProgressRoadmaps.length },
        { label: "পরিকল্পিত", count: plannedRoadmaps.length },
      ].map(({ label, count }) => (
        <div key={label}>
          <div className="text-xl font-normal mb-2">
            {toBanglaNumber(count)}
          </div>
          <div className="text-xl font-normal">{label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsRoadmap;
