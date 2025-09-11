import React, { Suspense } from "react";
import CoursesSection from "./_components/CoursesSection";
import CategorySidebarSkeleton from "./_components/CategorySidebarSkeleton";
import CoursesGridSkeleton from "./_components/CoursesGridSkeleton";
import CategorySidebar from "./_components/CategorySidebar";
import { GeneralFilterSelect } from "./_components/SelectFilterOption";
import CategoryHeader from "./category/[categorySlug]/_components/CategoryHeader";

const CoursesPage = () => {
  return (
    <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <Suspense fallback={<CategorySidebarSkeleton />}>
          <CategorySidebar />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-lg p-6">
          {/* Header with mobile sidebar and filters */}
          <CategoryHeader
            categorySlug={""}
            pageType="category"
            isCoursespage={true}
          />

          {/* Server Component for Initial Courses (SEO) */}
          <Suspense fallback={<CoursesGridSkeleton />}>
            <CoursesSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
