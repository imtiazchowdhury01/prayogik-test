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

export function TeacherCourses({ courses, userId }) {
  return (
    <section className="w-full py-16 bg-background-gray ">
      <div className="app-container">
        <div className="flex items-center justify-center w-full mb-6 md:justify-between">
          <div>
            <h4 className="text-3xl font-bold text-center md:text-left">
              কোর্স সমূহ
            </h4>
          </div>

          {/* {filteredCourses?.length !== 0 && (
            <div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                  <div className="px-4 py-2 text-sm bg-white border border-none rounded-full font-secondary">
                    <span className="text-[#475569]">সাজান:</span>{" "}
                    <span className="text-[#096961] font-semibold">
                      {" "}
                      জনপ্রিয়
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                    }}
                  >
                    জনপ্রিয়
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                    }}
                  >
                    সাম্প্রতিক
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                    }}
                  >
                    হাই রেটেড
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )} */}
        </div>

        {/* Course card-- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses?.length === 0 ? (
            <div className="flex items-center justify-center p-8 border-2 border-gray-300 border-dashed rounded-lg col-span-full">
              <div className="text-center text-gray-500">দুঃখিত! কোনো কোর্স পাওয়া যায় নি।</div>
            </div>
          ) : (
            courses?.map((item, index) => (
              <CourseCard
                key={index}
                course={item}
                userId={userId}
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
