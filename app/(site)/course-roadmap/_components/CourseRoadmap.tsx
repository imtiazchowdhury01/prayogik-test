import { getCourseRoadmap } from "@/lib/getCourseRoadmap";
import { CourseRoadmapClient } from "./CourseRoadmapClient";

// Server Component Wrapper
// export const CourseRoadmap = async () => {
//   const { liveNowCourses, wipCourses, plannedCourses,updatedAt } = await getCourseRoadmap(
export const CourseRoadmap = async ({ showSectionHeader }: any) => {
  const { liveNowCourses, wipCourses, plannedCourses,updatedAt } = await getCourseRoadmap(
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
      updatedAt={updatedAt}
      showSectionHeader={showSectionHeader}
    />
  );
};

export default CourseRoadmap;
