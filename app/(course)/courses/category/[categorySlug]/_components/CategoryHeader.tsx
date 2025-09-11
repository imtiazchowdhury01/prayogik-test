// CategoryHeader.tsx - Client Component (mobile sidebar + filters)
"use client";
import React, { useState } from "react";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";

import {
  CategoryFilterSelect,
  GeneralFilterSelect,
} from "@/app/(course)/courses/_components/SelectFilterOption";
import SidebarSheetComponent from "../../../_components/SidebarSheetComponent";

interface CategoryHeaderProps {
  categorySlug: string;
  pageType: "category" | "filter" | "category-filter";
  isCoursespage?: boolean;
  categoryName?: string;
}



const CategoryHeader = ({
  categorySlug,
  pageType,
  isCoursespage = false,
  categoryName = "",
}: CategoryHeaderProps) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);

  const toggleSidebarHandler = () => setShowSidebar((prev) => !prev);

  // Load categories and category name on mount
  React.useEffect(() => {
    const loadData = async () => {
      const categoriesData = await getCategoriesDBCall();
      setCategories(categoriesData);
    };

    loadData();
  }, [categorySlug, pageType]);

  const displayName = categoryName ? `${categoryName} কোর্সসমূহ` : "সকল কোর্স";

  return (
    <>
      {/* Title for small screen */}
      <div className="block mb-3 xm:mb-0 lg:hidden">
        <p className="text-black font-secondary font-semibold">{displayName}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile/Tablet Sheet Sidebar Trigger */}
          <SidebarSheetComponent
            categories={categories}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
            toggleSidebarHandler={toggleSidebarHandler}
          />

          {/* Title for large screen */}
          <div className="hidden lg:block">
            <p className="text-black font-semibold text-2xl">
              {categoryName || "সকল কোর্স"}
            </p>
          </div>
        </div>

        {/* Filter Component */}
        {(pageType === "category" || pageType === "category-filter") &&
        !isCoursespage ? (
          <CategoryFilterSelect categorySlug={categorySlug} />
        ) : (
          <GeneralFilterSelect />
        )}
      </div>
    </>
  );
};

export default CategoryHeader;
