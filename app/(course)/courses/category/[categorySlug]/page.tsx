

// @ts-nocheck
import {
  getCategoriesDBCall,
  getCategoryCoursesCountDBCall,
  getCategoryCoursesDBCall,
} from "@/lib/data-access-layer/categories";
import {
  getPrimeCoursesDBCall,
  getCoursesDbCall,
} from "@/lib/data-access-layer/course";
import React from "react";
import CategoriesWrapper from "../_components/CategoryWrapper";
import type { Metadata, ResolvingMetadata } from "next";
import {
  CategoryFilterSelect,
  GeneralFilterSelect,
} from "../../_components/SelectFilterOption";

// Define filter types
const FILTER_TYPES = ["recent", "older", "prime"] as const;
type FilterType = (typeof FILTER_TYPES)[number];
// Test category data array extracted from seed
const TEST_CATEGORIES = [
  // Parent categories with children
  {
    slug: "digital-marketing",
    name: "ডিজিটাল মার্কেটিং",
    isChild: false,
    hasChildren: true,
  },
  {
    slug: "seo",
    name: "সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)",
    isChild: true,
    parentSlug: "digital-marketing",
  },
  {
    slug: "social-media-marketing",
    name: "সোশ্যাল মিডিয়া মার্কেটিং (SMM)",
    isChild: true,
    parentSlug: "digital-marketing",
  },
  {
    slug: "content-marketing",
    name: "কন্টেন্ট মার্কেটিং",
    isChild: true,
    parentSlug: "digital-marketing",
  },
  {
    slug: "email-marketing",
    name: "ইমেইল মার্কেটিং",
    isChild: true,
    parentSlug: "digital-marketing",
  },
  {
    slug: "content-strategy",
    name: "কনটেন্ট স্ট্রাটেজি",
    isChild: true,
    parentSlug: "digital-marketing",
  },
  {
    slug: "affiliate-marketing",
    name: "অ্যাফিলিয়েট মার্কেটিং",
    isChild: true,
    parentSlug: "digital-marketing",
  },

  {
    slug: "web-development",
    name: "ওয়েব ডেভেলপমেন্ট",
    isChild: false,
    hasChildren: true,
  },
  {
    slug: "frontend-development",
    name: "ফ্রন্ট-এন্ড ডেভেলপমেন্ট",
    isChild: true,
    parentSlug: "web-development",
  },
  {
    slug: "backend-development",
    name: "ব্যাক-এন্ড ডেভেলপমেন্ট",
    isChild: true,
    parentSlug: "web-development",
  },
  {
    slug: "fullstack-development",
    name: "ফুল-স্ট্যাক ডেভেলপমেন্ট",
    isChild: true,
    parentSlug: "web-development",
  },
  {
    slug: "wordpress-development",
    name: "ওয়ার্ডপ্রেস ডেভেলপমেন্ট",
    isChild: true,
    parentSlug: "web-development",
  },
  {
    slug: "web-design-development",
    name: "ওয়েব ডিজাইন ও ডেভেলপমেন্ট",
    isChild: true,
    parentSlug: "web-development",
  },

  { slug: "design", name: "ডিজাইন", isChild: false, hasChildren: true },
  {
    slug: "graphics-design",
    name: "গ্রাফিক্স ডিজাইন",
    isChild: true,
    parentSlug: "design",
  },
  {
    slug: "uiux-design",
    name: "UI/UX ডিজাইন",
    isChild: true,
    parentSlug: "design",
  },
  {
    slug: "logo-design",
    name: "লোগো ডিজাইন",
    isChild: true,
    parentSlug: "design",
  },
  {
    slug: "web-design",
    name: "ওয়েব ডিজাইন",
    isChild: true,
    parentSlug: "design",
  },
  {
    slug: "motion-graphics-design",
    name: "মোশন গ্রাফিক্স ডিজাইন",
    isChild: true,
    parentSlug: "design",
  },
  {
    slug: "animation",
    name: "অ্যানিমেশন",
    isChild: true,
    parentSlug: "design",
  },
  {
    slug: "video-editing",
    name: "ভিডিও এডিটিং",
    isChild: true,
    parentSlug: "design",
  },

  // Standalone categories
  {
    slug: "android-development",
    name: "এন্ড্রোইড ডেভেলপমেন্ট",
    isChild: false,
    hasChildren: false,
  },
  {
    slug: "social-media",
    name: "সোশ্যাল মিডিয়া",
    isChild: false,
    hasChildren: false,
  },
  { slug: "business", name: "বিজনেস", isChild: false, hasChildren: false },
  {
    slug: "data-analytics",
    name: "ডাটা অ্যানালিটিক্স",
    isChild: false,
    hasChildren: false,
  },
];
// Generate static params only for categories that have courses AND filter types
export async function generateStaticParams() {
  const categories = await TEST_CATEGORIES;
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

  // Check if it's a filter type
  if (FILTER_TYPES.includes(slug as FilterType)) {
    return await handleFilterType(slug as FilterType);
  }

  // Handle as category slug (existing logic)
  return await handleCategorySlug(slug);
};

// Handle filter types (recent, older, prime)
async function handleFilterType(filterType: FilterType) {
  let courses;
  let categories: any[];

  switch (filterType) {
    case "recent":
      const [recentCoursesResponse, recentCategories] = await Promise.all([
        getCoursesDbCall({
          page: 1,
          limit: 24, // Initial load: 24 courses
          sort: "desc", // Recent first
        }),
        getCategoriesDBCall(),
      ]);
      courses = recentCoursesResponse?.courses ?? [];
      categories = recentCategories;
      break;

    case "older":
      const [olderCoursesResponse, olderCategories] = await Promise.all([
        getCoursesDbCall({
          page: 1,
          limit: 24, // Initial load: 24 courses
          sort: "asc", // Older first
        }),
        getCategoriesDBCall(),
      ]);
      courses = olderCoursesResponse?.courses ?? [];
      categories = olderCategories;
      break;

    case "prime":
      const [primeCategories, primeCourses] = await Promise.all([
        getCategoriesDBCall(),
        getPrimeCoursesDBCall(1), // Pass page 1 for initial load
      ]);
      courses = primeCourses;
      categories = primeCategories;
      break;

    default:
      courses = [];
      categories = [];
  }

  // Get category name in Bangla
  const getCategoryName = (filter: FilterType): string => {
    const nameMap = {
      recent: "সাম্প্রতিক",
      older: "পুরাতন",
      prime: "প্রায়োগিক প্রাইম",
    };
    return nameMap[filter];
  };

  return (
    <CategoriesWrapper
      courses={courses}
      categories={categories}
      categoryName={getCategoryName(filterType)}
      filterComponent={<GeneralFilterSelect currentFilter={filterType} />}
      pageType="filter"
      filter={filterType}
    />
  );
}

// Handle category slugs (existing logic)
async function handleCategorySlug(categorySlug: string) {
  const courses = await getCategoryCoursesDBCall(categorySlug, 1); // Pass page 1 for initial load
  const categories = await getCategoriesDBCall();

  const categoryName = categories.find(
    (category) => category.slug === categorySlug
  )?.name;

  return (
    <CategoriesWrapper
      courses={courses}
      categories={categories}
      categoryName={categoryName}
      filterComponent={<CategoryFilterSelect categorySlug={categorySlug} />}
      pageType="category"
      categorySlug={categorySlug}
    />
  );
}

export default CategorySlugPage;
