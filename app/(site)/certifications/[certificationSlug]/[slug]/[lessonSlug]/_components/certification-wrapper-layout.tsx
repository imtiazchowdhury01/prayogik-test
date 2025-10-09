// "use client";
// import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
// import { formatDuration } from "@/lib/formatDuration";
// import { textLangChecker } from "@/lib/utils/textLangChecker";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";

// import { useTab } from "@/hooks/use-tab";
// import { CertificationSidebar } from "./certification-sidebar";
// import TeacherIntro from "@/app/(course)/courses/[slug]/_components/TeacherIntro";
// import { TabNavigation } from "@/app/(course)/courses/[slug]/_components/details-tab-navigation";
// import { CourseProgressButton } from "@/app/(course)/courses/[slug]/_components/course-progress-button";
// import { VideoDisplay } from "@/app/(course)/courses/[slug]/[lessonSlug]/_components/video-display";
// import Attachment from "@/app/(course)/courses/[slug]/_components/Attachement";
// import { useCertificationCourseLessonPlayer } from "../_actions/useCertificationCourseLessonPlayer";

// const CertificationWrapperLayout = ({
//   certification,
//   course,
//   lessons,
//   initialLesson,
//   nextLesson: initialNextLesson,
//   studentProfileId,
//   currentLessonSlug,
//   courseSlug,
//   userId,
//   progress,
//   purchase,
// }: any) => {
//   const { activeTab, setActiveTab } = useTab();
//   // const courses = certification?.courses || [];
//   // console.log({ certification });

//   const {
//     lesson,
//     nextLesson,
//     lessonsWithProgress,
//     handleLessonChange,
//     updateLessonProgress,
//   } = useCertificationCourseLessonPlayer({
//     certification,
//     course,
//     lessons,
//     initialLesson,
//   });

//   const tabs = [
//     { label: "লেসন কনটেন্ট", value: "content" },
//     { label: "এটাচমেন্ট", value: "attachment" },
//   ];

//   // console.log('progres result:', progress);

//   return (
//     <div className="flex items-center justify-between px-3.5 md:px-3.5 lg:px-6 xl:px-4 2xl:px-0 py-6 mx-auto max-w-7xl gap-x-6 sm:mt-5 md:mt-8">
//       <div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-8">
//         <div className="flex-[.65]">
//           {/* PERSISTENT COURSE INFORMATION - Never re-renders on lesson change */}
//           <section className="mb-12">
//             <div>
//               <h2 className="text-3xl sm:text-4xl font-bold text-fontcolor-title -m-1 max-sm:leading-[2.2rem]">
//                 {textLangChecker(course?.title)}
//               </h2>
//               <p
//                 className="my-3 text-base text-fontcolor-description"
//                 id="instructor-name"
//               >
//                 ইন্সট্রাক্টর{" "}
//                 <span className="text-base font-bold text-fontcolor-title">
//                   {textLangChecker(course?.teacherProfile?.user?.name)},{" "}
//                 </span>{" "}
//                 <span>
//                   {course?.teacherProfile?.subjectSpecializations[0]} এক্সপার্ট
//                 </span>
//                 {course?.teacherProfile?.yearsOfExperience && (
//                   <span>
//                     এবং{" "}
//                     {convertNumberToBangla(
//                       course?.teacherProfile?.yearsOfExperience.split(" ")[0]
//                     )}{" "}
//                     বছরের অভিজ্ঞতা সম্পন্ন
//                   </span>
//                 )}
//               </p>
//             </div>
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex space-x-[6px]">
//                 <Image
//                   src={"/icon/book-gray.svg"}
//                   alt="user-icon"
//                   width={0}
//                   height={0}
//                   sizes="16px"
//                 />
//                 <p className="text-base text-fontcolor-description">
//                   {convertNumberToBangla(course?.lessons.length)} টি লেসন
//                 </p>
//               </div>
//               {course?.totalDuration ? (
//                 <>
//                   <Separator className="w-[1px] h-4" orientation="vertical" />
//                   <div className="flex  space-x-[6px]">
//                     <Image
//                       src={"/icon/clock.svg"}
//                       alt="user-icon"
//                       width={16}
//                       height={16}
//                     />
//                     <p className="text-base text-fontcolor-description">
//                       {formatDuration(course?.totalDuration)}
//                     </p>
//                   </div>
//                 </>
//               ) : null}
//             </div>
//           </section>

//           {/* PERSISTENT TAB NAVIGATION - Never re-renders on lesson change */}
//           <section className="flex items-center justify-between border-b-[1px] border-greyscale-200 mb-8">
//             <TabNavigation
//               tabs={tabs}
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//             />
//             {/* Course progress button will be passed from children */}
//             <div id="course-progress-button-container">
//               <CourseProgressButton
//                 course={course}
//                 lessonId={lesson.id}
//                 courseId={course.id}
//                 nextLesson={nextLesson}
//                 isCompleted={lesson?.Progress?.[0]?.isCompleted || false}
//                 userId={userId}
//                 onLessonClick={handleLessonChange}
//                 onProgressUpdate={updateLessonProgress}
//               />
//             </div>
//           </section>

