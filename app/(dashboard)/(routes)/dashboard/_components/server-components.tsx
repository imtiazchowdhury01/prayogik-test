import { clientApi } from "@/lib/utils/openai/client";
import { CheckCircle, Clock } from "lucide-react";
import { cookies } from "next/headers";
import { InfoCard } from "./info-card";
import { Suspense } from "react";
import { InfoCardCountSkeleton } from "./dashboard-loading";

// Server component for Info Cards
export async function ServerInfoCards() {
  let coursesInProgress = [];
  let completedCourses = [];

  try {
    const response = await clientApi.getDashboardCourses({
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });

    if (response.status === 200) {
      coursesInProgress = response.body.coursesInProgress || [];
      completedCourses = response.body.completedCourses || [];
    }
  } catch (err) {
    console.error("Failed to fetch course progress:", err);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InfoCard
        icon={Clock}
        label="In Progress"
        countComponent={
          <Suspense fallback={<InfoCardCountSkeleton />}>
            <ServerCourseCount type="inProgress" />
          </Suspense>
        }
        className="bg-white"
      />
      <InfoCard
        icon={CheckCircle}
        label="Completed"
        countComponent={
          <Suspense fallback={<InfoCardCountSkeleton />}>
            <ServerCourseCount type="completed" />
          </Suspense>
        }
        variant="success"
        className="bg-white"
      />
    </div>
  );
}

async function ServerCourseCount({
  type,
}: {
  type: "inProgress" | "completed";
}) {
  let count = 0;
  try {
    const response = await clientApi.getDashboardCourses({
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });
    if (response.status === 200) {
      if (type === "inProgress") {
        count = response.body.coursesInProgress?.length || 0;
      } else {
        count = response.body.completedCourses?.length || 0;
      }
    }
  } catch (err) {
    console.error("Failed to fetch course progress:", err);
  }

  return (
    <p className="text-gray-500 text-sm">
      {count} {count === 1 ? "Course" : "Courses"}
    </p>
  );
}
