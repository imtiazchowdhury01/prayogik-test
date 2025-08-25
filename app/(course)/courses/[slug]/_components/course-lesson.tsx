//@ts-nocheck
"use client";
import { useState } from "react";
import VideoPopUp from "./VideoPopUp";
import { ShowMoreLessons } from "./show-more-lessons";
import { VisitorLessonCard } from "./visitor-lesson-card";

export default function CourseLesson({ course }) {
  const visibleLessonCount = 10;
  const [visibleLessons, setVisibleLessons] = useState(visibleLessonCount);

  return (
    <div className="my-6">
      <h1 className="mb-4 text-2xl font-bold">Course Lessons</h1>
      <div className="">
        {course.lessons.slice(0, visibleLessons).map((lesson, i) => (
          <VisitorLessonCard
            key={lesson.id}
            lesson={lesson}
            course={course}
          ></VisitorLessonCard>
        ))}
      </div>
      {course.lessons.length > visibleLessonCount && (
        <ShowMoreLessons
          visibleLessons={visibleLessons}
          visibleLessonCount={visibleLessonCount}
          setVisibleLessons={setVisibleLessons}
          course={course}
        />
      )}
    </div>
  );
}
