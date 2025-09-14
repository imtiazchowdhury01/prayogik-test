import {
  getCategoryCoursesDBCall,
} from "@/lib/data-access-layer/categories";
import { 
  getPrimeCoursesDBCall, 
  getCoursesDbCall,
  getLiveCoursesDBCall,
  getPrimeCoursesByCategoryDBCall,
  getCategoryLiveCoursesDBCall
} from "@/lib/data-access-layer/course";


import CategoryCoursesClientSection from "./CategoryCoursesClientSection";
import { NoResultsMessage } from "../../../_components/NoResultsMessage";
import CoursesGrid from "../../../_components/CoursesGrid";


const FILTER_TYPES = ["recent", "older", "prime", "live"] as const;

type FilterType = (typeof FILTER_TYPES)[number];

interface CategoryCoursesSectionProps {
  categorySlug: string;
  pageType: "category" | "filter" | "category-filter";
  filter?: FilterType
}



// Data fetching function for filter types
async function fetchFilterTypeCourses(filterType: FilterType) {
  let courses: any;

  switch (filterType) {
    case "recent":
      const recentResponse = await getCoursesDbCall({
        page: 1,
        limit: 24,
        sort: "desc",
      });
      courses = recentResponse?.courses ?? [];
      break;

    case "older":
      const olderResponse = await getCoursesDbCall({
        page: 1,
        limit: 24,
        sort: "asc",
      });
      courses = olderResponse?.courses ?? [];
      break;

    case "prime":
      courses = await getPrimeCoursesDBCall(1);
      break;

    case "live":
      courses = await getLiveCoursesDBCall(1);
      break;

    default:
      courses = [];
  }

  return courses;
}

// Data fetching function for category-specific filter courses
async function fetchCategoryFilterCourses(categorySlug: string, filter: FilterType) {
  let courses: any;

  switch (filter) {
    case "recent":
      const recentCourses = await getCategoryCoursesDBCall(categorySlug, 1);
      courses = recentCourses.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;

    case "older":
      const olderCourses = await getCategoryCoursesDBCall(categorySlug, 1);
      courses = olderCourses.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;

    case "prime":
      courses = await getPrimeCoursesByCategoryDBCall(categorySlug, 1);
      break;

    case "live":
      courses = await getCategoryLiveCoursesDBCall(categorySlug, 1);
      break;

    default:
      courses = [];
  }

  return courses;
}

// Data fetching function for category courses
async function fetchCategoryCourses(categorySlug: string) {
  return await getCategoryCoursesDBCall(categorySlug, 1);
}

const CategoryCoursesSection = async ({ categorySlug, pageType, filter }: CategoryCoursesSectionProps) => {
  let courses;
  
  if (pageType === "filter") {
    courses = await fetchFilterTypeCourses(categorySlug as FilterType);
  } 
  else if (pageType === "category-filter" && filter) {
    // Category-specific filter pages (e.g., /courses/programming/recent)
    courses = await fetchCategoryFilterCourses(categorySlug, filter as FilterType);
  }
  else {
    courses = await fetchCategoryCourses(categorySlug);
  }

  if (!courses || courses.length === 0) {
    return <NoResultsMessage />;
  }

  const hasMore = courses.length === 24; // Determine if there might be more courses

  return (
    <>
      {/* Server-rendered courses grid for SEO */}
      <CoursesGrid courses={courses} />
      
      {/* Client component for load more functionality */}
      <CategoryCoursesClientSection 
        categorySlug={categorySlug}
        pageType={pageType}
        initialPage={1}
        hasMore={hasMore}
      />
    </>
  );
};

export default CategoryCoursesSection;