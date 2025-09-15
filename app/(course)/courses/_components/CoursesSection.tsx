import { getCoursesDbCall } from "@/lib/data-access-layer/course";
import CoursesClientSection from "./CoursesClient";
import CoursesGrid from "./CoursesGrid";

// Data fetching function
async function fetchInitialCourses() {
  const courses = await getCoursesDbCall({
    page: 1,
    sort: "desc",
    limit: 24,
  });
  return courses;
}

const CoursesSection = async () => {
  const { courses, pagination } = await fetchInitialCourses();

  return (
    <div>
      {/* Server-rendered courses grid for SEO */}
      <CoursesGrid courses={courses} />

      {/* Client component for dynamic loading and filtering */}
      {/* <CoursesClientSection initialPagination={pagination} /> */}
    </div>
  );
};

export default CoursesSection;
