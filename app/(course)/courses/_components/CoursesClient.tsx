// CoursesClientSection.tsx - Client Component (Load more, filtering)
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import CoursesGrid from "./CoursesGrid";

interface CoursesClientSectionProps {
  initialPagination: any;
}

const CoursesClientSection = ({
  initialPagination,
}: CoursesClientSectionProps) => {
  const [additionalCourses, setAdditionalCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(
    initialPagination.currentPage || 1
  );
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initialPagination.hasNextPage || false
  );
  const [filters, setFilters] = useState<any>({});

  const loadMoreCourses = async () => {
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;

      const queryParams = new URLSearchParams({
        page: nextPage.toString(),
        limit: (initialPagination.limit || 12).toString(),
        ...filters,
      });

      const response = await fetch(`/api/courses?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      if (data.courses) {
        setAdditionalCourses((prev) => [...prev, ...data.courses]);
        setCurrentPage(nextPage);
        setHasNextPage(data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error("Error loading more courses:", error);
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
      {hasNextPage && (
        <div className="flex items-center justify-center pt-8">
          <Button
            onClick={loadMoreCourses}
            disabled={isLoading}
            className="py-3 px-6 text-gray-500 min-w-[120px]"
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

export default CoursesClientSection;
