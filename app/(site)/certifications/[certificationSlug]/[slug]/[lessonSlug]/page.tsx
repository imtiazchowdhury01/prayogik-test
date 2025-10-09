import { Suspense } from "react";

import { TabProvider } from "@/hooks/use-tab";

import LessonSkeleton from "@/app/(course)/courses/[slug]/[lessonSlug]/loading";
import BreadcrumbWrapper from "@/app/(course)/courses/[slug]/[lessonSlug]/_components/BreadcrumbWrapper";
import CertificationLessonContent from "./_components/certification-lesson-content";
import CertificationBreadcrumbWrapper from "./_components/certification-breadcrumb-wrapper";

export default function CourseLessonPage({
  params,
}: {
  params: { slug: string; lessonSlug: string; certificationSlug: string };
}) {
  const { slug, lessonSlug, certificationSlug } = params;

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
            <CertificationBreadcrumbWrapper slug={certificationSlug} />
          </Suspense>
        </div>
      </div>

      {/* Layout with streaming content */}
      <TabProvider>
        <Suspense fallback={<LessonSkeleton />}>
          <CertificationLessonContent
            certificationSlug={certificationSlug}
            slug={slug}
            lessonSlug={lessonSlug}
          />
        </Suspense>
      </TabProvider>
    </div>
  );
}
