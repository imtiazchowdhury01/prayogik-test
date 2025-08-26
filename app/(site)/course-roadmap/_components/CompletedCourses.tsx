import {
  getDifficultyBadge,
  getStatusBadge,
} from "@/app/(dashboard)/(routes)/admin/manage/course-roadmap/_components/utils";
import { CardDescription } from "@/components/ui/card";
import { CourseRoadmap } from "@prisma/client";
import { differenceInDays } from "date-fns";
import CompletedCourseCard from "./CompletedCourseCard";

const CompletedCourses = ({
  completedRoadmaps,
}: {
  completedRoadmaps: CourseRoadmap[];
}) => {
  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const days = differenceInDays(targetDate, today);
    return days > 0 ? days : 0;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-7xl p-6 lg:px-1 mx-auto px-6 md:px-8">
        {/* section title */}
        <div>
          <h4 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px] pb-3">
            সম্পন্ন কোর্স
          </h4>
          <p className="text-lg text-gray-700 text-center md:w-full w-10/12 mx-auto md:text-left pb-6">
            সেরা অনলাইন কোর্সগুলিতে অ্যাক্সেস পান এবং শীর্ষ পেশাদারদের সাথে
            ইন্টারঅ্যাক্ট করুন
          </p>
        </div>

        {completedRoadmaps.length === 0 ? (
          <CardDescription className="text-center py-16">
            No course found
          </CardDescription>
        ) : null}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {completedRoadmaps.map((roadmap) => (
            <CompletedCourseCard
              key={roadmap.id}
              roadmap={roadmap}
              getStatusBadge={getStatusBadge}
              getDifficultyBadge={getDifficultyBadge}
              getDaysRemaining={getDaysRemaining}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompletedCourses;
