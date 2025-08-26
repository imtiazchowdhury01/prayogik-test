
import {
  getCategoriesDBCall,
  getCategoryCoursesCountDBCall,
  getCategoryCoursesDBCall,
} from "@/lib/data-access-layer/categories";
import { getPrimeCoursesByCategoryDBCall } from "@/lib/data-access-layer/course";
import React from "react";
import CategoriesWrapper from "../../_components/CategoryWrapper";
import type { Metadata, ResolvingMetadata } from "next";
import { CategoryFilterSelect } from "../../../_components/SelectFilterOption";

// Define filter types
const FILTER_TYPES = ["recent", "older", "prime"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

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
              const primeCourses = await getPrimeCoursesByCategoryDBCall(category.slug, 1);
              hasFilteredCourses = primeCourses && primeCourses.length > 0;
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
  };
  
  const filterLabel = filterLabels[filter as FilterType];
  
  return {
    title: `${category.name} Courses | Online Learning in Bangla | Prayogik`,
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
  
  let courses: any[];
  
  switch (filter as FilterType) {
    case "recent":
      // Get category courses and sort by creation date (recent first)
      const recentCourses = await getCategoryCoursesDBCall(categorySlug, 1); // Initial load: page 1, 24 courses
      courses = recentCourses.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
      
    case "older":
      // Get category courses and sort by creation date (older first)
      const olderCourses = await getCategoryCoursesDBCall(categorySlug, 1); // Initial load: page 1, 24 courses
      courses = olderCourses.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
      
    case "prime":
      // Get prime courses for this specific category
      courses = await getPrimeCoursesByCategoryDBCall(categorySlug, 1); // Initial load: page 1, 24 courses
      break;
      
    default:
      courses = [];
  }
  
  return (
    <CategoriesWrapper
      courses={courses}
      categories={categories}
      categoryName={category.name}
      filterComponent={
        <CategoryFilterSelect categorySlug={categorySlug} />
      }
      pageType="category-filter"
      categorySlug={categorySlug}
      filter={filter}
    />
  );
};

export default CategoryFilterPage;