import { Suspense } from "react";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CourseForm } from "../../../teacher/courses/[courseId]/_components/course-form";
import { CourseSkeleton } from "../../../teacher/courses/[courseId]/_components/course-skeleton";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { isAdmin, userId } = await getServerUserSession();

  // If no user is logged in, redirect to home page
  if (!userId || !isAdmin) {
    return redirect("/");
  }

  return (
    <>
      <div className="mt-4">
        <Link
          href={`/admin/courses`}
          className="w-fit flex items-center mb-6 text-sm transition hover:opacity-75"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to courses
        </Link>

        <Suspense fallback={<CourseSkeleton />}>
          <CourseForm
            courseId={params.courseId}
            userId={userId}
            isAdmin={isAdmin}
          />
        </Suspense>
      </div>
    </>
  );
};

export default CourseIdPage;
