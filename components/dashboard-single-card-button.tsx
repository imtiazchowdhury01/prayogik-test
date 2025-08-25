// @ts-nocheck

"use client";

import Link from "next/link";
import { CourseProgress } from "./course-progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export const DashboardSingleCardButton = ({
  isAuthenticated,
  progress,
  nextLessonSlug,
  slug,
  lessons,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigation = () => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 5000);
  };

  return (
    <div className="p-4 mt-auto">
      {isAuthenticated && progress !== null ? (
        <div>
          <div className="mb-4">
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          </div>

          {nextLessonSlug ? (
            <Link href={`/courses/${slug}/${nextLessonSlug}`}>
              <Button
                className="w-full h-12 text-lg bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-600"
                onClick={handleNavigation}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  "চালিয়ে যান"
                )}
              </Button>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}/${lessons[0]?.slug}`}
              className="mt-4"
              prefetch
            >
              <Button
                className="w-full h-12 text-lg bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80"
                onClick={handleNavigation}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  "চালিয়ে যান"
                )}
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center text-gray-500 mb-4"></div>
          <Link href={`/courses/${slug}`} prefetch>
            <Button
              type="button"
              className="w-full h-12 bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80"
              onClick={handleNavigation}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                <span className="ml-2 text-lg">বিস্তারিত দেখুন</span>
              )}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
