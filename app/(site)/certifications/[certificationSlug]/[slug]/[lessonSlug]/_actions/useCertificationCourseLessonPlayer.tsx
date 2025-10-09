// //@ts-nocheck
// "use client";

// import { useState } from "react";

// export function useCertificationCourseLessonPlayer({
//   certification,
// //   course,
//   lessons,
//   initialLesson,
// }: any) {
//   const [lesson, setLesson] = useState(initialLesson);
//   const [lessonsWithProgress, setLessonsWithProgress] = useState(lessons);

//   // Calculate next lesson based on current lesson
//   const getCurrentLessonIndex = (currentLesson: any) => {
//     return lessonsWithProgress.findIndex((l: any) => l.id === currentLesson.id);
//   };

//   const getNextLesson = (currentLesson: any) => {
//     const currentIndex = getCurrentLessonIndex(currentLesson);
//     return lessonsWithProgress[currentIndex + 1] || null;
//   };

//   const [nextLesson, setNextLesson] = useState(() =>
//     getNextLesson(initialLesson)
//   );

//   const handleLessonChange = (newLesson: any) => {
//     // Find the lesson with its progress data from the lessons array
//     const lessonWithProgress = lessonsWithProgress.find(
//       (l: any) => l.id === newLesson.id
//     );

//     // Find the course that contains this lesson
//     const courseContainingLesson = certification?.courses?.find((c: any) =>
//       c.lessons.some((l: any) => l.id === newLesson.id)
//     );

//     // Use the correct course slug
//     const courseSlug = courseContainingLesson?.slug;
//     // console.log("Changing to lesson", courseSlug)

//     setLesson(lessonWithProgress || newLesson);
//     setNextLesson(getNextLesson(lessonWithProgress || newLesson));

//     // Update URL with correct course slug
//     window.history.replaceState(
//       null,
//       "",
//       `/certifications/${certification?.slug}/${courseSlug}/${newLesson.slug}`
//     );
//   };

//   // Function to update progress when a lesson is completed
//   const updateLessonProgress = (lessonId: string, isCompleted: boolean) => {
//     setLessonsWithProgress((prevLessons) =>
//       prevLessons.map((l: any) => {
//         if (l.id === lessonId) {
//           return {
//             ...l,
//             Progress: [{ isCompleted }],
//           };
//         }
//         return l;
//       })
//     );

//     // Update current lesson if it's the one being updated
//     if (lesson.id === lessonId) {
//       setLesson((prev) => ({
//         ...prev,
//         Progress: [{ isCompleted }],
//       }));
//     }
//   };

//   return {
//     lesson,
//     nextLesson,
//     lessonsWithProgress,
//     handleLessonChange,
//     updateLessonProgress,
//   };
// }

//@ts-nocheck
"use client";

import { useState, useEffect } from "react";

export function useCertificationCourseLessonPlayer({
  certification,
  lessons: initialLessons,
  initialLesson,
}: any) {
  const [lesson, setLesson] = useState(initialLesson);
  
  // Store all lessons from all courses with their progress
  const [allLessonsWithProgress, setAllLessonsWithProgress] = useState(() => {
    // Initialize with all lessons from all courses
    const allLessons = certification?.courses?.flatMap((course: any) => 
      course.lessons
    ) || [];
    return allLessons;
  });

  // Get lessons for the current course
  const getCurrentCourseLessons = (currentLesson: any) => {
    const courseContainingLesson = certification?.courses?.find((c: any) =>
      c.lessons.some((l: any) => l.id === currentLesson.id)
    );
    return courseContainingLesson?.lessons || [];
  };

  // Calculate next lesson based on current lesson within the same course
  const getNextLesson = (currentLesson: any) => {
    const courseLessons = getCurrentCourseLessons(currentLesson);
    const currentIndex = courseLessons.findIndex((l: any) => l.id === currentLesson.id);
    return courseLessons[currentIndex + 1] || null;
  };

  const [nextLesson, setNextLesson] = useState(() =>
    getNextLesson(initialLesson)
  );

  const handleLessonChange = (newLesson: any) => {
    // Find the lesson with its progress data from all lessons
    const lessonWithProgress = allLessonsWithProgress.find(
      (l: any) => l.id === newLesson.id
    );

    // Find the course that contains this lesson
    const courseContainingLesson = certification?.courses?.find((c: any) =>
      c.lessons.some((l: any) => l.id === newLesson.id)
    );

    // Use the correct course slug
    const courseSlug = courseContainingLesson?.slug;

    setLesson(lessonWithProgress || newLesson);
    setNextLesson(getNextLesson(lessonWithProgress || newLesson));

    // Update URL with correct course slug
    window.history.replaceState(
      null,
      "",
      `/certifications/${certification?.slug}/${courseSlug}/${newLesson.slug}`
    );
  };

  // Function to update progress when a lesson is completed
  const updateLessonProgress = (lessonId: string, isCompleted: boolean) => {
    setAllLessonsWithProgress((prevLessons) =>
      prevLessons.map((l: any) => {
        if (l.id === lessonId) {
          return {
            ...l,
            Progress: [{ isCompleted }],
          };
        }
        return l;
      })
    );

    // Update current lesson if it's the one being updated
    if (lesson.id === lessonId) {
      setLesson((prev) => ({
        ...prev,
        Progress: [{ isCompleted }],
      }));
    }

    // Update next lesson if current lesson was completed
    if (lesson.id === lessonId && isCompleted) {
      const newNextLesson = getNextLesson(lesson);
      setNextLesson(newNextLesson);
    }
  };

  // Update lesson when switching between courses
  useEffect(() => {
    const updatedLesson = allLessonsWithProgress.find(
      (l: any) => l.id === lesson.id
    );
    if (updatedLesson) {
      setLesson(updatedLesson);
    }
  }, [allLessonsWithProgress, lesson.id]);

  return {
    lesson,
    nextLesson,
    lessonsWithProgress: allLessonsWithProgress,
    handleLessonChange,
    updateLessonProgress,
  };
}