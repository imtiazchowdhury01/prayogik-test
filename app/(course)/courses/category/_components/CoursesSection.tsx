// CoursesSection.tsx - Server Component
import React from "react";
import {
  getCategoriesDBCall,
  getCategoryCoursesDBCall,
} from "@/lib/data-access-layer/categories";
import {
  getPrimeCoursesDBCall,
  getCoursesDbCall,
  getLiveCoursesDBCall,
} from "@/lib/data-access-layer/course";
import CoursesSectionClient from "./CoursesSectionbClient";

// Define filter types
const FILTER_TYPES = ["recent", "older", "prime", "live"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

interface CoursesSectionProps {
  categorySlug: string;
  pageType: "category" | "filter";
  filterType?: FilterType;
  filterComponent: React.ReactNode;
}

const CoursesSection = async ({
  categorySlug,
  pageType,
  filterType,
  filterComponent,
}: CoursesSectionProps) => {
  let courses: any[] = [];
  let categoryName = "";

  if (pageType === "filter" && filterType) {
    // Handle filter types (recent, older, prime, live)
    switch (filterType) {
      case "recent":
        const recentCoursesResponse = await getCoursesDbCall({
          page: 1,
          limit: 24,
          sort: "desc",
        });
        courses = recentCoursesResponse?.courses ?? [];
        categoryName = "সাম্প্রতিক";
        break;

      case "older":
        const olderCoursesResponse = await getCoursesDbCall({
          page: 1,
          limit: 24,
          sort: "asc",
        });
        courses = olderCoursesResponse?.courses ?? [];
        categoryName = "পুরাতন";
        break;

      case "prime":
        courses = await getPrimeCoursesDBCall(1);
        categoryName = "প্রায়োগিক প্রাইম";
        break;

      case "live":
        courses = await getLiveCoursesDBCall(1);
        categoryName = "লাইভ কোর্স";
        break;

      default:
        courses = [];
        categoryName = "";
    }
  } else {
    // Handle category slugs
    courses = await getCategoryCoursesDBCall(categorySlug, 1);
    
    // Get category name
    const categories = await getCategoriesDBCall();
    const category = categories.find((cat) => cat.slug === categorySlug);
    categoryName = category?.name || "";
  }

  return (
    <CoursesSectionClient
      initialCourses={courses}
      categoryName={categoryName}
      filterComponent={filterComponent}
      pageType={pageType}
      categorySlug={categorySlug}
      filter={filterType}
    />
  );
};

export default CoursesSection;