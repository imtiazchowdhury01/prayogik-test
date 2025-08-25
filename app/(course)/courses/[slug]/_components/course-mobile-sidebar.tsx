// @ts-nocheck
import { Menu } from "lucide-react";
import { Lesson, Course, progress } from "@prisma/client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Lesson & {
      progress: progress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <SheetTitle></SheetTitle>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};
