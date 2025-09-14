// CategorySidebar.tsx (Server Component)
import React from "react";
import Link from "next/link";
import { Category } from "@prisma/client";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";
import { RiArrowRightSLine } from "react-icons/ri";

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

interface GroupedCategories {
  parentCategories: ICategory[];
  childCategories: { [parentId: string]: ICategory[] };
}

// Helper function to group categories (pure function, no state needed)
const groupCategories = (categories: Category[]): GroupedCategories => {
  const grouped: GroupedCategories = {
    parentCategories: [],
    childCategories: {},
  };

  categories.forEach((category: any) => {
    if (category.parentCategoryId === null) {
      grouped.parentCategories.push(category);
      console.log(grouped.parentCategories, "parent");
    } else {
      if (!grouped.childCategories[category.parentCategoryId]) {
        grouped.childCategories[category.parentCategoryId] = [];
      }
      grouped.childCategories[category.parentCategoryId].push(category);
    }
  });

  // Sort parent categories - those with children first
  grouped.parentCategories.sort((a, b) => {
    const aHasChildren = !!grouped.childCategories[a.id]?.length;
    const bHasChildren = !!grouped.childCategories[b.id]?.length;
    if (aHasChildren === bHasChildren) return 0;
    return aHasChildren ? -1 : 1;
  });

  return grouped;
};

const CategorySidebar = async () => {
  try {
    const categories = await getCategoriesDBCall();
    const groupedCategories = groupCategories(categories);
console.log(groupedCategories, "GROUP categories");
    return (
      <div>
        {/* CSS for dropdown functionality */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .dropdown-toggle {
              position: absolute;
              opacity: 0;
              pointer-events: none;
            }
            
            .dropdown-content {
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.3s ease-out;
            }
            
            .dropdown-toggle:checked + .dropdown-wrapper .dropdown-content {
              max-height: 500px;
            }
            
            .arrow-icon {
              transition: transform 0.2s ease-in-out;
            }
            
            .dropdown-toggle:checked + .dropdown-wrapper .dropdown-label .arrow-icon {
              transform: rotate(90deg);
            }
          `,
          }}
        />

        <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
          {/* Header */}
          <div className="mb-1">
            <Link
              href="/courses"
              prefetch={false}
              className="block w-full text-left text-lg font-bold py-2 px-2 rounded transition-colors text-gray-700 hover:bg-sidebar-highlight"
            >
              সকল কোর্স
            </Link>
          </div>

          {groupedCategories.parentCategories.length > 0 && (
            <div className="space-y-1">
              {groupedCategories.parentCategories.map(
                (parentCategory: ICategory) => {
                  const hasChildren =
                    groupedCategories.childCategories[parentCategory.id]
                      ?.length > 0;
                  const categoryCourseCount =
                    Number(parentCategory?._count?.courses) || 0;
                  const subCategoryCourseCount = hasChildren
                    ? (
                        groupedCategories.childCategories[parentCategory.id] ||
                        []
                      ).reduce(
                        (sum, category) =>
                          sum + (Number(category?._count?.courses) || 0),
                        0
                      )
                    : 0;
                  const totalCourses =
                    categoryCourseCount + subCategoryCourseCount;

                  if (hasChildren) {
                    // Parent with children - CSS-only dropdown
                    return (
                      <div key={parentCategory.id}>
                        <input
                          type="checkbox"
                          id={`dropdown-${parentCategory.id}`}
                          className="dropdown-toggle"
                        />

                        <div className="dropdown-wrapper">
                          <label
                            htmlFor={`dropdown-${parentCategory.id}`}
                            className="dropdown-label flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-sidebar-highlight transition-colors rounded text-gray-700"
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
                            <div className="ml-2 p-1 rounded transition-colors">
                              <RiArrowRightSLine className="w-4 h-4 text-gray-600 arrow-icon" />
                            </div>
                          </label>

                          <div className="dropdown-content border-l ml-4 mt-2">
                            {/* Parent category link in dropdown */}
                            {/* <Link
                              href={`/courses/category/${parentCategory.slug}`}
                              prefetch={false}
                              className="block py-2 px-4 cursor-pointer text-sm transition-colors text-gray-600 hover:bg-sidebar-highlight"
                            >
                              {textLangChecker(parentCategory.name)}
                              {parentCategory._count.courses !== 0 && (
                                <span className="ml-2 text-base">
                                  (
                                  {convertNumberToBangla(
                                    parentCategory._count.courses
                                  )}
                                  )
                                </span>
                              )}
                            </Link> */}

                            {/* Child category links */}
                            {groupedCategories.childCategories[
                              parentCategory.id
                            ].map((childCategory: ICategory) => (
                              <Link
                                key={childCategory.id}
                                href={`/courses/category/${childCategory.slug}`}
                                prefetch={false}
                                className="block py-2 px-4 cursor-pointer text-sm transition-colors text-gray-600 hover:bg-sidebar-highlight"
                              >
                                {textLangChecker(childCategory.name)}
                                {childCategory._count.courses !== 0 && (
                                  <span className="ml-2 text-base">
                                    (
                                    {convertNumberToBangla(
                                      childCategory._count.courses
                                    )}
                                    )
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // Parent without children - simple Link
                    return (
                      <div key={parentCategory.id}>
                        <Link
                          href={`/courses/category/${parentCategory.slug}`}
                          prefetch={false}
                          className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-sidebar-highlight transition-colors rounded text-gray-700"
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
                        </Link>
                      </div>
                    );
                  }
                }
              )}
            </div>
          )}
        </aside>
      </div>
    );
  } catch (error) {
    console.error("Error loading categories:", error);
    return (
      <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
        <div className="text-center py-8 text-gray-500">
          Failed to load categories
        </div>
      </aside>
    );
  }
};

export default CategorySidebar;