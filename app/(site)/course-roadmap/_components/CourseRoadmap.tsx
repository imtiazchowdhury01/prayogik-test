import { getCourseRoadmap } from "@/lib/getCourseRoadmap";
import { CourseRoadmapClient } from "./CourseRoadmapClient";
import { generateMultipleBlurDataURLs } from "@/lib/blurGenerator";

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

  // blur image data
  const imageUrls = liveCourses
    .map((course: any) => course?.teacher?.user?.avatarUrl)
    .filter((url) => typeof url === "string" && url.trim() !== "")
    .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates

  // Generate blur data for all instructor images in parallel
  const blurDataMap = await generateMultipleBlurDataURLs(imageUrls);
  return (
    <CourseRoadmapClient
      liveNowCourses={liveCourses}
      wipCourses={wipCoursesArray}
      plannedCourses={plannedCoursesArray}
      blurDataMap={blurDataMap}
      updatedAt={updatedAt}
      showSectionHeader={showSectionHeader}
    />
  );
};

export default CourseRoadmap;
