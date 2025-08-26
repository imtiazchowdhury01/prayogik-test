import { getCourseRoadmap } from "@/lib/getCourseRoadmap";
import { CourseRoadmapClient } from "./CourseRoadmapClient";

// Server Component Wrapper
export const CourseRoadmap = async () => {
  const { liveNowCourses, wipCourses, plannedCourses } = await getCourseRoadmap(
    "ROADMAP"
  );

  const liveCourses = liveNowCourses || [];
  const wipCoursesArray = wipCourses || [];
  const plannedCoursesArray = plannedCourses || [];
  return (
    <CourseRoadmapClient
      liveNowCourses={liveCourses}
      wipCourses={wipCoursesArray}
      plannedCourses={plannedCoursesArray}
    />
  );
};

export default CourseRoadmap;
