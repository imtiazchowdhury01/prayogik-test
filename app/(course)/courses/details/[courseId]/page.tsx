// @ts-nocheck

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CheckoutCard from "../_components/checkout-card";
import CourseDetails from "../_components/course-details";
import RelativeCourse from "../_components/relative-course";
import { getServerUserSession } from "@/lib/getServerUserSession";

export const revalidate = 60;

const getCourse = async (courseId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch the course data.");
    }

    return await response.json();
  } catch (error) {
    console.error("getCourse", error.message);
    return {
      error: true,
      message: error.message,
    };
  }
};

const Page = async ({ params }) => {
  const { courseId } = params;
  const { userId } = await getServerUserSession();

  const course = await getCourse(courseId);

  if (!course) {
    return null;
  }

  const coursePrice = course?.price || 0;

  return (
    <div className="mx-auto max-w-7xl p-6 lg:px-8">
      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-14">
        {/* Main Section */}
        <div className="flex-1">
          <h1 className="hidden md:block mt-2 text-3xl font-bold">
            {course.title}
          </h1>
          <div className="flex mt-6 md:mt-5">
            <CourseDetails course={course} />
          </div>
        </div>

        {/* Checkout Card - Only show if the user is logged in */}
        <div className="w-full md:w-1/3 lg:w-96 mx-auto sm:mx-0">
          <h1 className="md:hidden mt-2 mb-10 text-3xl font-bold">
            {course.title}
          </h1>
          <CheckoutCard
            userId={userId || ""}
            course={{ ...course, price: coursePrice }}
          />
        </div>
      </div>

      {/* Relative Courses */}
      <div className="my-10 md:my-16">
        <RelativeCourse
          categoryId={course.categoryId || ""}
          currentCourseId={params.courseId || ""}
        />
      </div>
    </div>
  );
};

export default Page;
