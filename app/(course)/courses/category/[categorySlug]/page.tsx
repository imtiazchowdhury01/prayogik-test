
import React, { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import {
  getCategoriesDBCall,
  getCategoryCoursesCountDBCall,
} from "@/lib/data-access-layer/categories";
import CategoriesWrapper from "../_components/CategoryWrapper";
import CategorySidebar from "../_components/CategorySidebar";
import { CategoryFilterSelect, GeneralFilterSelect } from "../../_components/SelectFilterOption";
import CoursesSection from "../_components/CoursesSection";

// Define filter types
const FILTER_TYPES = ["recent", "older", "prime", "live"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

// Generate static params only for categories that have courses AND filter types
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

// Dynamic metadata based on slug type
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
        description: "Explore the most recent online courses. Stay updated with the latest practical skills and career-focused topics in Bangla.",
      },
      older: {
        title: "Older Courses | Previous Online Courses in Bangla | Prayogik",
        description: "Browse through our collection of older online courses. Find established practical skills and career-focused topics in Bangla.",
      },
      prime: {
        title: "Prime Courses | Premium Subscription Courses in Bangla | Prayogik",
        description: "Access our premium subscription courses. Get exclusive content and advanced practical skills in Bangla.",
      },
      live: {
        title: "Live Courses | Interactive Live Classes in Bangla | Prayogik",
        description: "Join our interactive live courses. Learn in real-time with expert instructors and engage with fellow students in Bangla.",
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
    description: "Discover online courses to boost your skills with practical, career-focused topics in Bangla.",
  };
}

// Loading components
const SidebarSkeleton = () => (
  <div className="hidden lg:block lg:w-1/4">
    <div className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
      <div className="flex flex-col w-full my-5 space-y-2">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const CoursesSkeleton = () => (
  <div className="w-full lg:w-3/4">
    <div className="grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 mt-5">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
      ))}
    </div>
  </div>
);

const CategorySlugPage = async ({
  params,
}: {
  params: { categorySlug: string };
}) => {
  const slug = params.categorySlug;
  
  // Determine page type and category name
  const isFilter = FILTER_TYPES.includes(slug as FilterType);
  const pageType = isFilter ? "filter" : "category";
  
  // Get category name for display
  let categoryName = "";
  if (isFilter) {
    const nameMap = {
      recent: "সাম্প্রতিক",
      older: "পুরাতন", 
      prime: "প্রায়োগিক প্রাইম",
      live: "লাইভ কোর্স",
    };
    categoryName = nameMap[slug as FilterType];
  } else {
    // For actual categories, the name will be fetched in CoursesSection
    categoryName = slug; // Temporary, will be replaced
  }

  // Determine filter component
  const filterComponent = isFilter ? (
    <GeneralFilterSelect />
  ) : (
    <CategoryFilterSelect categorySlug={slug} />
  );

  return (
    <section className="min-h-[50vh]">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <nav>
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-sm font-medium underline underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand">
                  হোম
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <a href="/courses" className="text-sm font-medium underline underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand">
                  কোর্স
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-sm sm:text-base text-gray-600">ক্যাটাগরি</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
        {/* Sidebar with Suspense */}
        <Suspense fallback={<SidebarSkeleton />}>
          <CategorySidebar />
        </Suspense>

        {/* Main Content with Suspense */}
        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesSection
            categorySlug={slug}
            pageType={pageType}
            filterType={isFilter ? (slug as FilterType) : undefined}
            filterComponent={filterComponent}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default CategorySlugPage;