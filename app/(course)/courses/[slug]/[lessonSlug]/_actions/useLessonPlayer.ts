//@ts-nocheck
"use client";

import { useState } from "react";

export function useLessonPlayer({ course, lessons, initialLesson }: any) {
  const [lesson, setLesson] = useState(initialLesson);
  const [lessonsWithProgress, setLessonsWithProgress] = useState(lessons);

  // Calculate next lesson based on current lesson
  const getCurrentLessonIndex = (currentLesson: any) => {
    return lessonsWithProgress.findIndex((l: any) => l.id === currentLesson.id);
  };

  const getNextLesson = (currentLesson: any) => {
    const currentIndex = getCurrentLessonIndex(currentLesson);
    return lessonsWithProgress[currentIndex + 1] || null;
  };

  const [nextLesson, setNextLesson] = useState(() =>
    getNextLesson(initialLesson)
  );

  const handleLessonChange = (newLesson: any) => {
    // Find the lesson with its progress data from the lessons array
    const lessonWithProgress = lessonsWithProgress.find(
      (l: any) => l.id === newLesson.id
    );
    setLesson(lessonWithProgress || newLesson);
    setNextLesson(getNextLesson(lessonWithProgress || newLesson));
    window.history.replaceState(
      null,
      "",
      `/courses/${course.slug}/${newLesson.slug}`
    );
  };

  // Function to update progress when a lesson is completed
  const updateLessonProgress = (lessonId: string, isCompleted: boolean) => {
    setLessonsWithProgress((prevLessons) =>
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
  };

  return {
    lesson,
    nextLesson,
    lessonsWithProgress,
    handleLessonChange,
    updateLessonProgress,
  };
}
