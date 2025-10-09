"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
const CertificationCoursesList = ({ courses }: any) => {
  // Helper function to format duration
  const formatDuration = (durationInSeconds: number) => {
    if (durationInSeconds === 0) return "সময়কাল নির্ধারিত হয়নি";

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${convertNumberToBangla(hours)} ঘন্টা`);
    if (minutes > 0) parts.push(`${convertNumberToBangla(minutes)} মিনিট`);
    if (seconds > 0) parts.push(`${convertNumberToBangla(seconds)} সেকেন্ড`);

    return parts.join(" ") || "";
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {courses?.map((course: any, index: number) => (
          <AccordionItem
            key={course.id}
            value={`item-${index}`}
            className="border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline px-4 py-4 text-brand [&>svg]:text-brand">
              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between w-full pr-2">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={course.imageUrl || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-base font-semibold text-gray-900">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {course.totalDuration > 0 && (
                        <>
                          <span>{formatDuration(course.totalDuration)}</span>
                          <span>|</span>
                        </>
                      )}
                      {course._count?.lessons > 0 && (
                        <>
                          <span>
                            {convertNumberToBangla(course._count.lessons)} টি
                            লেসন
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="text-sm text-brand hover:text-brand hover:underline font-medium ml-20 sm:ml-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  কোর্সের বিস্তারিত
                </Link>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="mt-2 space-y-4">
                {/* Learning Outcomes */}
                {course.learningOutcomes &&
                  course.learningOutcomes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">কোর্স আউটকাম:</h4>
                      <ul className="list-none list-inside space-y-1">
                        {course.learningOutcomes.map(
                          (outcome: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex gap-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="flex-shrink-0 mt-0.5"
                              >
                                <path
                                  d="M14.6663 8.00004C14.6663 4.31814 11.6815 1.33337 7.99967 1.33337C4.31777 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31777 14.6667 7.99967 14.6667C11.6815 14.6667 14.6663 11.6819 14.6663 8.00004Z"
                                  stroke="#41504F"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M5.33301 8.33333L6.99967 10L10.6663 6"
                                  stroke="#41504F"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {outcome}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CertificationCoursesList;
