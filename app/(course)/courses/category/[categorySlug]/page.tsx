// @ts-nocheck
import {
  getCategoriesDBCall,
  getCategoryCoursesCountDBCall,
  getCategoryCoursesDBCall,
} from "@/lib/data-access-layer/categories";
import React from "react";
import CategoriesWrapper from "../_components/CategoryWrapper";
import type { Metadata, ResolvingMetadata } from "next";

// Generate static params only for categories that have courses
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

  return params;
}

// Generate metadata for category pages
export async function generateMetadata(
  { params }: { params: { categorySlug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.categorySlug;

  // Get category name for title
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
  const categorySlug = params.categorySlug;

  // Get courses and categories
  const [courses, categories] = await Promise.all([
    getCategoryCoursesDBCall(categorySlug, 1), // Pass page 1 for initial load
    getCategoriesDBCall(),
  ]);

  // Find category name
  const categoryName = categories.find(
    (category) => category.slug === categorySlug
  )?.name;

  return (
    <CategoriesWrapper
      courses={courses}
      categories={categories}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
};

export default CategorySlugPage;