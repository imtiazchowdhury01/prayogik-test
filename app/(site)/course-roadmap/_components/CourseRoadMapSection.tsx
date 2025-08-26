import PlannedCourse from "./PlannedCourse";
import WorkInProgresscourse from "./WorkInProgresscourse";
import LiveCourse from "./LiveCourse";
import { getCourseRoadmap } from "@/lib/getCourseRoadmap";

const CourseRoadMapSection = async () => {
  const { liveNowCourses, wipCourses, plannedCourses } = await getCourseRoadmap(
    "ROADMAP"
  );
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
        কোর্স রোডম্যাপ
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Completed - কোন কোর্সগুলো এখনই শেখা যাবে */}
        <LiveCourse liveNowCourses={liveNowCourses  ?? []} />
        {/* Work in Progress - যা এখন তৈরি হচ্ছে */}
        <WorkInProgresscourse wipCourses={wipCourses ?? []} />
        {/* Planned - যা তৈরি হবে */}
        <PlannedCourse plannedCourses={plannedCourses ?? []} />
      </div>
    </section>
  );
};

export default CourseRoadMapSection;
