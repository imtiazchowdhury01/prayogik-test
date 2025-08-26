// @ts-nocheck
"use client";

import Link from "next/link";
import { CourseProgress } from "./course-progress";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export const SingleCardButton = ({
  courseId,
  progress,
  nextLessonSlug,
  slug,
  lessons,
  variant,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  return (
    <div className="">
      {progress !== null && pathname !== "/prayogik-home" ? (
        <div className="flex flex-col gap-2">
          {pathname !== "/prayogik-home" && (
            <div className="">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
                cardVariant={variant}
              />
            </div>
          )}

          {nextLessonSlug ? (
            <Link href={`/courses/${slug}/${nextLessonSlug}`}>
              <div
                className="block w-full px-4 py-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-md hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "চালিয়ে যান"
                )}
              </div>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}/${nextLessonSlug}`}
              className="mt-4"
              // prefetch
            >
              <div className="block w-full px-4 py-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-md hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand">
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "চালিয়ে যান"
                )}
              </div>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <Link
            href={`/courses/${slug}`}
            className="block w-full px-4 py-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-sm hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand"
            prefetch={true}
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <span className="ml-2">কোর্সটি দেখুন</span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
};
