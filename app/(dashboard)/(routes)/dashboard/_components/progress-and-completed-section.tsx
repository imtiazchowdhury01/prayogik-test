import { CircleCheck, Contrast } from "lucide-react";
import { InfoCard } from "./info-card";
import { getStudentCourseProgressCompletedCount } from "../_actions/get-student-progress-completed-count";

export async function ProgressAndCompletedSection() {
  const result = await getStudentCourseProgressCompletedCount();
  // console.log("result result:", result);

  if (result?.error || !result?.data) {
    console.error("Failed to fetch course progress:", result?.error);
    // Return static fallback instead of null for better UX
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Contrast}
          label="In Progress"
          count="0 Courses"
          className="bg-white opacity-50"
        />
        <InfoCard
          icon={CircleCheck}
          label="Completed"
          count="0 Courses"
          variant="success"
          className="bg-white opacity-50"
        />
      </div>
    );
  }

  const inProgressCount = result?.data.inProgressCourses || 0;
  const completedCount = result?.data.completedCourses || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InfoCard
        icon={Contrast}
        label="In Progress"
        count={`${inProgressCount} ${
          inProgressCount === 1 ? "Course" : "Courses"
        }`}
        className="bg-white"
      />
      <InfoCard
        icon={CircleCheck}
        label="Completed"
        count={`${completedCount} ${
          completedCount === 1 ? "Course" : "Courses"
        }`}
        variant="success"
        className="bg-white"
      />
    </div>
  );
}
