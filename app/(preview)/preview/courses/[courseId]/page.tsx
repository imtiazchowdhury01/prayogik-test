// @ts-nocheck
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatDuration } from "@/lib/formatDuration";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SectionNavigation from "../../../../(course)/courses/[slug]/_components/SectionNavigation";
import CourseOverview from "../../../../(course)/courses/[slug]/_components/CourseOverview";
import Syllabas from "../../../../(course)/courses/[slug]/_components/Syllabas";
import Sidebar from "../../../../(course)/courses/[slug]/_components/sidebar";
import TeacherIntro from "../../../../(course)/courses/[slug]/_components/TeacherIntro";
import RelatedCourse from "../../../../(course)/courses/[slug]/_components/RelatedCourse";
import BecomeAProMember from "../../../../(course)/courses/[slug]/_components/BecomeAProMember";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { fetchSubscriptionDisounts } from "@/services";
import { fetchUserSubscription } from "@/services/user";
import { getCourseByCourseIdForPreview } from "@/actions/get-course-by-slug";
import BecomeAProMemberMock from "../../_components/BecomeAProMemberMock";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

// Generate metadata for this page
export async function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  return {
    robots: {
      index: false, // Prevent search engines from indexing this preview page
      follow: false, // Don't follow links on this page
      noarchive: true, // Don't cache this page
      nosnippet: true, // Don't show snippets in search results
      noimageindex: true, // Don't index images on this page
      nocache: true, // Don't cache this page
      noindex: true, // Additional explicit no-index directive
    },
    other: {
      google: "nositelinkssearchbox",
      "google-translate": "notranslate",
      robots: "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache",
    },
  };
}

