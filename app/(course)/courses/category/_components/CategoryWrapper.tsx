
"use client";
import CourseCard from "@/components/CourseCard";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";
import CoursesSidebar from "../../_components/CoursesSidebar";
import SidebarSheetComponent from "../../_components/SidebarSheetComponent";
import { NoResultsMessage } from "../../_components/NoResultsMessage";

const CategoriesWrapper = ({
  courses: initialCourses,
  categories,
  categoryName,
  filterComponent,
  pageType, // 'category' | 'filter' | 'category-filter'
  categorySlug,
  filter,
}: any) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [courses, setCourses] = useState(initialCourses || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCourses?.length === 24);

  const toggleSidebarHandler = () => setShowSidebar((prev) => !prev);

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
    <section className="min-h-[50vh]">
      {/* breadcrumbs */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-sm font-medium underline  underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/courses"
                    className="text-sm font-medium underline  underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                  >
                    কোর্স
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>ক্যাটাগরি</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <CoursesSidebar
            toggleSidebar={toggleSidebarHandler}
            categories={categories}
            isMobile={false}
          />
        </div>

        <div className="w-full lg:w-3/4">
          {/* title for small screen */}
          <div className="block mb-3 xm:mb-0 lg:hidden">
            <p className="text-black font-secondary font-semibold">
              {categoryName} কোর্সসমূহ
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile/Tablet Sheet Sidebar Trigger - Only one instance */}
              <SidebarSheetComponent
                categories={categories}
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
                toggleSidebarHandler={toggleSidebarHandler}
              />
              {/* title for large screen */}
              <div className="hidden lg:block">
                <p className="text-black font-semibold text-2xl">
                  {categoryName ? categoryName : "সকল কোর্স"}
                </p>
              </div>
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
            <NoResultsMessage/>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesWrapper;