"use client";
import React, { useState } from "react";
import { VisitorLessonCard } from "./visitor-lesson-card";
import { ShowMoreLessons } from "./show-more-lessons";

interface ShowMoreLessonsClientProps {
  course: any;
  visibleLessonCount: number;
}

const ShowMoreLessonsClient = ({
  course,
  visibleLessonCount,
}: ShowMoreLessonsClientProps) => {
  const [visibleLessons, setVisibleLessons] =
    useState<number>(visibleLessonCount);

  // Get lessons to display based on current visible count
  const lessonsToShow = course.lessons.slice(0, visibleLessons);

  return (
    <>
      {/* Render all visible lessons */}
      {lessonsToShow.map((lesson: any) => (
        <VisitorLessonCard key={lesson.id} lesson={lesson} course={course} />
      ))}

      {/* Show more/less button */}
      {course.lessons.length > visibleLessonCount && (
        <ShowMoreLessons
          visibleLessons={visibleLessons}
          visibleLessonCount={visibleLessonCount}
          setVisibleLessons={setVisibleLessons}
          course={course}
        />
      )}
    </>
  );
};

export { ShowMoreLessonsClient };