//           {/* DYNAMIC LESSON CONTENT - Only this part re-renders */}
//           <section className="lesson-content-container">
//             {lesson && (
//               <>
//                 {/* Video Display based on active tab */}
//                 {activeTab === "content" && (
//                   <div className="mt-8">
//                     <VideoDisplay
//                       lesson={lesson}
//                       course={course}
//                       studentProfileId={studentProfileId}
//                       progress={progress}
//                       purchase={purchase}
//                     />
//                   </div>
//                 )}

//                 {/* Attachment tab content */}
//                 {activeTab === "attachment" && (
//                   <>
//                     {course?.attachments?.length !== 0 ? (
//                       <Attachment course={course} />
//                     ) : (
//                       <div className="min-h-[120px] sm:min-h-[400px] text-gray-400 border border-gray-200 rounded-md flex justify-center items-center w-full px-2 sm:px-4 text-center">
//                         <p className="text-sm sm:text-base">
//                           কোন রিসোর্স পাওয়া যায়নি!
//                         </p>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </>
//             )}
//           </section>

//           {/* PERSISTENT TEACHER INTRODUCTION - Never re-renders on lesson change */}
//           <section className="mt-16">
//             <TeacherIntro course={course} />
//           </section>
//         </div>

//         {/* PERSISTENT SIDEBAR - Never re-renders, only highlights change */}
//         <div className="relative z-10 w-full lg:w-96 flex-[.35]">
//           <div className="w-full h-full">
//             <div className="sticky bg-white top-20">
//               <div className="border border-gray-300 min-h-[63vh] rounded-md">
//                 <CertificationSidebar
//                   courses={certification?.courses || []}
//                   currentLesson={lesson}
//                   onLessonClick={handleLessonChange}
//                   currentLessonSlug={currentLessonSlug}
//                   currentCourseSlug={courseSlug}
//                   activeTab={activeTab}
//                   setActiveTab={setActiveTab}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificationWrapperLayout;
// ------------fixed v2 : course details change based on courses change------------------------

"use client";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatDuration } from "@/lib/formatDuration";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import { useTab } from "@/hooks/use-tab";
import { CertificationSidebar } from "./certification-sidebar";
import TeacherIntro from "@/app/(course)/courses/[slug]/_components/TeacherIntro";
import { TabNavigation } from "@/app/(course)/courses/[slug]/_components/details-tab-navigation";
import { CourseProgressButton } from "@/app/(course)/courses/[slug]/_components/course-progress-button";
import { VideoDisplay } from "@/app/(course)/courses/[slug]/[lessonSlug]/_components/video-display";
import Attachment from "@/app/(course)/courses/[slug]/_components/Attachement";
import { useCertificationCourseLessonPlayer } from "../_actions/useCertificationCourseLessonPlayer";
import { useState, useEffect } from "react";

