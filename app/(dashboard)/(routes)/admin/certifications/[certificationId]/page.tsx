import React from "react";
import { Suspense } from "react";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CourseSkeleton } from "../../../teacher/courses/[courseId]/_components/course-skeleton";
import { CertificationCourseForm } from "../../../teacher/_certifications/[certificationId]/_components/certification-course-form";

const EditCertificationCoursePage = async ({
  params,
}: {
  params: { certificationId: string };
}) => {
  const { isAdmin, userId } = await getServerUserSession();

  // If no user is logged in, redirect to home page
  if (!userId || !isAdmin) {
    return redirect("/");
  }

  return (
    <>
      <div className="mt-4">
        <Link
          href={`/admin/certifications`}
          className="w-fit flex items-center mb-6 text-sm transition hover:opacity-75"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to certification
        </Link>

        <Suspense fallback={<CourseSkeleton />}>
          <CertificationCourseForm
            courseId={params.certificationId}
            userId={userId}
            isAdmin={isAdmin}
          />
        </Suspense>
      </div>
    </>
  );
};

export default EditCertificationCoursePage;
