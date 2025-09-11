import CourseCard from "@/components/CourseCard";


interface CoursesGridProps {
  courses: any[];
  className?: string;
}

const CoursesGrid = ({ courses, className = "" }: CoursesGridProps) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="flex items-center justify-center px-8 border-2 border-gray-300 border-dashed rounded-lg py-28">
        <div className="text-center text-gray-500">
          দুঃখিত! কোনো কোর্স পাওয়া যায় নি।
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 ${className}`}>
      {courses.map((course: any) => (
        <CourseCard
          key={course?.id}
          variant="light"
          course={course}
          instructor={course?.teacherProfile?.user?.name}
        />
      ))}
    </div>
  );
};

export default CoursesGrid;