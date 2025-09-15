// CategoryFilterPage.tsx - Updated to use refactored components
import React, { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";

import CategoryHeader from "../_components/CategoryHeader";
import {
  getCategoriesDBCall,
  getCategoryCoursesCountDBCall,
} from "@/lib/data-access-layer/categories";
import {
  getPrimeCoursesByCategoryDBCall,
  getCategoryLiveCoursesDBCall,
} from "@/lib/data-access-layer/course";
import CoursesBreadcrumb from "../../../_components/CoursesBreadcrumb";
import CoursesGridSkeleton from "../../../_components/CoursesGridSkeleton";
import CategoryCoursesSection from "../_components/CategoryCoursesSection";
import CategorySidebarSkeleton from "../../../_components/CategorySidebarSkeleton";
import CategorySidebar from "../../../_components/CategorySidebar";

// Define filter types
const FILTER_TYPES = ["recent", "prime", "live"] as const;
// const FILTER_TYPES = ["recent", "older", "prime", "live"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

// Get category name in Bangla
const getCategoryName = (slug: string): string => {
  const filterNameMap = {
    recent: "সাম্প্রতিক",
    // older: "পুরাতন",
    prime: "প্রায়োগিক প্রাইম",
    live: "লাইভ কোর্স",
  };

  return filterNameMap[slug as keyof typeof filterNameMap] || slug;
};

// Generate static params only for category-filter combinations that have courses
export async function generateStaticParams() {
  const categories = await getCategoriesDBCall();
  const params: { categorySlug: string; filter: string }[] = [];

  // Check each category for courses before generating params
  for (const category of categories) {
    const coursesCount = await getCategoryCoursesCountDBCall(category.slug);

    // Only generate params for categories that have courses
    if (coursesCount > 0) {
      // Check each filter type for this category
      for (const filter of FILTER_TYPES) {
        let hasFilteredCourses = false;

        switch (filter) {
          case "recent":
            // case "older":
            // These filters use the same courses, just sorted differently
            hasFilteredCourses = coursesCount > 0;
            break;

          case "prime":
            // Check if category has prime courses
            try {
              const primeCourses = await getPrimeCoursesByCategoryDBCall(
                category.slug,
                1
              );
              hasFilteredCourses = primeCourses && primeCourses.length > 0;
            } catch (error) {
              hasFilteredCourses = false;
            }
            break;

          case "live":
            // Check if category has live courses
            try {
              const liveCourses = await getCategoryLiveCoursesDBCall(
                category.slug,
                1
              );
              hasFilteredCourses = liveCourses && liveCourses.length > 0;
            } catch (error) {
              hasFilteredCourses = false;
            }
            break;
        }

        // Only add param if this filter has courses for this category
        if (hasFilteredCourses) {
          params.push({
            categorySlug: category.slug,
            filter: filter,
          });
        }
      }
    }
  }

  return params;
}

// Dynamic metadata based on category and filter
export async function generateMetadata(
  { params }: { params: { categorySlug: string; filter: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { categorySlug, filter } = params;

  // Get category name
  const categories = await getCategoriesDBCall();
  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category || !FILTER_TYPES.includes(filter as FilterType)) {
    return {
      title: "Courses | Online Learning Platform | Prayogik",
      description: "Discover online courses to boost your skills.",
    };
  }

  const filterLabels = {
    recent: "সাম্প্রতিক",
    older: "পুরাতন",
    prime: "প্রাইমের সাথে ফ্রি",
    live: "লাইভ",
  };

  const filterLabel = filterLabels[filter as FilterType];

  return {
    title: `${filterLabel} ${category.name} Courses | Online Learning in Bangla | Prayogik`,
    description: `Explore ${filterLabel.toLowerCase()} ${
      category.name
    } courses. Learn practical skills with expert instruction in Bangla.`,
  };
}

const CategoryFilterPage = async ({
  params,
}: {
  params: { categorySlug: string; filter: string };
}) => {
  const { categorySlug, filter } = params;

  // Validate filter type
  if (!FILTER_TYPES.includes(filter as FilterType)) {
    return <div>Invalid filter type</div>;
  }

  const categories = await getCategoriesDBCall();
  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <section className="min-h-[50vh]">
      {/* Breadcrumbs */}
      <CoursesBreadcrumb isCategoryPage={true} />

      <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <CategorySidebar categories={categories} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          {/* Header with mobile sidebar and filters */}
          <CategoryHeader
            categorySlug={categorySlug}
            pageType="category-filter"
            categoryName={getCategoryName(filter)}
            categories={categories}
          />

          {/* Server Component for Initial Courses (SEO) */}

          <CategoryCoursesSection
            categorySlug={categorySlug}
            pageType="category-filter"
            filter={filter as FilterType}
          />
        </div>
      </div>
    </section>
  );
};

export default CategoryFilterPage;
