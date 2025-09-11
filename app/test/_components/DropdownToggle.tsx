// DropdownToggle.tsx (Client Component)
// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { motion } from "framer-motion";

interface ICategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  isChild: boolean;
  _count: {
    courses: number;
  };
}

interface DropdownToggleProps {
  parentCategory: ICategory;
  childCategories: ICategory[];
  totalCourses: number;
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

const DropdownToggle = ({ 
  parentCategory, 
  childCategories, 
  totalCourses,
  toggleSidebar, 
  isMobile = false 
}: DropdownToggleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();
  const path = usePathname();

  // Get current category slug from URL
  const getCurrentCategorySlug = () => {
    if (path.startsWith("/courses/category/")) {
      return path.split("/").pop();
    }
    return searchParams.get("category");
  };

  // Check if current category matches this slug
  const isCurrentCategory = (categorySlug: string) => {
    const currentSlug = getCurrentCategorySlug();
    return categorySlug === currentSlug;
  };

  // Check if any child is active
  const isAnyChildActive = () => {
    const currentCategorySlug = getCurrentCategorySlug();
    if (!currentCategorySlug) return false;
    return childCategories.some((child) => child.slug === currentCategorySlug);
  };

  // Auto-expand if current category is parent or any child is selected
  useEffect(() => {
    const currentCategorySlug = getCurrentCategorySlug();
    if (currentCategorySlug) {
      const isParentActive = parentCategory.slug === currentCategorySlug;
      const isChildActive = childCategories.some((child) => child.slug === currentCategorySlug);
      
      if (isParentActive || isChildActive) {
        setIsExpanded(true);
      }
    }
  }, [path, searchParams, parentCategory.slug, childCategories]);

  const handleDropdownToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const isActive = isCurrentCategory(parentCategory.slug) || isAnyChildActive();

  const arrowVariants = {
    closed: {
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      rotate: 90,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div>
      {/* Parent Category with Dropdown Toggle */}
      <div
        className={`flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-sidebar-highlight transition-colors rounded ${
          isActive
            ? "bg-sidebar-highlight text-black font-medium rounded-md"
            : "text-gray-700"
        }`}
      >
        <div className="flex-1 flex items-center">
          <span className="text-sm">
            {textLangChecker(parentCategory.name)}
          </span>
          {totalCourses !== 0 && (
            <span className="ml-2 text-base">
              ({convertNumberToBangla(totalCourses)})
            </span>
          )}
        </div>

        <button
          onClick={handleDropdownToggle}
          className="ml-2 p-1 rounded transition-colors"
        >
          <motion.div
            variants={arrowVariants}
            animate={isExpanded ? "open" : "closed"}
          >
            <RiArrowRightSLine className="w-4 h-4 text-gray-600" />
          </motion.div>
        </button>
      </div>

      {/* Child Categories Dropdown */}
      {isExpanded && (
        <div className="border-l ml-4 mt-2 overflow-hidden">
          {/* Parent category link in dropdown */}
          <Link
            href={`/courses/category/${parentCategory.slug}`}
            prefetch={false}
            onClick={isMobile ? toggleSidebar : undefined}
            className={`block py-2 px-4 cursor-pointer text-sm transition-colors ${
              isCurrentCategory(parentCategory.slug)
                ? "text-teal-600 font-medium"
                : "text-gray-600 hover:bg-sidebar-highlight"
            }`}
          >
            {textLangChecker(parentCategory.name)}
            {parentCategory._count.courses !== 0 && (
              <span className="ml-2 text-base">
                ({convertNumberToBangla(parentCategory._count.courses)})
              </span>
            )}
          </Link>

          {/* Child category links */}
          {childCategories.map((childCategory: ICategory) => (
            <Link
              key={childCategory.id}
              href={`/courses/category/${childCategory.slug}`}
              prefetch={false}
              onClick={isMobile ? toggleSidebar : undefined}
              className={`block py-2 px-4 cursor-pointer text-sm transition-colors ${
                isCurrentCategory(childCategory.slug)
                  ? "text-teal-600 font-medium"
                  : "text-gray-600 hover:bg-sidebar-highlight"
              }`}
            >
              {textLangChecker(childCategory.name)}
              {childCategory._count.courses !== 0 && (
                <span className="ml-2 text-base">
                  ({convertNumberToBangla(childCategory._count.courses)})
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownToggle;