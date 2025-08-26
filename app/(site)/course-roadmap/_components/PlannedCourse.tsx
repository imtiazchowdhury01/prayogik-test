import { Button } from "@/components/ui/button";
import { CourseRoadmap } from "@prisma/client";
import { Calendar, Video } from "lucide-react";
import Link from "next/link";
const PlannedCourse = ({
  plannedCourses,
}: {
  plannedCourses: CourseRoadmap[];
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">
          ভবিষ্যতে কোন বিষয়গুলো আসছে
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        {plannedCourses.map((course, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
          >
            <div className="text-blue-600 mt-1">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-gray-900">{course.title}</span>
          </div>
        ))}
      </div>
      <Link href="/course-proposals">
        <Button
          variant="outline"
          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          আপনার কাঙ্ক্ষিত কোর্স সাজেস্ট করুন
        </Button>
      </Link>
    </div>
  );
};

export default PlannedCourse;
