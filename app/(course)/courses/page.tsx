import CourseWrapper from "./_components/CourseWrapper";
import type { Metadata } from "next";
import { fetchCategories } from "@/services";
import { clientApi } from "@/lib/utils/openai/client";

export const metadata: Metadata = {
  title: "New Online Courses | Learn Practical Skills in Bangla | Prayogik",
  description:
    "Discover the latest online courses to boost your skills. Learn practical, career-focused topics through short and simple lessons — all in Bangla, only on Prayogik.",
};

interface SearchParams {
  page?: number;
  category?: string;
  sort?: "asc" | "desc";
  search?: string;
  limit?: number;
}

interface CategoryPageProps {
  searchParams: SearchParams;
}
const AllCourses = async ({ searchParams }: CategoryPageProps) => {
  const [{ body: response }, categories]: any = await Promise.all([
    clientApi.getCoursesQuery({
      query: {
        title: searchParams.search,
        category: searchParams.category,
        page: searchParams.page,
        sort: searchParams.sort,
        limit: searchParams.limit || 24,
      },
      fetchOptions: {
        cache: "force-cache",
      },
    }),
    fetchCategories(),
  ]);

  const courses = response?.courses;

  return (
    <CourseWrapper
      courses={courses}
      pagination={response?.pagination}
      categories={categories}
    />
  );
};

export default AllCourses;
