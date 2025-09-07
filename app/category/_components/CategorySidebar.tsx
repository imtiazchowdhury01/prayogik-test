"use client";
import CoursesSidebar from "@/app/(course)/courses/_components/CoursesSidebar";
import SidebarSheetComponent from "@/app/(course)/courses/_components/SidebarSheetComponent";
import React, { useState } from "react";


const CategorySidebar = ({ categories }: any) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const toggleSidebarHandler = () => setShowSidebar((prev) => !prev);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <CoursesSidebar
          toggleSidebar={toggleSidebarHandler}
          categories={categories}
          isMobile={false}
        />
      </div>
      <div className="flex items-center lg:hidden">
        {/* Mobile/Tablet Sheet Sidebar Trigger - Only one instance */}
        <SidebarSheetComponent
          categories={categories}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
          toggleSidebarHandler={toggleSidebarHandler}
        />
      </div>
    </>
  );
};

export default CategorySidebar;
