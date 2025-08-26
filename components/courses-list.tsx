// @ts-nocheck
"use client";
import { Category, Course } from "@prisma/client";
import SingleCourse from "./SingleCourse";
import { usePathname } from "next/navigation";
import CourseCard from "./CourseCard";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
  userId: string | null;
}

export const CoursesList = ({
  items,
  userId,
  purchasedCourseIds,
}: CoursesListProps) => {
  const pathname = usePathname();
  // Check if the URL contains "courses/category"
  const isCategoryPage = pathname.includes("courses/category");

  // Determine grid column classes
  const gridColumns = isCategoryPage
    ? "sm:grid-cols-4 md:grid-cols-4"
    : "sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5";

  return (
    <div>
      <div className={`grid ${gridColumns} gap-4`}>
        {/* {JSON.stringify(items)} */}
        {items.map((item) => (
          <div key={item.id} className="h-full">
            <CourseCard
              variant="light"
              key={item.id}
              course={item}
              userId={userId}
              purchasedCourseIds={purchasedCourseIds}
              instructor={item?.teacherProfile?.user?.name}
            />
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-2 text-base text-center text-gray-400 border border-gray-200 rounded-md text-muted-foreground py-28">
          কোন কোর্স পাওয়া যায়নি!
        </div>
      )}
    </div>
  );
};
