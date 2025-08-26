import { CourseRoadmap } from "@prisma/client";
import { Clock, Video } from "lucide-react";

const WorkInProgresscourse = ({
  wipCourses,
}: {
  wipCourses: CourseRoadmap[];
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-amber-600" />
        <h3 className="text-xl font-bold text-gray-900">
          কোন কোর্স বা প্রোগ্রাম তৈরি হচ্ছে
        </h3>
      </div>

      <div className="space-y-4">
        {wipCourses.map((course, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg"
          >
            <div className="text-amber-600 mt-1">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-gray-900">{course.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkInProgresscourse;