const CoursePreview = async ({ params }: { params: { courseId: string } }) => {
  const { isAdmin, userId } = await getServerUserSession();

  if (!userId) return notFound();

  const teacherProfile = await db.teacherProfile.findUnique({
    where: {
      userId: userId, // Getting the teacher profile using userId
    },
  });

  let teacherProfileId = teacherProfile?.id;

  const teacherOrCoTeacherAccess = await db.course.findUnique({
    where: {
      id: params.courseId,
      OR: [
        {
          teacherProfileId,
        },
        {
          coTeacherIds: {
            hasSome: [teacherProfileId],
          },
        },
      ],
    },
  });

  if (!teacherOrCoTeacherAccess && !isAdmin) return notFound();

  const course = await getCourseByCourseIdForPreview(params?.courseId);

  const salesData = await fetchSubscriptionDisounts();
  const subscriptionsData = await fetchUserSubscription();

  return (
    <section className="min-h-[70vh] w-full">
      <div className="relative flex flex-col items-start lg:space-x-12 lg:flex-row app-container">
        {/* left grid-- */}
        <div className="w-full mt-6 sm:mt-8 lg:w-8/12">
          <Breadcrumb className="py-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <div className="text-sm font-medium underline sm:text-base text-fontcolor-title">
                    হোম
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <div className="text-sm font-medium underline sm:text-base text-fontcolor-title">
                    কোর্স
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <div className="text-sm font-medium underline sm:text-base text-fontcolor-title">
                    {course?.category?.name}
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-fontcolor-description sm:text-base">
                  {textLangChecker(course?.title)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <h2 className="mt-4  text-3xl sm:text-4xl leading-[1.6] font-bold text-fontcolor-title">
              {textLangChecker(course?.title)}
            </h2>
            <p className="my-3 text-base text-fontcolor-description">
              ইন্সট্রাক্টর{" "}
              <span className="text-base font-bold text-fontcolor-title">
                {textLangChecker(course?.teacherProfile?.user?.name)},{" "}
              </span>{" "}
              {course?.teacherProfile?.yearsOfExperience && (
                <span>
                  {convertNumberToBangla(
                    course?.teacherProfile?.yearsOfExperience.split(" ")[0]
                  )}{" "}
                  বছরের অভিজ্ঞতা সম্পন্ন
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {course?.enrolledStudents.length > 0 && (
              <>
                <div className="flex  space-x-[6px]">
                  <Image
                    src={"/icon/user.svg"}
                    alt="user-icon"
                    width={0}
                    height={0}
                    sizes="16px"
                  />
                  <p className="text-base text-fontcolor-description">
                    {convertNumberToBangla(course?.enrolledStudents.length)} জন
                    নবীন শিক্ষার্থী
                  </p>
                </div>
                <Separator className="w-[1px] h-4" orientation="vertical" />
              </>
            )}
            {course?.totalDuration ? (
              <>
                <div className="flex  space-x-[6px]">
                  <Image
                    src={"/icon/clock.svg"}
                    alt="user-icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-base text-fontcolor-description">
                    {formatDuration(course?.totalDuration)}
                  </p>
                </div>
                <Separator className="w-[1px] h-4" orientation="vertical" />
              </>
            ) : null}

            <div className="flex space-x-[6px]">
              <Image
                src={"/icon/book-gray.svg"}
                alt="user-icon"
                width={0}
                height={0}
                sizes="16px"
              />
              <p className="text-base text-fontcolor-description">
                {convertNumberToBangla(course?.lessons.length)} টি লেসন
              </p>
            </div>
            {/* <Separator className="w-[1px] h-4" orientation="vertical" /> */}
            {/* <div className="flex  space-x-[6px]">
              <Image
                src={"/icon/certificate.svg"}
                alt="user-icon"
                width={16}
                height={16}
              />
              <p className="text-base text-fontcolor-description">প্রফেশনাল সার্টিফিকেট </p>
            </div> */}
          </div>
          <SectionNavigation course={course} />
          <CourseOverview course={course} />
          <section id="other-facilities">
            {course.learningOutcomes.length > 0 ? (
              <>
                <h4 className="mb-4 text-xl font-bold text-fontcolor-title">
                  কোর্স আউটকাম
                </h4>
                <div className="grid grid-cols-1 gap-4 rounded-md">
                  {course.learningOutcomes.map((outcome: any) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Image
                          src={"/icon/tick-circle.svg"}
                          alt={"check-icon"}
                          width={20}
                          height={20}
                        />
                        <p className="text-base font-medium text-fontcolor-description">
                          {outcome}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}

            {course.requirements.length > 0 ? (
              <>
                <h4 className="mt-7 mb-4 text-xl font-bold text-fontcolor-title">
                  কোর্স রিকোয়ারমেন্ট
                </h4>
                <div className="grid grid-cols-1 gap-4 rounded-md">
                  {course.requirements.map((req: any) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Image
                          src={"/icon/tick-circle.svg"}
                          alt={"check-icon"}
                          width={20}
                          height={20}
                        />
                        <p className="text-base font-medium text-fontcolor-description">
                          {req}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}

            {course.learningOutcomes.length === 0 &&
              course.requirements.length === 0 && (
                <>
                  <h4 className="mt-7 mb-4 text-2xl font-bold text-fontcolor-title">
                    কোর্স আউটকাম এবং রিকোয়ারমেন্ট
                  </h4>

                  <EmptyState
                    title="কোর্স আউটকাম এবং রিকোয়ারমেন্ট নেই"
                    icons={[FileText]}
                    description="অনুগ্রহপূর্বক কোর্স আউটকাম এবং রিকোয়ারমেন্ট যোগ করুন"
                  />
                </>
              )}
          </section>
          <Syllabas course={course} />
          <div className="block w-full lg:hidden">
            <Sidebar
              course={course}
              access={false}
              userId={null}
              lesson={course.lessons}
            />
            <BecomeAProMember />
          </div>
          <TeacherIntro course={course} />
          {/* <RelatedSkills /> */}
          {/* <StudentFeedback /> */}
          {/* <Faq /> */}
        </div>
        {/* right grid-- */}
        <div className="hidden w-full mt-8 mb-16 lg:block lg:top-20 lg:sticky lg:w-4/12">
          <Badge>Preview Mode</Badge>
          <Sidebar
            course={course}
            access={false}
            userId={null}
            lesson={course.lessons}
            salesData={salesData}
            subscriptionsData={subscriptionsData}
            preview={true}
          />
          <BecomeAProMember />
        </div>
      </div>
    </section>
  );
};

export default CoursePreview;
