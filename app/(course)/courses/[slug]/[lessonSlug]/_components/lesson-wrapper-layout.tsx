//@ts-nocheck
"use client";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatDuration } from "@/lib/formatDuration";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import TeacherIntro from "../../_components/TeacherIntro";
import { TabNavigation } from "../../_components/details-tab-navigation";
import { useTab } from "@/hooks/use-tab";
import { VideoDisplay } from "../_components/video-display";
import { useLessonPlayer } from "../_actions/useLessonPlayer";
import { LessonSidebar } from "./lesson-sidebar";
import { CourseProgressButton } from "../../_components/course-progress-button";
import Attachment from "../../_components/Attachement";

const LessonWrapperLayout = ({
  course,
  lessons,
  initialLesson,
  nextLesson: initialNextLesson,
  studentProfileId,
  currentLessonSlug,
  courseSlug,
  userId,
  progress,
  purchase,
}: any) => {
  const { activeTab, setActiveTab } = useTab();
  const {
    lesson,
    nextLesson,
    lessonsWithProgress,
    handleLessonChange,
    updateLessonProgress,
  } = useLessonPlayer({
    course,
    lessons,
    initialLesson,
  });

  const tabs = [
    { label: "লেসন কনটেন্ট", value: "content" },
    { label: "এটাচমেন্ট", value: "attachment" },
  ];

  // console.log('progres result:', progress);

  return (
    <div className="flex items-center justify-between px-3.5 md:px-3.5 lg:px-6 xl:px-4 2xl:px-0 py-6 mx-auto max-w-7xl gap-x-6 sm:mt-5 md:mt-8">
      <div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-8">
        <div className="flex-[.65]">
          {/* PERSISTENT COURSE INFORMATION - Never re-renders on lesson change */}
          <section className="mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-fontcolor-title -m-1 max-sm:leading-[2.2rem]">
                {textLangChecker(course?.title)}
              </h2>
              <p
                className="my-3 text-base text-fontcolor-description"
                id="instructor-name"
              >
                ইন্সট্রাক্টর{" "}
                <span className="text-base font-bold text-fontcolor-title">
                  {textLangChecker(course?.teacherProfile?.user?.name)},{" "}
                </span>{" "}
                <span>
                  {course?.teacherProfile?.subjectSpecializations[0]} এক্সপার্ট
                </span>
                {course?.teacherProfile?.yearsOfExperience && (
                  <span>
                    এবং{" "}
                    {convertNumberToBangla(
                      course?.teacherProfile?.yearsOfExperience.split(" ")[0]
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
                  {convertNumberToBangla(course?.lessons.length)} টি লেসন
                </p>
              </div>
              {course?.totalDuration ? (
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
                      {formatDuration(course?.totalDuration)}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </section>

          {/* PERSISTENT TAB NAVIGATION - Never re-renders on lesson change */}
          <section className="flex items-center justify-between border-b-[1px] border-greyscale-200 mb-8">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            {/* Course progress button will be passed from children */}
            <div id="course-progress-button-container">
              <CourseProgressButton
                course={course}
                lessonId={lesson.id}
                courseId={course.id}
                nextLesson={nextLesson}
                isCompleted={lesson?.Progress?.[0]?.isCompleted || false}
                userId={userId}
                onLessonClick={handleLessonChange}
                onProgressUpdate={updateLessonProgress}
              />
            </div>
          </section>

          {/* DYNAMIC LESSON CONTENT - Only this part re-renders */}
          <section className="lesson-content-container">
            {lesson && (
              <>
                {/* Video Display based on active tab */}
                {activeTab === "content" && (
                  <div className="mt-8">
                    <VideoDisplay
                      lesson={lesson}
                      course={course}
                      studentProfileId={studentProfileId}
                      progress={progress}
                      purchase={purchase}
                    />
                  </div>
                )}

                {/* Attachment tab content */}
                {activeTab === "attachment" && (
                  <>
                    {course?.attachments?.length !== 0 ? (
                      <Attachment course={course} />
                    ) : (
                      <div className="min-h-[120px] sm:min-h-[400px] text-gray-400 border border-gray-200 rounded-md flex justify-center items-center w-full px-2 sm:px-4 text-center">
                        <p className="text-sm sm:text-base">
                          কোন রিসোর্স পাওয়া যায়নি!
                        </p>
                      </div>
                    )}
                  </>
                )}
                
              </>
            )}
          </section>

          {/* PERSISTENT TEACHER INTRODUCTION - Never re-renders on lesson change */}
          <section className="mt-16">
            <TeacherIntro course={course} />
          </section>
        </div>

        {/* PERSISTENT SIDEBAR - Never re-renders, only highlights change */}
        <div className="relative z-10 w-full lg:w-96 flex-[.35]">
          <div className="w-full h-full">
            <div className="sticky bg-white top-20">
              <div className="border border-gray-300 min-h-[63vh] rounded-md">
                <LessonSidebar
                  lessons={lessonsWithProgress}
                  currentLesson={lesson}
                  onLessonClick={handleLessonChange}
                  currentLessonSlug={lesson.slug}
                  courseSlug={courseSlug}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonWrapperLayout;
