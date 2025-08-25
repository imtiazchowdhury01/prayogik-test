
// // @ts-nocheck
// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { RiArrowRightSLine } from "react-icons/ri";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Skeleton } from "@/components/ui/skeleton";
// import { textLangChecker } from "@/lib/utils/textLangChecker";
// import { Category } from "@prisma/client";
// import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
// import { motion } from "framer-motion";

// const SidebarLoadingSkeleton = () => {
//   return (
//     <div className="flex flex-col w-full my-5 space-y-2">
//       <Skeleton className="w-full h-10 " />
//       <Skeleton className="w-full h-10 " />
//       <Skeleton className="w-full h-10 " />
//       <Skeleton className="w-full h-10 " />
//     </div>
//   );
// };

// interface ICategory {
//   id: string;
//   name: string;
//   slug: string;
//   parentCategoryId: string | null;
//   isChild: boolean;
//   _count: {
//     courses: number;
//   };
// }

// interface GroupedCategories {
//   parentCategories: ICategory[];
//   childCategories: { [parentId: string]: ICategory[] };
// }

// const CoursesSidebar = ({
//   toggleSidebar,
//   categories,
//   isMobile = false,
// }: {
//   toggleSidebar: () => void;
//   categories: Category[];
//   isMobile?: boolean;
// }) => {
//   const [expandedParents, setExpandedParents] = useState<Set<string>>(
//     new Set()
//   );
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const path = usePathname();
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   // Group categories by parent
//   const groupedCategories = useMemo((): GroupedCategories => {
//     const grouped: GroupedCategories = {
//       parentCategories: [],
//       childCategories: {},
//     };
//     categories.forEach((category) => {
//       if (category.parentCategoryId === null) {
//         // This is a parent category
//         grouped.parentCategories.push(category);
//       } else {
//         // This is a child category
//         if (!grouped.childCategories[category.parentCategoryId]) {
//           grouped.childCategories[category.parentCategoryId] = [];
//         }
//         grouped.childCategories[category.parentCategoryId].push(category);
//       }
//     });

//     // Sort parent categories - those with children first
//     grouped.parentCategories.sort((a, b) => {
//       const aHasChildren = !!grouped.childCategories[a.id]?.length;
//       const bHasChildren = !!grouped.childCategories[b.id]?.length;

//       if (aHasChildren === bHasChildren) return 0;
//       return aHasChildren ? -1 : 1;
//     });
//     return grouped;
//   }, [categories]);

//   // Get current category slug from URL
//   const getCurrentCategorySlug = () => {
//     // Check if we're on a category page (/courses/category/[slug])
//     if (path.startsWith("/courses/category/")) {
//       return path.split("/").pop();
//     }
//     // Check query parameter for backward compatibility
//     return searchParams.get("category");
//   };

//   // Auto-expand parent if child is selected
//   useEffect(() => {
//     const currentCategorySlug = getCurrentCategorySlug();
//     if (currentCategorySlug) {
//       // Find if current category is a child and expand its parent
//       Object.entries(groupedCategories.childCategories).forEach(
//         ([parentId, children]) => {
//           if (children.some((child) => child.slug === currentCategorySlug)) {
//             setExpandedParents((prev) => new Set([...prev, parentId]));
//           }
//         }
//       );
//     }
//   }, [path, searchParams, groupedCategories]);

//   const resetUrl = () => {
//     router.push("/courses");
//     // Only close sidebar when in mobile mode (inside sheet)
//     if (isMobile) {
//       toggleSidebar();
//     }
//   };

//   const handleCategoryClick = (
//     categorySlug: string,
//     event?: React.MouseEvent
//   ) => {
//     // Stop event propagation to prevent conflicts
//     if (event) {
//       event.stopPropagation();
//     }

//     // Navigate to the category slug page
//     router.push(`/courses/category/${categorySlug}`);

//     // Only close sidebar when in mobile mode (inside sheet)
//     if (isMobile) {
//       toggleSidebar();
//     }
//   };

//   const handleParentClick = (category: ICategory, event: React.MouseEvent) => {
//     // Stop event propagation
//     event.stopPropagation();

//     // Check if this parent has children
//     const hasChildren =
//       groupedCategories.childCategories[category.id]?.length > 0;

