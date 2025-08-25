//@ts-nocheck
"use client";
import { useParams } from "next/navigation";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatDuration } from "@/lib/formatDuration";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import StudentSidebar from "../_components/student-sidebar";
import TeacherIntro from "../../_components/TeacherIntro";
import { TabNavigation } from "../../_components/details-tab-navigation";
import { TabProvider, useTab } from "@/hooks/use-tab";
import RelatedCourse from "../../_components/RelatedCourse";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  courseResponse: any;
  userId: string;
}

const ConditionalLayoutContent = ({
  children,
  courseResponse,
}: ConditionalLayoutProps) => {
  const params = useParams();
  const { activeTab, setActiveTab } = useTab();

  // Check if we're on a lesson page (has lessonSlug parameter)
  const isLessonPage =
    params.lessonSlug && typeof params.lessonSlug === "string";

  // Static tabs - these never change
  const tabs = [
    { label: "লেসন কনটেন্ট", value: "content" },
    { label: "এটাচমেন্ট", value: "attachment" },
  ];

  // Course overview page layout (no sidebar)
  if (!isLessonPage) {
    return (
      <div className="max-w-7xl mx-auto px-2 md:px-2 lg:px-6 xl:px-6 2xl:px-0 py-6">
        {children}
      </div>
    );
  }

  // Lesson page layout (with sidebar) - PERSISTENT ELEMENTS
  return (
    <div className="flex items-center justify-between px-3.5 md:px-3.5 lg:px-6 xl:px-4 2xl:px-0 py-6 mx-auto max-w-7xl gap-x-6 sm:mt-5 md:mt-8">
      <div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-8">
        <div className="flex-[.65]">
          {/* PERSISTENT COURSE INFORMATION - Never re-renders on lesson change */}
          <div className="mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-fontcolor-title -m-1 max-sm:leading-[2.2rem]">
                {textLangChecker(courseResponse?.title)}
              </h2>
              <p
                className="my-3 text-base text-fontcolor-description"
                id="instructor-name"
              >
                ইন্সট্রাক্টর{" "}
                <span className="text-base font-bold text-fontcolor-title">
                  {textLangChecker(courseResponse?.teacherProfile?.user?.name)},{" "}
                </span>{" "}
                <span>
                  {courseResponse?.teacherProfile?.subjectSpecializations[0]}{" "}
                  এক্সপার্ট এবং{" "}
                </span>
                {courseResponse?.teacherProfile?.yearsOfExperience && (
                  <span>
                    {convertNumberToBangla(
                      courseResponse?.teacherProfile?.yearsOfExperience.split(
                        " "
                      )[0]
                    )}{" "}
                    বছরের অভিজ্ঞতা সম্পন্ন
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex space-x-[6px]">
                <Image
                  src={"/icon/book-gray.svg"}
                  alt="user-icon"
                  width={0}
                  height={0}
                  sizes="16px"
                />
                <p className="text-base text-fontcolor-description">
                  {convertNumberToBangla(courseResponse?.lessons.length)} টি
                  লেসন
                </p>
              </div>
              {courseResponse?.totalDuration ? (
                <>
                  <Separator className="w-[1px] h-4" orientation="vertical" />
                  <div className="flex  space-x-[6px]">
                    <Image
                      src={"/icon/clock.svg"}
                      alt="user-icon"
                      width={16}
                      height={16}
                    />
                    <p className="text-base text-fontcolor-description">
                      {formatDuration(courseResponse?.totalDuration)}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* PERSISTENT TAB NAVIGATION - Never re-renders on lesson change */}
          <div className="flex items-center justify-between border-b-[1px] border-greyscale-200 mb-8">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            {/* Course progress button will be passed from children */}
            <div id="course-progress-button-container"></div>
          </div>

          {/* DYNAMIC LESSON CONTENT - Only this part re-renders */}
          <div className="lesson-content-container">{children}</div>
          {/* <RelatedCourse course={courseResponse} /> */}
          {/* PERSISTENT TEACHER INTRODUCTION - Never re-renders on lesson change */}
          <div className="mt-16">
            <TeacherIntro course={courseResponse} />
          </div>
        </div>

        {/* PERSISTENT SIDEBAR - Never re-renders, only highlights change */}
        <div className="relative z-10 w-full lg:w-96 flex-[.35]">
          <div className="w-full h-full">
            <div className="sticky bg-white top-20">
              <div className="border border-gray-300 min-h-[63vh] rounded-md">
                <StudentSidebar
                  courseSlug={courseResponse?.slug}
                  lesson={courseResponse?.lessons}
                  currentLessonSlug={params.lessonSlug as string}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConditionalLayout = (props: ConditionalLayoutProps) => {
  return (
    <TabProvider>
      <ConditionalLayoutContent {...props} />
    </TabProvider>
  );
};

export default ConditionalLayout;
