// //@ts-nocheck
// import LessonWrapperLayout from "./_components/lesson-wrapper-layout";
// import { fetchCourseAndLesson } from "./_actions/fetchCourseAndLesson";
// import CourseBreadCrumb from "../_components/CourseBreadCrumb";
// import { checkCourseAccess } from "@/actions/get-course-access";
// import { redirect } from "next/navigation";
// import { TabProvider } from "@/hooks/use-tab";

// export default async function CourseLessonPage({
//   params,
// }: {
//   params: { slug: string; lessonSlug: string };
// }) {
//   const { slug, lessonSlug } = params;

//   const {
//     course,
//     currentLesson,
//     lessons,
//     nextLesson,
//     studentProfileId,
//     userId,
//   } = await fetchCourseAndLesson(slug, lessonSlug);

//   // Unauthenticated user redirect to course details page
//   if (!userId || !course) {
//     return redirect(`/courses/${slug}`);
//   }

//   // Check access
//   const accessResponse = await checkCourseAccess(slug, userId);
//   if (!accessResponse?.access) {
//     return redirect(`/courses/${slug}`);
//   }

//   return (
//     <div>
//       {/* breadcrumbs */}
//       <div className="border-b border-gray-100 py-6">
//         <div className="max-w-7xl mx-auto px-2 md:px-2 lg:px-6 xl:px-6 2xl:px-0">
//           <CourseBreadCrumb title={course?.title} />
//         </div>
//       </div>
//       {/* Layout */}
//       <TabProvider>
//         <LessonWrapperLayout
//           course={course}
//           lessons={lessons}
//           initialLesson={currentLesson}
//           nextLesson={nextLesson}
//           studentProfileId={studentProfileId}
//           currentLessonSlug={lessonSlug}
//           courseSlug={slug}
//           userId={userId}
//         />
//       </TabProvider>
//     </div>
//   );
// }

import { Suspense } from "react";
import LessonSkeleton from "./loading";

import { TabProvider } from "@/hooks/use-tab";
import BreadcrumbWrapper from "./_components/BreadcrumbWrapper";
import LessonContent from "./_components/lesson-content";

export default function CourseLessonPage({
  params,
}: {
  params: { slug: string; lessonSlug: string };
}) {
  const { slug, lessonSlug } = params;

  return (
    <div>
      {/* Breadcrumbs - can render immediately with params */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-2 md:px-2 lg:px-6 xl:px-6 2xl:px-0">
          <Suspense
            fallback={
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
            }
          >
            <BreadcrumbWrapper slug={slug} />
          </Suspense>
        </div>
      </div>

      {/* Layout with streaming content */}
      <TabProvider>
        <Suspense fallback={<LessonSkeleton />}>
          <LessonContent slug={slug} lessonSlug={lessonSlug} />
        </Suspense>
      </TabProvider>
    </div>
  );
}