//     // If it has children, toggle the dropdown
//     if (hasChildren) {
//       setExpandedParents((prev) => {
//         const newSet = new Set(prev);
//         if (newSet.has(category.id)) {
//           newSet.delete(category.id);
//         } else {
//           newSet.add(category.id);
//         }
//         return newSet;
//       });
//     } else {
//       // If no children, treat as category selection
//       handleCategoryClick(category.slug, event);
//     }
//   };

//   const handleDropdownToggle = (parentId: string, event: React.MouseEvent) => {
//     // Prevent parent category selection when clicking arrow
//     event.stopPropagation();

//     setExpandedParents((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(parentId)) {
//         newSet.delete(parentId);
//       } else {
//         newSet.add(parentId);
//       }
//       return newSet;
//     });
//   };

//   const isCurrentCategory = (categorySlug: string) => {
//     const currentSlug = getCurrentCategorySlug();
//     return categorySlug === currentSlug;
//   };

//   // helper function to check if any child is active
//   const isAnyChildActive = (parentId: string) => {
//     const currentCategorySlug = getCurrentCategorySlug();
//     if (!currentCategorySlug) return false;

//     const children = groupedCategories.childCategories[parentId] || [];
//     return children.some((child) => child.slug === currentCategorySlug);
//   };

//   // Check if we're on the main courses page (no category selected)
//   const isOnMainCoursesPage = () => {
//     return path === "/courses" && !searchParams.get("category");
//   };

//   const arrowVariants = {
//     closed: {
//       rotate: 0,
//       transition: {
//         duration: 0.2,
//         ease: "easeInOut",
//       },
//     },
//     open: {
//       rotate: 90,
//       transition: {
//         duration: 0.2,
//         ease: "easeInOut",
//       },
//     },
//   };

//   return (
//     <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
//       {/* Header */}
//       <div className="mb-1">
//         <button
//           onClick={resetUrl}
//           className={`w-full text-left text-lg font-bold py-2 px-2 rounded transition-colors ${
//             isOnMainCoursesPage()
//               ? "text-black bg-sidebar-highlight"
//               : "text-gray-700 hover:bg-sidebar-highlight"
//           }`}
//         >
//           সকল কোর্স
//         </button>
//       </div>

//       {isLoading && <SidebarLoadingSkeleton />}

//       {!isLoading && groupedCategories.parentCategories.length > 0 && (
//         <div className="space-y-1">
//           {groupedCategories.parentCategories.map(
//             (parentCategory: ICategory) => {
//               const hasChildren =
//                 groupedCategories.childCategories[parentCategory.id]?.length >
//                 0;

//               const isExpanded = expandedParents.has(parentCategory.id);

//               const childrenCount = hasChildren
//                 ? groupedCategories.childCategories[parentCategory.id].length
//                 : 0;

//               const isActive =
//                 isCurrentCategory(parentCategory.slug) ||
//                 isAnyChildActive(parentCategory.id);
//               const categoryCourseCount =
//                 Number(parentCategory?._count?.courses) || 0;

//               const subCategoryCourseCount = hasChildren
//                 ? (
//                     groupedCategories.childCategories[parentCategory.id] || []
//                   ).reduce(
//                     (sum, category) =>
//                       sum + (Number(category?._count?.courses) || 0),
//                     0
//                   )
//                 : 0;

//               const totalCourses = categoryCourseCount + subCategoryCourseCount;

//               return (
//                 <div key={parentCategory.id} className="">
//                   {/* Parent Category */}
//                   <div
//                     onClick={(e) => handleParentClick(parentCategory, e)}
//                     className={`flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-sidebar-highlight transition-colors rounded ${
//                       isActive
//                         ? "bg-sidebar-highlight text-black font-medium rounded-md"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     <div className="flex-1 flex items-center">
//                       <span className="text-sm">
//                         {textLangChecker(parentCategory.name)}
//                       </span>
//                       {totalCourses !== 0 && (
//                         <span className="ml-2 text-base">
//                           ({convertNumberToBangla(totalCourses)})
//                         </span>
//                       )}
//                     </div>

//                     {hasChildren && (
//                       <button
//                         onClick={(e) =>
//                           handleDropdownToggle(parentCategory.id, e)
//                         }
//                         className="ml-2 p-1 rounded transition-colors"
//                       >
//                         <motion.div
//                           variants={arrowVariants}
//                           animate={isExpanded ? "open" : "closed"}
//                         >
//                           <RiArrowRightSLine className="w-4 h-4 text-gray-600" />
//                         </motion.div>
//                       </button>
//                     )}
//                   </div>

