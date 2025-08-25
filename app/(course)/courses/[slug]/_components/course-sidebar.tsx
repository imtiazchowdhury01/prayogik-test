// @ts-nocheck
import { Lesson, Course, progress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";
import { getServerUserSession } from "@/lib/getServerUserSession";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Lesson & {
      progress: progress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return redirect("/");
  }

  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId: course.id,
  //     },
  //   },
  // });

  const purchase = db.enrolledStudents.findFirst({
    where: {
      userId: userId,
      courseId: course.id,
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((Lesson) => (
          <CourseSidebarItem
            key={Lesson.id}
            id={Lesson.id}
            label={Lesson.title}
            isCompleted={!!Lesson.progress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!Lesson.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
