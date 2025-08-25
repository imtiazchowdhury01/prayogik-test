// @ts-nocheck
"use client";
import { Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import StudentSidebarLessons from "./student-sidebar-lessons";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { useEffect, useRef } from "react";


export default function StudentSidebar({
  lesson,
  videoUrl,
  courseSlug,
  currentLessonSlug,
}) {
  const { lessonSlug } = useParams();
  const scrollContainerRef = useRef(null);
  const totalLessons = lesson.length || 0;
  const completedLessons =
    lesson.filter((l) => {
      return l.Progress.some((progress) => progress.isCompleted);
    }).length || 0;
  const completionStatus = `${convertNumberToBangla(
    completedLessons ?? 0
  )}/${convertNumberToBangla(totalLessons ?? 0)}`;
  const progressPercentage = (completedLessons / totalLessons) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  useEffect(() => {
    if (!lessonSlug || !scrollContainerRef.current) {
      return;
    }

    const container = scrollContainerRef.current;

    const scrollToActiveLesson = () => {
      const activeElement = container.querySelector(
        `[data-lesson-slug="${lessonSlug}"]`
      );

      if (activeElement) {
        const elementTop = activeElement.offsetTop;
        const containerHeight = container.clientHeight;
        const elementHeight = activeElement.clientHeight;

        const targetScrollTop =
          elementTop - containerHeight / 2 + elementHeight / 2;
        const clampedScrollTop = Math.max(
          0,
          Math.min(targetScrollTop, container.scrollHeight - containerHeight)
        );

        container.scrollTo({
          top: clampedScrollTop,
          behavior: "smooth",
        });
      } else {
        // Retry after a short delay if element not found
        setTimeout(scrollToActiveLesson, 100);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(scrollToActiveLesson, 50);
  }, [lessonSlug]);

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className=" text-2xl font-bold">কোর্স কনটেন্ট</h1>
        {/* icons */}
        <div className="flex items-center justify-center gap-3">
          <Trophy
            size={24}
            className={`text-brand-light ${
              progressPercentage === 100 ? "fill-brand" : ""
            }`}
          />
          {/* Dynamic Progress Circle */}
          <div className="relative flex items-center justify-center">
            <svg
              className="w-14 h-14 transform -rotate-90"
              viewBox="0 0 50 50"
              aria-label={`Progress: ${completedLessons} of ${totalLessons} steps completed`}
            >
              {/* Background circle */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="#C2E4E1"
                strokeWidth="5"
              />
              {/* Dynamic progress circle */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="#0D9488"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
            {/* Dynamic step counter text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-foreground">
                {completionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="relative overflow-y-auto scrollbar-subtle h-[63vh] pr-2"
      >
        {/* show lessons */}
        {lesson.map((item, index) => (
          <StudentSidebarLessons
            key={item.id}
            value={item?.id}
            item={item}
            lessonSlug={lessonSlug}
            index={index}
            courseSlug={courseSlug}
            videoUrl={videoUrl}
            isActive={lesson.slug === currentLessonSlug}
            isLast={index === lesson.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
