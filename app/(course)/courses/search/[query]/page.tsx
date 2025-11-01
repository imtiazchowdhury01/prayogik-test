"use client";

import { useParams, useSearchParams } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import { useSearchResults } from "@/hooks/use-search-result";
import { NoResultsMessage } from "../../_components/NoResultsMessage";
import { LoadMoreButton } from "./_components/LoadMoreButton";
import SkeletonCard from "@/components/SkeletonCard";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

export default function SearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const query = decodeURIComponent(params.query as string);
  const published = "true";
  const advanced = "true";

  const {
    allCourses,
    searchResult,
    loading,
    loadingMore,
    error,
    loadMore,
    hasMore,
  } = useSearchResults(query, published, advanced);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return <NoResultsMessage query={""} />;
  }

  if (!searchResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            কোন ফলাফল পাওয়া যায়নি
          </h1>
        </div>
      </div>
    );
  }

  const { pagination } = searchResult;
  console.log(allCourses, "all courses");
  return (
    <div className="app-container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          "{query}" এর জন্য {convertNumberToBangla(pagination.totalCount)} টি
          ফলাফল
        </h1>
        <p className="text-lg font-medium sm:text-xl">সার্চ রেজাল্ট</p>
      </div>

      {allCourses.length === 0 ? (
        <NoResultsMessage query={query} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {allCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="light"
                instructor={course?.teacherProfile?.user?.name}
              />
            ))}
          </div>
          <LoadMoreButton
            isLoading={loadingMore}
            hasMore={hasMore}
            onClick={loadMore}
          />
        </>
      )}
    </div>
  );
}
