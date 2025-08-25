// @ts-nocheck
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import SingleCourse from "@/components/SingleCourse";
import Link from "next/link";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "@/actions/get-progress";
import { getCoursesAndPurchasedCourseIds } from "@/lib/getPurchasedCourseIds";

const FeaturedCourses = async () => {
  const { userId } = await getServerUserSession();

  const { courses, purchasedCourseIds } = await getCoursesAndPurchasedCourseIds(
    userId,
    "home" //current route
  );

  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progress = purchasedCourseIds.includes(course?.id)
        ? await getProgress(userId, course?.id)
        : null;
      return { ...course, progress };
    })
  );
  return (
    <div>
      {userId ? (
        <section>
          {coursesWithProgress.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="p-2 text-gray-400 border border-gray-200 rounded-md">
                কোন কোর্স পাওয়া যায়নি!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 mx-auto mt-16 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
              {coursesWithProgress.slice(0, 8).map((course, i) => (
                <SingleCourse
                  course={course}
                  key={i}
                  userId={userId}
                  purchasedCourseIds={purchasedCourseIds}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          {courses.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="p-2 text-gray-400 border border-gray-200 rounded-md">
                কোন কোর্স পাওয়া যায়নি!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 mx-auto mt-16 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
              {courses.slice(0, 8).map((course, i) => (
                <SingleCourse course={course} key={i} userId={userId} />
              ))}
            </div>
          )}
        </section>
      )}
      <div className="mt-12 text-center">
        <Link href={`/courses/category?page=1`}>
          <Button className="flex gap-2 mx-auto font-bold text-teal-600 bg-white border border-teal-600 hover:bg-white hover:opacity-70">
            আরও দেখুন
            <ArrowRight className="w-4 h-4 stroke-teal-600" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCourses;
