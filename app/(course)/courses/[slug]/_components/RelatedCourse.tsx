// @ts-nocheck
import CourseCard from "@/components/CourseCard";
import MoreBtn from "@/components/more-btn";
import { getCoursesDbCall } from "@/lib/data-access-layer/course";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import React from "react";

const RelatedCourse = async ({ course, blurDataURL }) => {
  const { courses } = await getCoursesDbCall({
    category: course.category?.slug,
    limit: 6,
  });

  const relatedCourses = courses?.filter((v) => v?.id !== course?.id) || [];

  if (relatedCourses.length === 0) return null;

  return (
    <section className="mb-16" id="related-courses">
      <div className="flex items-center justify-between w-full mb-4">
        <h4 className="text-xl font-bold text-fontcolor-title">
          রিলেটেড কোর্স
        </h4>
        {relatedCourses?.length > 3 && (
          <MoreBtn
            href={`/courses?category=${course.category?.slug}`}
            title="আরো দেখুন"
            variant="underline"
            className="hidden md:flex"
          />
        )}
      </div>
      {/*  */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
        {relatedCourses?.slice(0, 3).map((item) => {
          return (
            <CourseCard
              key={item.id}
              variant="light"
              course={item}
              userId={null}
              instructor={item?.teacherProfile?.user?.name}
              className="rounded-b-lg shadow-sm"
              blurDataURL={blurDataURL}
            />
          );
        })}
      </div>
    </section>
  );
};

export default RelatedCourse;
