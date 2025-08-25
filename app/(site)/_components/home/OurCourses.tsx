// @ts-nocheck
import { getProgress } from "@/actions/get-progress";
import CourseCard from "@/components/CourseCard";
import MoreBtn from "@/components/more-btn";
import { Button } from "@/components/ui/button";
import { getCoursesAndPurchasedCourseIds } from "@/lib/getPurchasedCourseIds";
import { getServerUserSession } from "@/lib/getServerUserSession";
import Link from "next/link";
import React from "react";
import { ArrowRight, ChevronRight, MoveRight } from "lucide-react";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";


const OurCourses = async () => {
  const { userId } = await getServerUserSession();

  const { body: response } = await clientApi.getCoursesQuery({
    query: {
      page: 1,
      limit: 8,
    },
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });

  const courses = response.courses;
  return (
    <section
      className="w-full bg-white py-16 md:py-20"
      data-testid="our-courses-section"
    >
      <div className="app-container" data-testid="courses-container">
        <div
          className="flex items-center justify-center w-full mb-6 md:justify-between"
          data-testid="courses-header"
        >
          <div>
            <h4
              className="font-bold  md:text-left text-center text-3xl sm:text-4xl md:text-[40px]"
              data-testid="courses-title"
            >
              কোর্সসমূহ
            </h4>
            <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              ইন-ডিমান্ড ও ফিউচার-রেডি ডিজিটাল মার্কেটিং এক্সপার্টাইজ তৈরি করুন।
              নিজেকে এগিয়ে রাখুন।
            </p>
          </div>
        </div>
        {/* course card-- */}
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-testid="courses-grid"
        >
          {courses?.length > 0 &&
            courses?.map((data, ind) => {
              return (
                <CourseCard
                  variant="light"
                  key={ind}
                  course={data}
                  userId={userId}
                  instructor={data?.teacherProfile?.user?.name}
                  data-testid={`course-card-${ind}`}
                />
              );
            })}
        </div>
        {courses?.length === 0 && (
          <div
            className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14"
            data-testid="no-courses"
          >
            <h3 className="mb-2 text-xl font-semibold text-white">
              দুঃখিত! কোনো কোর্স পাওয়া যায়নি
            </h3>
          </div>
        )}

        {/* see more button for both */}
        <div className="flex items-center justify-center mt-12">
          {courses?.length >= 8 && (
            <Link href="/courses">
              <Button
                variant={"primary"}
                className="bg-secondary-button transition-all duration-300 hover:bg-secondary-button hover:opacity-85 py-4 h-12 md:flex"
                data-testid="more-button-desktop"
              >
                কোর্সগুলো দেখুন{" "}
                <ArrowRight className="w-5 h-5 ml-1 font-extralight" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurCourses;
