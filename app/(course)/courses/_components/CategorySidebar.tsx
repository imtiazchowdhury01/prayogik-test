// CategorySidebar.tsx (Server Component)
import React from "react";

import Link from "next/link";
import { Category } from "@prisma/client";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";
import DropdownToggle from "./DropdownToggle";

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
    console.log(groupedCategories);
    return (
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
                  groupedCategories.childCategories[parentCategory.id]?.length >
                  0;
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
                const totalCourses =
                  categoryCourseCount + subCategoryCourseCount;

                if (hasChildren) {
                  // Parent with children - use DropdownToggle client component
                  return (
                    <DropdownToggle
                      key={parentCategory.id}
                      parentCategory={parentCategory}
                      childCategories={
                        groupedCategories.childCategories[parentCategory.id]
                      }
                      totalCourses={totalCourses}
                      isMobile={false}
                    />
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

// CategorySidebar.tsx (Server Component)
// import React from "react";

// import Link from "next/link";
// import { Category } from "@prisma/client";
// import { textLangChecker } from "@/lib/utils/textLangChecker";
// import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";


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

// // Helper function to group categories (pure function, no state needed)
// const groupCategories = (categories: Category[]): GroupedCategories => {
//   const grouped: GroupedCategories = {
//     parentCategories: [],
//     childCategories: {},
//   };

//   categories.forEach((category: any) => {
//     if (category.parentCategoryId === null) {
//       grouped.parentCategories.push(category);
//     } else {
//       if (!grouped.childCategories[category.parentCategoryId]) {
//         grouped.childCategories[category.parentCategoryId] = [];
//       }
//       grouped.childCategories[category.parentCategoryId].push(category);
//     }
//   });

//   // Sort parent categories - those with children first
//   grouped.parentCategories.sort((a, b) => {
//     const aHasChildren = !!grouped.childCategories[a.id]?.length;
//     const bHasChildren = !!grouped.childCategories[b.id]?.length;
//     if (aHasChildren === bHasChildren) return 0;
//     return aHasChildren ? -1 : 1;
//   });

//   return grouped;
// };

// const CategorySidebar = async () => {
//   try {
//     const categories = await getCategoriesDBCall();
//     const groupedCategories = groupCategories(categories);
//     console.log(groupedCategories);
//     return (
//       <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
//         {/* Header */}
//         <div className="mb-1">
//           <Link
//             href="/courses"
//             prefetch={false}
//             className="block w-full text-left text-lg font-bold py-2 px-2 rounded transition-colors text-gray-700 hover:bg-sidebar-highlight"
//           >
//             সকল কোর্স
//           </Link>
//         </div>

//         {categories.length > 0 &&
//           categories.map((parentCategory: ICategory) => (
//             <div key={parentCategory.id}>
//               <Link
//                 href={`/courses/category/${parentCategory.slug}`}
//                 prefetch={false}
//                 className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-sidebar-highlight transition-colors rounded text-gray-700"
//               >
//                 <div className="flex-1 flex items-center">
//                   <span className="text-sm">
//                     {textLangChecker(parentCategory.name)}
//                   </span>
//                 </div>
//               </Link>
//             </div>
//           ))}
//       </aside>
//     );
//   } catch (error) {
//     console.error("Error loading categories:", error);
//     return (
//       <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
//         <div className="text-center py-8 text-gray-500">
//           Failed to load categories
//         </div>
//       </aside>
//     );
//   }
// };

// export default CategorySidebar;
