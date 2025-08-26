//@ts-nocheck
import Link from "next/link";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { clientApi } from "@/lib/utils/openai/client";
import { fetchCategories } from "@/services";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";

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
  orphanedCategories: ICategory[];
  nullParentCategories: ICategory[];
}

const groupCategoriesByParent = (
  categories: ICategory[]
): GroupedCategories => {
  const grouped: GroupedCategories = {
    parentCategories: [],
    childCategories: {},
    orphanedCategories: [],
    nullParentCategories: [],
  };

  // First pass: identify categories that are actual parents (have children)
  const categoriesWithChildren = new Set();
  categories.forEach((category) => {
    if (category.parentCategoryId !== null) {
      categoriesWithChildren.add(category.parentCategoryId);
    }
  });

  categories.forEach((category) => {
    if (category.parentCategoryId === null) {
      if (categoriesWithChildren.has(category.id)) {
        // This is a parent category (has children)
        grouped.parentCategories.push(category);
      } else {
        // This is a null parent category with no children
        grouped.nullParentCategories.push(category);
      }
    } else if (categoriesWithChildren.has(category.parentCategoryId)) {
      // This is a child category with valid parent
      if (!grouped.childCategories[category.parentCategoryId]) {
        grouped.childCategories[category.parentCategoryId] = [];
      }
      grouped.childCategories[category.parentCategoryId].push(category);
    } else {
      // This is an orphaned category (parent doesn't exist)
      grouped.orphanedCategories.push(category);
    }
  });

  return grouped;
};

const CourseCategories = async () => {
  const categories = await getCategoriesDBCall();
  const groupedCategories = groupCategoriesByParent(categories || []);

  // Keep parent categories separate from orphaned categories
  const displayCategories = groupedCategories.parentCategories;

  return (
    <section className="w-full pt-20 bg-[#F3F9F9] ">
      <div className="app-container px-6 md:px-7 lg:px-8 xl:px-8 2xl:px-0">
        <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
          কোর্স ক্যাটেগরি
        </h2>
        <p className="mt-2 mb-4 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
          ক্যারিয়ারের লক্ষ্য অনুযায়ী কোর্স নির্বাচন করুন
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 gap-y-8 md:gap-y-10  mx-auto md:mt-8">
          {displayCategories.map((parentCategory) => {
            const childCategories =
              groupedCategories.childCategories[parentCategory.id] || [];

            return (
              <div key={parentCategory.id}>
                {/* <Link href={`/courses?category=${parentCategory.slug}`}>
                  <h3 className="text-xl font-bold mb-3 hover:text-primary transition-all cursor-pointer">
                    {textLangChecker(parentCategory.name)}
                  </h3>
                </Link> */}
                <ul className="space-y-1 text-base font-normal">
                  {/* Show parent category as first item */}
                  <li className="hover:text-primary transition-all cursor-pointer">
                    <Link href={`/courses?category=${parentCategory.slug}`}>
                      <h3 className="text-lg font-bold mb-3 hover:text-primary transition-all cursor-pointer">
                        {textLangChecker(parentCategory.name)}
                      </h3>
                    </Link>
                  </li>

                  {/* Show child categories */}
                  {childCategories.map((childCategory) => (
                    <li
                      key={childCategory.id}
                      className="transition-all text-fontcolor-subtitle cursor-pointer  hover:text-primary-brand"
                    >
                      <Link href={`/courses?category=${childCategory.slug}`}>
                        {textLangChecker(childCategory.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Show null parent categories as a single grouped item */}
          {groupedCategories.nullParentCategories.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">অন্যান্য</h3>
              <ul className="space-y-1 text-base font-normal text-fontcolor-subtitle">
                {groupedCategories.nullParentCategories.map((category) => (
                  <li
                    key={category.id}
                    className="hover:text-primary-brand transition-all cursor-pointer "
                  >
                    <Link href={`/courses?category=${category.slug}`}>
                      {textLangChecker(category.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Show orphaned categories as a single grouped item */}
          {groupedCategories.orphanedCategories.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">অন্যান্য ক্যাটেগরি</h3>
              <ul className="space-y-1 text-base font-normal text-fontcolor-subtitle">
                {groupedCategories.orphanedCategories.map((category) => (
                  <li
                    key={category.id}
                    className="hover:text-primary transition-all cursor-pointer"
                  >
                    <Link href={`/courses?category=${category.slug}`}>
                      {textLangChecker(category.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <hr className="mt-12 border-t-[1px] border-[#BFC3C2]" />
      </div>
    </section>
  );
};

export default CourseCategories;
