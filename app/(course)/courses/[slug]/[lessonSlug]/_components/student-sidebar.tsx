// @ts-nocheck
"use client";

import Link from "next/link";
import { Trophy, FileTextIcon, PlayCircleIcon } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { formatDurationToBanglaHMS } from "@/lib/convertNumberToBangla";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useTab } from "@/hooks/use-tab";

// Helper function to convert numbers to Bangla
const convertNumberToBangla = (num: number) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
};

interface StudentSidebarProps {
  courseSlug: string;
  lesson: any[];
  currentLessonSlug: string;
}

const StudentSidebar = ({
  courseSlug,
  lesson,
  currentLessonSlug,
}: StudentSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const previousLessonRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveTab } = useTab();

  // Unique key for this course's scroll position
  const SCROLL_STORAGE_KEY = `sidebar-scroll-${courseSlug}`;

  // Save scroll position to memory (since sessionStorage is not available)
  const scrollPositionRef = useRef<number>(0);

  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  }, []);

  // Restore scroll position from memory
  const restoreScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollPositionRef.current;
      if (scrollTop > 0) {
        scrollContainerRef.current.scrollTop = scrollTop;
        return true;
      }
    }
    return false;
  }, []);

  // Auto-scroll to active lesson
  const scrollToActiveLesson = useCallback(() => {
    if (scrollContainerRef.current && currentLessonSlug) {
      const activeElement = scrollContainerRef.current.querySelector(
        `[data-lesson-slug="${currentLessonSlug}"]`
      );

      if (activeElement) {
        const container = scrollContainerRef.current;
        const elementTop = (activeElement as HTMLElement).offsetTop;
        const elementHeight = (activeElement as HTMLElement).offsetHeight;
        const containerHeight = container.clientHeight;

        // Calculate scroll position to center the active element
        const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;

        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: "instant",
        });
      }
    }
  }, [currentLessonSlug]);

  // Initialize scroll position on mount
  useEffect(() => {
    if (!isInitialized) {
      const timer = setTimeout(() => {
        const restored = restoreScrollPosition();

        // If no saved position, scroll to active lesson
        if (!restored) {
          scrollToActiveLesson();
        }

        setIsInitialized(true);
      }, 100);

      const totalLessons = lesson?.length || 0;
      const completedLessons =
        lesson?.filter((l) => {
          return l.Progress?.some((progress: any) => progress.isCompleted);
        }).length || 0;

      const completionStatus = `${convertNumberToBangla(
        completedLessons ?? 0
      )}/${convertNumberToBangla(totalLessons ?? 0)}`;
      const progressPercentage =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      // Circle progress calculations
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset =
        circumference - (progressPercentage / 100) * circumference;

      return () => clearTimeout(timer);
    }
  }, [isInitialized, restoreScrollPosition, scrollToActiveLesson]);

  // Handle lesson changes - preserve scroll position
  useEffect(() => {
    if (isInitialized && previousLessonRef.current !== currentLessonSlug) {
      if (previousLessonRef.current) {
        // Restore the saved scroll position when lesson changes
        setTimeout(() => {
          restoreScrollPosition();
        }, 50);
      }

      previousLessonRef.current = currentLessonSlug;
    }
  }, [currentLessonSlug, isInitialized, restoreScrollPosition]);

  // Save scroll position on scroll and unload
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 100);
    };

    container.addEventListener("scroll", throttledScroll);

    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      container.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(scrollTimeout);
      saveScrollPosition();
    };
  }, [saveScrollPosition]);

  const totalLessons = lesson?.length || 0;
  const completedLessons =
    lesson?.filter((l) => {
      return l.Progress?.some((progress: any) => progress.isCompleted);
    }).length || 0;

  const completionStatus = `${convertNumberToBangla(
    completedLessons ?? 0
  )}/${convertNumberToBangla(totalLessons ?? 0)}`;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Circle progress calculations
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  // Individual lesson component
  const StudentSidebarLessons = ({ item, index, isLast, setActiveTab }) => {
    const currentPath = `/courses/${courseSlug}/${item?.slug}`;
    const isSlugMatched = item.slug === currentLessonSlug;
    const isLessonCompleted = item?.Progress?.[0]?.isCompleted;

    const handlePlayClick = () => {
      // const element = document.getElementById("instructor-name");
      // element?.scrollIntoView({ behavior: "instant" });
      setActiveTab("content");
      if (pathname !== currentPath) {
        router.push(`/courses/${courseSlug}/${item?.slug}`);
      }
    };

    if (!item?.isPublished) {
      return null;
    }

    return (
      <div className="mb-3" data-lesson-slug={item.slug}>
        <div
          className={`cursor-pointer py-3 px-4 transition-all rounded ${
            isSlugMatched ? "bg-brand text-white " : "bg-brand-accent"
          } ${
            isLessonCompleted && "text-brand"
          } flex items-start justify-between`}
          onClick={handlePlayClick}
        >
          <div className="flex items-start gap-2">
            {/* show icon conditionaly */}
            {item.videoUrl !== null ? (
              <PlayCircleIcon
                className={`w-5 h-5 min-w-[20px] ${
                  isSlugMatched ? "text-white " : "text-black"
                } ${isLessonCompleted && "text-brand"}`}
              />
            ) : (
              <FileTextIcon
                className={`w-5 h-5 min-w-[20px]  ${
                  isSlugMatched ? "text-white " : "text-black"
                } ${isLessonCompleted && "text-brand"}`}
              />
            )}
            {/* lesson title */}
            <div className={`text-sm flex  gap-2`}>
              <p
                className="text-sm capitalize"
                dangerouslySetInnerHTML={{
                  __html: item?.title || "Lesson Video",
                }}
              />
            </div>
          </div>
          {/* show duration */}
          <p
            className={cn(
              "text-sm text-[#484848]",
              isSlugMatched && "text-white",
              isLessonCompleted && !isSlugMatched && "text-brand"
            )}
          >
            {item.videoUrl !== null && item?.duration ? (
              <>
                {formatDurationToBanglaHMS(item?.duration)}
                {/* Show "ঘণ্টা" if duration has hours (HH:MM:SS), else "মিনিট" */}
                <span className="text-sm pl-0.5">
                  {formatDurationToBanglaHMS(item?.duration).split(":")
                    .length === 3
                    ? "ঘণ্টা"
                    : "মিনিট"}
                </span>
              </>
            ) : null}
            {!lesson.duration && lesson.videoUrl === null && (
              <FileText className="w-5 h-5 text-gray-600" />
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-5">
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">কোর্স কনটেন্ট</h1>

        {/* Progress Icons */}
        <div className="flex items-center justify-center gap-3">
          <Trophy
            size={24}
            className={`text-brand ${
              progressPercentage === 100 ? "fill-teal-600" : ""
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
              <span className="text-xs font-medium text-gray-700">
                {completionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-y-auto h-[63vh] pr-2 scrollbar-subtle"
      >
        <div className="space-y-2">
          {lesson?.map((lessonItem: any, index: number) => (
            <StudentSidebarLessons
              key={lessonItem.id}
              item={lessonItem}
              lessonSlug={currentLessonSlug}
              courseSlug={courseSlug}
              index={index}
              videoUrl={lessonItem.videoUrl}
              isLast={index === lesson.length - 1}
              isActive={currentLessonSlug === lessonItem.slug}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
