//@ts-nocheck
"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Lock,
  Trophy,
  PlayCircleIcon,
  FileTextIcon,
  FileText,
} from "lucide-react";
import {
  convertNumberToBangla,
  formatDurationToBanglaHMS,
} from "@/lib/convertNumberToBangla";
import { useCallback, useEffect, useRef, useState } from "react";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  videoUrl: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  duration?: number;
  Progress?: any;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLesson: Lesson;
  onLessonClick: (lesson: Lesson) => void;
  courseProgress?: number;
  currentLessonSlug?: string;
  courseSlug?: string;
  activeTab?: any;
  setActiveTab?: any;
}

export const LessonSidebar = ({
  lessons,
  currentLesson,
  onLessonClick,
  currentLessonSlug,
  courseSlug,
  activeTab,
  setActiveTab,
}: LessonSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const previousLessonRef = useRef<string | null | undefined>(null);

  // Unique key for this course's scroll position
  const SCROLL_STORAGE_KEY = `sidebar-scroll-${courseSlug}`;

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

      const totalLessons = lessons?.length || 0;
      const completedLessons =
        lessons?.filter((l) => {
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

  const totalLessons = lessons?.length || 0;
  const completedLessons =
    lessons?.filter((l) => {
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

  return (
    <div className="px-4 py-5 rounded-md bg-white space-y-3">
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

          <div className="relative flex items-center justify-center">
            <svg
              className="w-14 h-14 transform -rotate-90"
              viewBox="0 0 50 50"
              aria-label={`Progress: ${completedLessons} of ${totalLessons} steps completed`}
            >
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="#C2E4E1"
                strokeWidth="5"
              />
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

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {completionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Lessons List */}
      <ul
        ref={scrollContainerRef}
        className="space-y-1.5 relative overflow-y-auto h-[63vh] pr-2 scrollbar-subtle"
      >
        {lessons?.map((lesson) => {
          const isSlugMatched = lesson.slug === currentLesson?.slug;
          const isLessonCompleted = lesson?.Progress?.[0]?.isCompleted;

          return (
            <li
              key={lesson.id}
              className={`cursor-pointer py-3 px-4 transition-all ease-linear rounded ${
                isSlugMatched ? "bg-brand text-white " : "bg-brand-accent"
              } ${
                isLessonCompleted && "text-brand"
              } flex items-start justify-between`}
              onClick={() => onLessonClick(lesson)}
              data-lesson-slug={lesson.slug}
            >
              <div className="flex items-start gap-2">
                {/* show icon conditionaly */}
                {lesson.videoUrl !== null ? (
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
                      __html: lesson?.title || "Lesson Video",
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
                {lesson.videoUrl !== null && lesson?.duration ? (
                  <>
                    {formatDurationToBanglaHMS(lesson?.duration)}
                    {/* Show "ঘণ্টা" if duration has hours (HH:MM:SS), else "মিনিট" */}
                    <span className="text-sm pl-0.5">
                      {formatDurationToBanglaHMS(lesson?.duration).split(":")
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};
