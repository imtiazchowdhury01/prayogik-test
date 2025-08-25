"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import CourseContent from "./content";
import CourseOverview from "./overview";


interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
}

interface Course {
  chapters: Chapter[];
  attachments?: any[];
  purchases?: any[];
}

const tabItem = [
  {
    label: "তথ্য",
  },
  {
    label: "লেসন",
  },
];

export default function CourseDetails({ course }: { course: Course }) {
  const [current, setCurrent] = React.useState<string>("তথ্য");
  return (
    <div className="flex-1">
      {/* Tab Header */}
      <div className="flex border-b space-x-4 top-5 text-gray-950">
        {tabItem.map((item, index) => (
          <Button
            variant="transparent"
            onClick={() => setCurrent(item.label)}
            key={index}
            className={`pb-1 h-fit text-base font-semibold cursor-pointer pb-[8px],
             ${
               current === item.label &&
               "border-b-[3px] pb-[5px] rounded-none border-gray-700"
             }
            `}
          >
            {item?.label}
          </Button>
        ))}
      </div>
      {/* Tab Body */}
      <div>
        {current === "তথ্য" && <CourseOverview course={course} />}
        {current === "লেসন" && <CourseContent course={course} />}
      </div>
    </div>
  );
}
