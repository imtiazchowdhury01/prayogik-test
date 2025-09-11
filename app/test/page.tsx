
import React, { Suspense } from "react";
import CoursesSection from "./_components/CoursesSection";
import { GeneralFilterSelect } from "../(course)/courses/_components/SelectFilterOption";
import CategorySidebarSkeleton from "./_components/CategorySidebarSkeleton";
import CoursesGridSkeleton from "./_components/CoursesGridSkeleton";
import CategorySidebar from "./_components/CategorySidebar";

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
          {/* Client Component for Filters */}
          <div className="flex items-center w-full justify-between">
            <p className="text-black font-semibold text-2xl">সকল কোর্স</p>
            <GeneralFilterSelect />
          </div>

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