const CertificationWrapperLayout = ({
  certification,
  course: initialCourse,
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
  const [currentCourse, setCurrentCourse] = useState(initialCourse);

  const {
    lesson,
    nextLesson,
    lessonsWithProgress,
    handleLessonChange,
    updateLessonProgress,
  } = useCertificationCourseLessonPlayer({
    certification,
    course: initialCourse,
    lessons,
    initialLesson,
  });

  // Update current course when lesson changes
  useEffect(() => {
    if (lesson && certification?.courses) {
      const courseContainingLesson = certification.courses.find((c: any) =>
        c.lessons.some((l: any) => l.id === lesson.id)
      );

      if (
        courseContainingLesson &&
        courseContainingLesson.id !== currentCourse.id
      ) {
        setCurrentCourse(courseContainingLesson);
      }
    }
  }, [lesson, certification, currentCourse.id]);

  const tabs = [
    { label: "লেসন কনটেন্ট", value: "content" },
    { label: "এটাচমেন্ট", value: "attachment" },
  ];

  // Calculate total lessons and duration across all courses
  const totalLessonsCount =
    certification?.courses?.reduce(
      (acc: number, course: any) => acc + (course.lessons?.length || 0),
      0
    ) || 0;

  const totalCertificationDuration =
    certification?.courses?.reduce(
      (acc: number, course: any) => acc + (course.totalDuration || 0),
      0
    ) || 0;

  // Get all unique teachers from all courses
  const getAllTeachers = () => {
    const teachersMap = new Map();

    certification?.courses?.forEach((course: any) => {
      // Add main teacher
      if (course.teacherProfile) {
        teachersMap.set(course.teacherProfile.id, course.teacherProfile);
      }

      // Add co-teachers if they exist
      if (course.coTeachers && Array.isArray(course.coTeachers)) {
        course.coTeachers.forEach((coTeacher: any) => {
          if (coTeacher) {
            teachersMap.set(coTeacher.id, coTeacher);
          }
        });
      }
    });

    return Array.from(teachersMap.values());
  };
  const allTeachers = getAllTeachers();

  return (
    <div className="flex items-center justify-between px-3.5 md:px-3.5 lg:px-6 xl:px-4 2xl:px-0 py-6 mx-auto max-w-7xl gap-x-6 sm:mt-5 md:mt-8">
      <div className="flex flex-col w-full gap-4 lg:flex-row lg:gap-8">
        <div className="flex-[.65]">
          {/* CERTIFICATION INFORMATION */}
          <section className="mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-fontcolor-title -m-1 max-sm:leading-[2.2rem]">
                {textLangChecker(certification?.title)}
              </h2>

              {/* Display teachers names only */}
              {allTeachers.length > 0 && (
                <p className="my-3 text-base text-fontcolor-description">
                  ইন্সট্রাক্টর{allTeachers.length > 1 ? "গণ" : ""}:{" "}
                  <span className="text-base font-bold text-fontcolor-title">
                    {allTeachers.map((teacher: any, index: number) => {
                      const name = textLangChecker(teacher?.user?.name);
                      if (index === allTeachers.length - 1) {
                        return <span key={teacher.id}>এবং {name}</span>;
                      }
                      if (index === allTeachers.length - 2) {
                        return <span key={teacher.id}>{name} </span>;
                      }
                      return <span key={teacher.id}>{name}, </span>;
                    })}
                  </span>
                </p>
              )}
            </div>

            {/* Certification stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex space-x-[6px]">
                <Image
                  src={"/icon/book-gray.svg"}
                  alt="course-icon"
                  width={16}
                  height={16}
                />
                <p className="text-base text-fontcolor-description">
                  {convertNumberToBangla(certification?.courses?.length || 0)}{" "}
                  টি কোর্স
                </p>
              </div>
              <Separator className="w-[1px] h-4" orientation="vertical" />
              <div className="flex space-x-[6px]">
                <Image
                  src={"/icon/book-gray.svg"}
                  alt="lesson-icon"
                  width={16}
                  height={16}
                />
                <p className="text-base text-fontcolor-description">
                  {convertNumberToBangla(totalLessonsCount)} টি লেসন
                </p>
              </div>
              {totalCertificationDuration > 0 && (
                <>
                  <Separator className="w-[1px] h-4" orientation="vertical" />
                  <div className="flex space-x-[6px]">
                    <Image
                      src={"/icon/clock.svg"}
                      alt="duration-icon"
                      width={16}
                      height={16}
                    />
                    <p className="text-base text-fontcolor-description">
                      {formatDuration(totalCertificationDuration)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* TAB NAVIGATION */}
          <section className="flex items-center justify-between border-b-[1px] border-greyscale-200 mb-8">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div id="course-progress-button-container">
              <CourseProgressButton
                course={currentCourse}
                lessonId={lesson.id}
                courseId={currentCourse.id}
                nextLesson={nextLesson}
                isCompleted={lesson?.Progress?.[0]?.isCompleted || false}
                userId={userId}
                onLessonClick={handleLessonChange}
                onProgressUpdate={updateLessonProgress}
              />
            </div>
          </section>

          {/* DYNAMIC LESSON CONTENT */}
          <section className="lesson-content-container">
            {lesson && (
              <>
                {/* Video Display based on active tab */}
                {activeTab === "content" && (
                  <div className="mt-8">
                    <VideoDisplay
                      lesson={lesson}
                      course={currentCourse}
                      studentProfileId={studentProfileId}
                      progress={progress}
                      purchase={purchase}
                    />
                  </div>
                )}

                {/* Attachment tab content */}
                {activeTab === "attachment" && (
                  <>
                    {currentCourse?.attachments?.length !== 0 ? (
                      <Attachment course={currentCourse} />
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

          {/* TEACHER INTRODUCTION */}
          <section className="mt-16">
            <TeacherIntro course={currentCourse} />
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="relative z-10 w-full lg:w-96 flex-[.35]">
          <div className="w-full h-full">
            <div className="sticky bg-white top-20">
              <div className="border border-gray-300 min-h-[63vh] rounded-md">
                <CertificationSidebar
                  courses={
                    certification?.courses?.map((course: any) => ({
                      ...course,
                      lessons: course.lessons.map((lesson: any) => {
                        // Find the lesson with updated progress from lessonsWithProgress
                        const updatedLesson = lessonsWithProgress.find(
                          (l: any) => l.id === lesson.id
                        );
                        return updatedLesson || lesson;
                      }),
                    })) || []
                  }
                  currentLesson={lesson}
                  onLessonClick={handleLessonChange}
                  currentLessonSlug={currentLessonSlug}
                  currentCourseSlug={currentCourse.slug}
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

export default CertificationWrapperLayout;