//                   {/* Child Categories */}

//                   {hasChildren && isExpanded && (
//                     <div
//                       key={`dropdown-${parentCategory.id}`}
//                       className="border-l ml-4 mt-2 overflow-hidden"
//                     >
//                       <div
//                         onClick={(e) =>
//                           handleCategoryClick(parentCategory.slug, e)
//                         }
//                         className={`py-2 px-4 cursor-pointer text-sm transition-colors last:border-b-0 ${
//                           isCurrentCategory(parentCategory.slug)
//                             ? "text-teal-600 font-medium"
//                             : "text-gray-600 hover:bg-sidebar-highlight"
//                         }`}
//                       >
//                         {textLangChecker(parentCategory.name)}
//                         {parentCategory._count.courses !== 0 && (
//                           <span className="ml-2 text-base">
//                             (
//                             {convertNumberToBangla(
//                               parentCategory._count.courses
//                             )}
//                             )
//                           </span>
//                         )}
//                       </div>
//                       {groupedCategories.childCategories[parentCategory.id].map(
//                         (childCategory: ICategory, index) => (
//                           <div
//                             key={childCategory.id}
//                             onClick={(e) =>
//                               handleCategoryClick(childCategory.slug, e)
//                             }
//                             className={`py-2 px-4 cursor-pointer text-sm transition-colors last:border-b-0 ${
//                               isCurrentCategory(childCategory.slug)
//                                 ? "text-teal-600 font-medium"
//                                 : "text-gray-600 hover:bg-sidebar-highlight"
//                             }`}
//                           >
//                             {textLangChecker(childCategory.name)}
//                             {childCategory._count.courses !== 0 && (
//                               <span className="ml-2 text-base">
//                                 (
//                                 {convertNumberToBangla(
//                                   childCategory._count.courses
//                                 )}
//                                 )
//                               </span>
//                             )}
//                           </div>
//                         )
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             }
//           )}
//         </div>
//       )}
//     </aside>
//   );
// };

// export default CoursesSidebar;

// ---------------------v3-----------------------------
// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { Category } from "@prisma/client";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { motion } from "framer-motion";

const SidebarLoadingSkeleton = () => {
  return (
    <div className="flex flex-col w-full my-5 space-y-2">
      <Skeleton className="w-full h-10 " />
      <Skeleton className="w-full h-10 " />
      <Skeleton className="w-full h-10 " />
      <Skeleton className="w-full h-10 " />
    </div>
  );
};

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

