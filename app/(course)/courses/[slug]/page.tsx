import React from "react";
import TeacherIntro from "./_components/TeacherIntro";
import Image from "next/image";
import Syllabas from "./_components/Syllabas";
import { Separator } from "@/components/ui/separator";
import SectionNavigation from "./_components/SectionNavigation";
import CourseOverview from "./_components/CourseOverview";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatDuration } from "@/lib/formatDuration";
import BecomeAProMember from "./_components/BecomeAProMember";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getAllCoursesSlugsDBCall,
  getCourseDBCall,
} from "@/lib/data-access-layer/course";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import SingleCoursePriceTab from "./_components/single-course-price-tab";
import CourseBreadCrumb from "./_components/CourseBreadCrumb";
import RelatedCourse from "./_components/RelatedCourse";
import { CourseMode } from "@prisma/client";
import LiveCourseIcon from "@/components/LiveCourseIcon";
import LiveCourseState from "./_components/live-course-state";
import LiveScheduleDetails from "./_components/live-schedule-details";
import VideoDialog from "./_components/VideoDialog";

// Generate static params for all courses
export async function generateStaticParams() {
  try {
    const courses = await getAllCoursesSlugsDBCall();
    return courses.map((course) => ({ slug: course.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = await getCourseDBCall(params.slug);

  return {
    title: `${course?.title} কোর্স | প্রায়োগিক`,
    description: `প্রায়োগিক থেকে ${course?.title} শিখুন। হাতেকলমে প্রজেক্ট এবং বিশেষজ্ঞ নির্দেশনায় ${course?.category?.name} দক্ষতা উন্নত করুন। আধুনিক টেকনোলজি আয়ত্ত করতে এখনই এনরোল করুন!`,
  };
}

const CourseDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const course = await getCourseDBCall(params.slug);
  const allSubscription = await getSubscriptionDBCall();
  const plan = allSubscription.find((p) => p.isDefault);
  if (!course) {
    redirect("/");
  }
  
  const freeLesson = course?.lessons?.find(
    (lesson: any) => lesson.isFree && lesson.videoUrl
  );

  return (
    <section className="min-h-[70vh] w-full">
      {/* breadcrumbs */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <CourseBreadCrumb title={course?.title} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-start md:space-x-12 md:flex-row app-container">
        {/* left grid-- */}
        <div className="w-full md:mt-6 sm:mt-0 md:w-[60%] lg:w-[70%]">
          {/* -----------------on mobile screen course image and video--------  */}
          <VideoDialog course={course} freeLesson={freeLesson}>
            <div
              className={`w-full mt-6 md:hidden block ${
                !freeLesson && "pointer-events-none"
              } relative aspect-[16/9] overflow-hidden rounded-lg`}
            >
              <Image
                src={course?.imageUrl || "/default-image.jpg"}
                alt="course"
                width={0}
                height={0}
                sizes="100vw"
                className="object-cover w-full h-full rounded-lg bg-gray-50"
                quality={75}
                priority={false}
              />
              {freeLesson && (
                <button className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/icon/playvideo.svg"
                    alt="play-video-icon"
                    width={18}
                    height={22}
                  />
                </button>
              )}
            </div>
          </VideoDialog>

          <div>
            {course?.courseMode === CourseMode.LIVE && (
              <LiveCourseIcon isCourseCard={false} />
            )}
            <h2 className="mt-4 text-2xl sm:text-2xl md:text-4xl font-bold text-fontcolor-title md:leading-[3.2rem]">
              {textLangChecker(course?.title)}
            </h2>
            <p className="my-3 text-[14px] md:text-base text-fontcolor-description md:text-left text-justify">
              ইন্সট্রাক্টর{" "}
              <span className="text-base font-bold text-fontcolor-title">
                {textLangChecker(course?.teacherProfile?.user?.name)},{" "}
              </span>{" "}
              <span>
                {course?.teacherProfile?.subjectSpecializations[0]} এক্সপার্ট
                এবং{" "}
              </span>
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
            {course?.courseMode === "RECORDED" &&
              course?.enrolledStudents.length > 0 && (
                <>
                  <div className="flex items-center space-x-[6px]">
                    <Image
                      src="/icon/user.svg"
                      alt="user-icon"
                      width={15}
                      height={15}
                      className="w-4 h-4 object-contain"
                    />
                    <p className="text-base text-fontcolor-description">
                      {convertNumberToBangla(course?.enrolledStudents.length)}{" "}
                      জন নবীন শিক্ষার্থী
                    </p>
                  </div>
                  <Separator className="w-[1px] h-4" orientation="vertical" />
                </>
              )}
            {course?.totalDuration ? (
              <>
                <div className="flex items-center space-x-[6px]">
                  <Image
                    src={"/icon/clock.svg"}
                    alt="user-icon"
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                  />
                  <p className="text-base text-fontcolor-description">
                    {formatDuration(course?.totalDuration)}
                  </p>
                </div>
                <Separator className="w-[1px] h-4" orientation="vertical" />
              </>
            ) : null}

            {course?.courseMode === CourseMode.RECORDED && (
              <div className="flex items-center space-x-[6px]">
                <Image
                  src={"/icon/book-gray.svg"}
                  alt="user-icon"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
                <p className="text-base text-fontcolor-description">
                  {convertNumberToBangla(course?.lessons?.length)} টি লেসন
                </p>
              </div>
            )}
            {/* live course state */}
            {course?.courseMode === CourseMode.LIVE && (
              <LiveCourseState course={course} />
            )}
          </div>
          {/* -------------------on mobile screen ------------------- */}
          <div className="mt-10 md:bg-gray-50 md:p-4 rounded-lg md:hidden block">
            <SingleCoursePriceTab
              course={course}
              plan={plan}
              defaultDiscount={plan?.subscriptionDiscount}
            />
          </div>
          {/* tab section  */}
          <SectionNavigation course={course} />
          <CourseOverview course={course} />

          <section id="other-facilities">
            {course.learningOutcomes.length > 0 ? (
              <>
                <h4 className="mb-4 text-xl font-bold text-fontcolor-title">
                  কোর্স আউটকাম
                </h4>
                <div className="grid grid-cols-1 gap-4 rounded-md">
                  {course.learningOutcomes.map((outcome, index) => {
                    return (
                      <div key={index} className="flex items-start space-x-2">
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
                  কোর্স রিকোয়ারমেন্ট
                </h4>
                <div className="grid grid-cols-1 gap-4 rounded-md">
                  {course.requirements.map((req, index) => {
                    return (
                      <div key={index} className="flex items-start space-x-2">
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
          </section>

          {course?.courseMode === CourseMode.LIVE && (
            <LiveScheduleDetails course={course} />
          )}

          <Syllabas course={course} />
          <TeacherIntro course={course} />
          <RelatedCourse course={course} />
        </div>

        {/* right grid-- */}
        <div className="w-full md:mt-8 mb-16 md:top-20 md:sticky md:w-[40%] lg:w-[30%] md:pl-2 pl-0">
          <div className="md:mt-6 bg-gray-50 p-4 rounded-lg hidden md:block">
            <SingleCoursePriceTab
              course={course}
              plan={plan}
              defaultDiscount={plan?.subscriptionDiscount}
            />
          </div>
          {/* course details subscriptions */}
          <BecomeAProMember plan={plan} />
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsPage;
