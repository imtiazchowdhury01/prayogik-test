// CoursesSectionClient.tsx - Client Component
"use client";
import React, { useState } from "react";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { NoResultsMessage } from "../../_components/NoResultsMessage";

interface CoursesSectionClientProps {
  initialCourses: any[];
  categoryName: string;
  filterComponent: React.ReactNode;
  pageType: "category" | "filter";
  categorySlug: string;
  filter?: string;
}

const CoursesSectionClient = ({
  initialCourses,
  categoryName,
  filterComponent,
  pageType,
  categorySlug,
  filter,
}: CoursesSectionClientProps) => {
  const [courses, setCourses] = useState(initialCourses || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCourses?.length === 24);

  const loadMoreCourseHandler = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    try {
      // Build query parameters based on page type
      const params = new URLSearchParams({
        page: nextPage.toString(),
        type: pageType,
      });

      if (categorySlug) params.append('categorySlug', categorySlug);
      if (filter) params.append('filter', filter);

      const response = await fetch(`/api/courses/filter?${params}`);
      const data = await response.json();

      if (data.courses && data.courses.length > 0) {
        setCourses((prev: any[]) => [...prev, ...data.courses]);
        setCurrentPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more courses:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-3/4">
      {/* Title for small screen */}
      <div className="block mb-3 xm:mb-0 lg:hidden">
        <p className="text-black font-secondary font-semibold">
          {categoryName} কোর্সসমূহ
        </p>
      </div>

      <div className="flex items-center justify-between">
        {/* Title for large screen */}
        <div className="hidden lg:block">
          <p className="text-black font-semibold text-2xl">
            {categoryName ? categoryName : "সকল কোর্স"}
          </p>
        </div>

        {/* Select Filter option - moved to the right side */}
        {filterComponent}
      </div>

      {/* Courses Card */}
      {courses?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 mt-5">
            {courses?.map((course: any) => (
              <CourseCard
                key={course?.id}
                variant="light"
                course={course}
                instructor={course?.teacherProfile?.user?.name}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="flex items-center justify-center pt-5">
              <Button
                onClick={loadMoreCourseHandler}
                disabled={isLoading}
                className="py-3 text-gray-500 min-w-[106px] relative"
                variant={"outline"}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  "আরও দেখুন"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        // No courses found message in Bangla
        <NoResultsMessage />
      )}
    </div>
  );
};

export default CoursesSectionClient;