const CoursesSidebar = ({
  toggleSidebar,
  categories,
  isMobile = false,
}: {
  toggleSidebar: () => void;
  categories: Category[];
  isMobile?: boolean;
}) => {
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const searchParams = useSearchParams();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Group categories by parent
  const groupedCategories = useMemo((): GroupedCategories => {
    const grouped: GroupedCategories = {
      parentCategories: [],
      childCategories: {},
    };
    categories.forEach((category) => {
      if (category.parentCategoryId === null) {
        // This is a parent category
        grouped.parentCategories.push(category);
      } else {
        // This is a child category
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
  }, [categories]);

  // Get current category slug from URL
  const getCurrentCategorySlug = () => {
    // Check if we're on a category page (/courses/category/[slug])
    if (path.startsWith("/courses/category/")) {
      return path.split("/").pop();
    }
    // Check query parameter for backward compatibility
    return searchParams.get("category");
  };

  // Auto-expand parent if child is selected
  useEffect(() => {
    const currentCategorySlug = getCurrentCategorySlug();
    if (currentCategorySlug) {
      // Find if current category is a child and expand its parent
      Object.entries(groupedCategories.childCategories).forEach(
        ([parentId, children]) => {
          if (children.some((child) => child.slug === currentCategorySlug)) {
            setExpandedParents((prev) => new Set([...prev, parentId]));
          }
        }
      );
    }
  }, [path, searchParams, groupedCategories]);

  const handleParentClick = (category: ICategory, event: React.MouseEvent) => {
    // Stop event propagation
    event.stopPropagation();

    // Check if this parent has children
    const hasChildren =
      groupedCategories.childCategories[category.id]?.length > 0;

    // If it has children, toggle the dropdown
    if (hasChildren) {
      setExpandedParents((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(category.id)) {
          newSet.delete(category.id);
        } else {
          newSet.add(category.id);
        }
        return newSet;
      });
    }
    // If no children, let the Link handle navigation (no router.push needed)
  };

  const handleDropdownToggle = (parentId: string, event: React.MouseEvent) => {
    // Prevent parent category selection when clicking arrow
    event.stopPropagation();

    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  const isCurrentCategory = (categorySlug: string) => {
    const currentSlug = getCurrentCategorySlug();
    return categorySlug === currentSlug;
  };

  // helper function to check if any child is active
  const isAnyChildActive = (parentId: string) => {
    const currentCategorySlug = getCurrentCategorySlug();
    if (!currentCategorySlug) return false;

    const children = groupedCategories.childCategories[parentId] || [];
    return children.some((child) => child.slug === currentCategorySlug);
  };

  // Check if we're on the main courses page (no category selected)
  const isOnMainCoursesPage = () => {
    return path === "/courses" && !searchParams.get("category");
  };

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
    <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
      {/* Header - Use Link instead of router.push */}
      <div className="mb-1">
        <Link
          href="/courses"
          prefetch={false}
          onClick={isMobile ? toggleSidebar : undefined}
          className={`block w-full text-left text-lg font-bold py-2 px-2 rounded transition-colors ${
            isOnMainCoursesPage()
              ? "text-black bg-sidebar-highlight"
              : "text-gray-700 hover:bg-sidebar-highlight"
          }`}
        >
          সকল কোর্স
        </Link>
      </div>

      {isLoading && <SidebarLoadingSkeleton />}

      {!isLoading && groupedCategories.parentCategories.length > 0 && (
        <div className="space-y-1">
          {groupedCategories.parentCategories.map(
            (parentCategory: ICategory) => {
              const hasChildren =
                groupedCategories.childCategories[parentCategory.id]?.length >
                0;

              const isExpanded = expandedParents.has(parentCategory.id);

              const isActive =
                isCurrentCategory(parentCategory.slug) ||
                isAnyChildActive(parentCategory.id);
              const categoryCourseCount =
                Number(parentCategory?._count?.courses) || 0;

              const subCategoryCourseCount = hasChildren
                ? (
                    groupedCategories.childCategories[parentCategory.id] || []
                  ).reduce(
                    (sum, category) =>
                      sum + (Number(category?._count?.courses) || 0),
                    0
                  )
                : 0;

              const totalCourses = categoryCourseCount + subCategoryCourseCount;

              return (
                <div key={parentCategory.id} className="">
                  {/* Parent Category - Wrap in Link for navigation */}
                  {hasChildren ? (
                    // If has children, make it a button for dropdown toggle
                    <div
                      onClick={(e) => handleParentClick(parentCategory, e)}
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
                        onClick={(e) =>
                          handleDropdownToggle(parentCategory.id, e)
                        }
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
                  ) : (
                    // If no children, make it a direct link
                    <Link
                      href={`/courses/category/${parentCategory.slug}`}
                      prefetch={false}
                      onClick={isMobile ? toggleSidebar : undefined}
                      className={`flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-sidebar-highlight transition-colors rounded block ${
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
                    </Link>
                  )}

                  {/* Child Categories - Use Links instead of onClick handlers */}
                  {hasChildren && isExpanded && (
                    <div
                      key={`dropdown-${parentCategory.id}`}
                      className="border-l ml-4 mt-2 overflow-hidden"
                    >
                      {/* Parent category link in dropdown */}
                      <Link
                        href={`/courses/category/${parentCategory.slug}`}
                        prefetch={false}
                        onClick={isMobile ? toggleSidebar : undefined}
                        className={`block py-2 px-4 cursor-pointer text-sm transition-colors last:border-b-0 ${
                          isCurrentCategory(parentCategory.slug)
                            ? "text-teal-600 font-medium"
                            : "text-gray-600 hover:bg-sidebar-highlight"
                        }`}
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
                      </Link>

                      {/* Child category links */}
                      {groupedCategories.childCategories[parentCategory.id].map(
                        (childCategory: ICategory) => (
                          <Link
                            key={childCategory.id}
                            href={`/courses/category/${childCategory.slug}`}
                            prefetch={false}
                            onClick={isMobile ? toggleSidebar : undefined}
                            className={`block py-2 px-4 cursor-pointer text-sm transition-colors last:border-b-0 ${
                              isCurrentCategory(childCategory.slug)
                                ? "text-teal-600 font-medium"
                                : "text-gray-600 hover:bg-sidebar-highlight"
                            }`}
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
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </aside>
  );
};

export default CoursesSidebar;