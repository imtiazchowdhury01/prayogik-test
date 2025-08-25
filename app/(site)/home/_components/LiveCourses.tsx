// @ts-nocheck
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { generateMultipleBlurDataURLs } from "@/lib/blurGenerator";
import { getLiveCoursesDBCall } from "@/lib/data-access-layer/getHomeCourses";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const LiveCourses = async () => {
  const courses = await getLiveCoursesDBCall();
  if (!courses || courses.length === 0) {
    return null;
  }
  // Generate blur data URLs for all course images
  const imageUrls = courses
    ?.map((course) => course.imageUrl)
    .filter(Boolean) as string[];
  const blurDataMap = await generateMultipleBlurDataURLs(imageUrls);

  return (
    <section
      className="w-full bg-[#F3F9F9] py-16 md:py-20 "
      data-testid="our-courses-section"
    >
      <div className="app-container" data-testid="courses-container">
        <div
          className="flex items-center justify-center w-full mb-6 md:justify-between"
          data-testid="courses-header"
        >
          <div>
            <h2 className="font-bold  md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
              লাইভ কোর্সসমূহ
            </h2>
            <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              ইন-ডিমান্ড ও ফিউচার-রেডি ডিজিটাল মার্কেটিং এক্সপার্টাইজ তৈরি করুন।
              নিজেকে এগিয়ে রাখুন।
            </p>
          </div>
        </div>
        {/* course card-- */}
        <div className="grid grid-cols-1 gap-6 md:gap-y-[50px] gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses?.length > 0 &&
            courses?.map((data, ind) => {
              return (
                <CourseCard
                  variant="light"
                  key={ind}
                  course={data}
                  instructor={data?.teacherProfile?.user?.name}
                  blurDataURL={
                    data.imageUrl ? blurDataMap[data.imageUrl] : undefined
                  }
                />
              );
            })}
        </div>
        {courses?.length === 0 && (
          <div
            className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14"
            data-testid="no-courses"
          >
            <h3 className="mb-2 text-xl font-semibold">
              কোনো কোর্স পাওয়া যায়নি
            </h3>
          </div>
        )}

        {/* see more button for both */}
        <div className="flex items-center justify-center mt-12">
          {courses?.length >= 8 && (
            <Link href="/courses">
              <Button
                variant={"outline"}
                className="text-gray-700 border-gray-300 transition-all duration-300 py-4 h-12 md:flex bg-transparent"
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

export default LiveCourses;
