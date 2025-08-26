// @ts-nocheck

"use client";

import CourseCard from "@/components/CourseCard";
import MoreBtn from "@/components/more-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TeacherCourses({ courses }) {
  return (
    <section className="w-full py-16">
      <div className="app-container">
        <div className="flex items-center justify-center w-full mb-6 md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-center md:text-left">
              কোর্স সমূহ
            </h2>
          </div>
        </div>

        {/* Course card-- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses?.length === 0 ? (
            <div className="flex items-center justify-center p-8 border-2 border-gray-300 border-dashed rounded-lg col-span-full">
              <div className="text-center text-gray-500">
                দুঃখিত! কোনো কোর্স পাওয়া যায় নি।
              </div>
            </div>
          ) : (
            courses?.map((item, index) => (
              <CourseCard
                key={index}
                course={item}
                instructor={item?.teacherProfile?.user?.name}
                variant="light"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
