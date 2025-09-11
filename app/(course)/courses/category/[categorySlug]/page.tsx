// CategorySlugPage.tsx - Server Component (Main page)
import React, { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";

import CategoryHeader from "./_components/CategoryHeader";
import {
  getCategoriesDBCall,
  getCategoryCoursesCountDBCall,
  getCategoryNameBySlugDBCall,
} from "@/lib/data-access-layer/categories";
import CoursesBreadcrumb from "../../_components/CoursesBreadcrumb";
import CoursesGridSkeleton from "../../_components/CoursesGridSkeleton";
import CategoryCoursesSection from "./_components/CategoryCoursesSection";
import CategorySidebarSkeleton from "../../_components/CategorySidebarSkeleton";
import CategorySidebar from "../../_components/CategorySidebar";

// Define filter types
const FILTER_TYPES = ["recent", "older", "prime", "live"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

// Generate static params
export async function generateStaticParams() {
  const categories = await getCategoriesDBCall();
  const params = [];

  // Check each category for courses and only include if it has courses
  for (const category of categories) {
    const coursesCount = await getCategoryCoursesCountDBCall(category.slug);
    if (coursesCount > 0) {
      params.push({
        categorySlug: category.slug,
      });
    }
  }

  // Always include filter types as they aggregate across all courses
  const filterParams = FILTER_TYPES.filter((type) => type !== "older").map(
    (filter) => ({
      categorySlug: filter,
    })
  );

  return [...params, ...filterParams];
}

// Dynamic metadata
export async function generateMetadata(
  { params }: { params: { categorySlug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.categorySlug;

  // Check if it's a filter type
  if (FILTER_TYPES.includes(slug as FilterType)) {
    const filterMetadata = {
      recent: {
        title: "Recent Courses | Latest Online Courses in Bangla | Prayogik",
        description:
          "Explore the most recent online courses. Stay updated with the latest practical skills and career-focused topics in Bangla.",
      },
      older: {
        title: "Older Courses | Previous Online Courses in Bangla | Prayogik",
        description:
          "Browse through our collection of older online courses. Find established practical skills and career-focused topics in Bangla.",
      },
      prime: {
        title:
          "Prime Courses | Premium Subscription Courses in Bangla | Prayogik",
        description:
          "Access our premium subscription courses. Get exclusive content and advanced practical skills in Bangla.",
      },
      live: {
        title: "Live Courses | Interactive Live Classes in Bangla | Prayogik",
        description:
          "Join our interactive live courses. Learn in real-time with expert instructors and engage with fellow students in Bangla.",
      },
    };
    return filterMetadata[slug as FilterType];
  }

  // For category pages, get category name for title
  const categories = await getCategoriesDBCall();
  const category = categories.find((cat) => cat.slug === slug);

  if (category) {
    return {
      title: `${category.name} Courses | Online Learning in Bangla | Prayogik`,
      description: `Learn ${category.name} with practical, career-focused online courses in Bangla. Expert instruction and hands-on projects.`,
    };
  }

  // Default metadata
  return {
    title: "Courses | Online Learning Platform | Prayogik",
    description:
      "Discover online courses to boost your skills with practical, career-focused topics in Bangla.",
  };
}

const CategorySlugPage = async ({
  params,
}: {
  params: { categorySlug: string };
}) => {
  const slug = params.categorySlug;
  const isFilterType = FILTER_TYPES.includes(slug as FilterType);
  const categoryName = await getCategoryNameBySlugDBCall(slug);
  return (
    <section className="min-h-[50vh]">
      {/* Breadcrumbs */}
      <CoursesBreadcrumb isCategoryPage={true} />

      <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <CategorySidebar />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          {/* Header with mobile sidebar and filters */}
          <CategoryHeader
            categorySlug={slug}
            pageType={isFilterType ? "filter" : "category"}
            categoryName="categoryName"
          />

          {/* Server Component for Initial Courses (SEO) */}
          <Suspense fallback={<CoursesGridSkeleton />}>
            <CategoryCoursesSection
              categorySlug={slug}
              pageType={isFilterType ? "filter" : "category"}
            />
          </Suspense>
        </div>
      </div>
    </section>
    // <section className="min-h-[50vh]">
    //   {/* Breadcrumbs */}
    //   <CoursesBreadcrumb isCategoryPage={true} />

    //   <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
    //     {/* Sidebar */}
    //     <div className="hidden lg:block lg:w-1/4">
    //       <Suspense fallback={<CategorySidebarSkeleton />}>
    //         <CategorySidebar />
    //       </Suspense>
    //     </div>

    //     {/* Main Content */}
    //     <div className="w-full lg:w-3/4">
    //       {/* Header with mobile sidebar and filters */}
    //       <CategoryHeader
    //         categorySlug={slug}
    //         pageType={isFilterType ? "filter" : "category"}
    //       />

    //       {/* Server Component for Initial Courses (SEO) */}
    //       <Suspense fallback={<CoursesGridSkeleton />}>
    //         <CategoryCoursesSection
    //           categorySlug={slug}
    //           pageType={isFilterType ? "filter" : "category"}
    //         />
    //       </Suspense>
    //     </div>
    //   </div>
    // </section>
  );
};

export default CategorySlugPage;
