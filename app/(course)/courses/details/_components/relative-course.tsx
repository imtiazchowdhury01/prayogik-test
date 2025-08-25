import { getRelatedCourses } from "@/actions/get-related-courses";
import SingleCourse from "@/components/SingleCourse";
import { Button } from "@/components/ui/button";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function RelativeCourse({
  categoryId,
  currentCourseId,
}: {
  categoryId?: string;
  currentCourseId?: string;
}) {
  const { userId } = await getServerUserSession();

  
  if (!categoryId || !currentCourseId) {
    return <p>Category ID or Current Course ID is missing.</p>;
  }

  
  const courses = await getRelatedCourses({
    userId,
    categoryId,
    currentCourseId,
  });

  return (
    <div>
      {courses && courses.length > 0 && (
        <div className="space-y-8 md:space-y-12">
          <h3 className="text-xl md:text-xl font-bold text-950 mb-5 md:mb-7">
            রিলেটেড কোর্স
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {courses.slice(0, 3).map((course, index) => (
              <SingleCourse userId={userId} course={course} key={course.id} />
            ))}
          </div>
          {courses && courses.length > 5 && (
            <div className="text-center">
              <Link href={`/courses/category?page=${1}`}>
                <Button className="mx-auto flex gap-2 border-teal-600 hover:bg-white bg-white border hover:opacity-70 font-bold text-teal-600">
                  আরও দেখুন
                  <ArrowRight className="w-4 h-4 stroke-teal-600" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
