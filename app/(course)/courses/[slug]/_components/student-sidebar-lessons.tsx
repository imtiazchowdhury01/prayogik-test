// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { FileTextIcon, PlayCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLessonContext } from "@/lib/utils/LessonContext";
import { formatDurationToBanglaHMS } from "@/lib/convertNumberToBangla";
import { cn } from "@/lib/utils";

const StudentSidebarLessons = ({
  item,
  lessonSlug,
  courseSlug,
  index,
  videoUrl,
  isLast,
  isActive,
}) => {
  const { setLoading } = useLessonContext();
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = `/courses/${courseSlug}/${item?.slug}`;
  const isSlugMatched = item.slug === lessonSlug;
  const isLessonCompleted = item?.Progress[0]?.isCompleted;
  const handlePlayClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (pathname !== currentPath) {
      setLoading(true);
      router.push(`/courses/${courseSlug}/${item?.slug}`);
    }
  };

  if (!item?.isPublished) {
    return;
  }

  return (
    <div className="mb-3" data-lesson-slug={item.slug}>
      <div
        className={`cursor-pointer py-3 px-4 transition-all rounded-md ${
          isSlugMatched ? "bg-brand text-white " : "bg-brand-accent"
        } ${
          isLessonCompleted && "text-brand"
        } flex items-start justify-between`}
        onClick={handlePlayClick}
      >
        <div className="flex items-start gap-2">
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
          <div className={`text-sm flex  gap-2`}>
            <p
              className="text-sm capitalize"
              dangerouslySetInnerHTML={{
                __html: item?.title || "Lesson Video",
              }}
            />
          </div>
        </div>
        <p
          className={cn(
            "text-sm text-[#484848]",
            isSlugMatched && "text-white",
            isLessonCompleted && !isSlugMatched && "text-brand"
          )}
        >
          {item.videoUrl !== null && item?.duration
            ? formatDurationToBanglaHMS(item?.duration)
            : null}
        </p>
      </div>
    </div>
  );
};

export default StudentSidebarLessons;
