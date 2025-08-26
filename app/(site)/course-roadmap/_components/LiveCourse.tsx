import { Button } from "@/components/ui/button";
import { CourseRoadmap } from "@prisma/client";
import { Play, Video } from "lucide-react";
import Link from "next/link";

const LiveCourse = ({
  liveNowCourses,
}: {
  liveNowCourses: CourseRoadmap[];
}) => {
  // console.log(liveNowCourses, "hi from live");
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Play className="w-5 h-5 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">
          {/* Live Now – যা এখনই শেখা যাবে */}
          কোন কোর্সগুলো এখনই শেখা যাবে
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        {liveNowCourses.map((course, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
          >
            <div className="text-green-600 mt-1">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-gray-900">{course.title}</span>
          </div>
        ))}
      </div>

      <Link href="/courses">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          সব কোর্স দেখুন
        </Button>
      </Link>
    </div>
  );
};

export default LiveCourse;
