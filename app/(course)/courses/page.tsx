// // This makes the page static at build time
// export const dynamic = 'force-static';
// import CourseWrapper from "./_components/CourseWrapper";
// import type { Metadata } from "next";
// import { fetchCategories } from "@/services";
// import { getCoursesDbCall } from "@/lib/data-access-layer/course";

// export const metadata: Metadata = {
//   title: "New Online Courses | Learn Practical Skills in Bangla | Prayogik",
//   description:
//     "Discover the latest online courses to boost your skills. Learn practical, career-focused topics through short and simple lessons — all in Bangla, only on Prayogik.",
// };

// interface SearchParams {
//   page?: number;
//   category?: string;
//   sort?: "asc" | "desc";
//   search?: string;
//   limit?: number;
// }

// interface CategoryPageProps {
//   searchParams: SearchParams;
// }
// const AllCourses = async ({ searchParams }: CategoryPageProps) => {
//   const [response, categories]: any = await Promise.all([
//     getCoursesDbCall({
//       title: searchParams.search,
//       category: searchParams.category,
//       page: Number(searchParams.page),
//       sort: searchParams.sort,
//       limit: Number(searchParams.limit) || 24,
//     }),
//     fetchCategories(),
//   ]);
//   const courses = response?.courses;
//   return (
//     <CourseWrapper
//       initalData={courses}
//       pagination={response?.pagination}
//       categories={categories}
//     />
//   );
// };

// export default AllCourses;

// ------------------------------------
// This makes the page static at build time
// export const dynamic = "force-static";
import CourseWrapper from "./_components/CourseWrapper";
import type { Metadata } from "next";
import { fetchCategories } from "@/services";
import { getCoursesDbCall } from "@/lib/data-access-layer/course";

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
const AllCourses = async () => {
  const [response, categories]: any = await Promise.all([
    getCoursesDbCall({
      page: 1,
      sort: "desc",
      limit: 24,
    }),
    fetchCategories(),
  ]);
  const courses = response?.courses;
  return (
    <CourseWrapper
      initalData={courses}
      pagination={response?.pagination}
      categories={categories}
    />
  );
};

export default AllCourses;
