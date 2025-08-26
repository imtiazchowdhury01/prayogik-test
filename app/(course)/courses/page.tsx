

import CourseWrapper from "./_components/CourseWrapper";
import type { Metadata } from "next";
import { getCoursesDbCall } from "@/lib/data-access-layer/course";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";

export const metadata: Metadata = {
  title: "New Online Courses | Learn Practical Skills in Bangla | Prayogik",
  description:
    "Discover the latest online courses to boost your skills. Learn practical, career-focused topics through short and simple lessons — all in Bangla, only on Prayogik.",
};
const AllCourses = async () => {
  const [response, categories]: any = await Promise.all([
    getCoursesDbCall({
      page: 1,
      sort: "desc",
      limit: 24,
    }),
    getCategoriesDBCall(),
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
