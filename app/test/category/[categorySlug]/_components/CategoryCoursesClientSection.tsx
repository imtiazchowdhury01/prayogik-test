// CategoryCoursesClientSection.tsx - Client Component (load more functionality)
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import CoursesGrid from "@/app/test/_components/CoursesGrid";

interface CategoryCoursesClientSectionProps {
  categorySlug: string;
  pageType: "category" | "filter" | "category-filter";
  initialPage: number;
  hasMore: boolean;
}

const CategoryCoursesClientSection = ({
  categorySlug,
  pageType,
  initialPage,
  hasMore: initialHasMore,
}: CategoryCoursesClientSectionProps) => {
  const [additionalCourses, setAdditionalCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

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

      if (pageType === "category" || pageType === "category-filter") {
        params.append("categorySlug", categorySlug);
      } else {
        params.append("filter", categorySlug);
      }

      const response = await fetch(`/api/courses/filter?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      if (data.courses && data.courses.length > 0) {
        setAdditionalCourses((prev) => [...prev, ...data.courses]);
        setCurrentPage(nextPage);
        setHasMore(data.hasMore || data.courses.length === 24);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more courses:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Additional courses loaded via client-side */}
      {additionalCourses.length > 0 && (
        <CoursesGrid courses={additionalCourses} className="mt-8" />
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex items-center justify-center pt-5">
          <Button
            onClick={loadMoreCourseHandler}
            disabled={isLoading}
            className="py-3 text-gray-500 min-w-[106px] relative"
            variant="outline"
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
  );
};

export default CategoryCoursesClientSection;
