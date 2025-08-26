import type React from "react";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { CourseRoadmap, CourseRoadmapStatus } from "@prisma/client";
import RoadmapHero from "./_components/RoadmapHero";
import StatsRoadmap from "./_components/StatsRoadmap";
import InProgressCourses from "./_components/InProgressCourses";
import PlannedCourses from "./_components/PlannedCourses";
import CompletedCourses from "./_components/CompletedCourses";

export default async function LandingPage() {
  const courseRoadmapsResponse = await clientApi.getCourseRoadmaps({
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });

  const roadmaps =
    (courseRoadmapsResponse?.body as { data?: CourseRoadmap[] })?.data || [];

  const plannedRoadmaps = roadmaps.filter(
    (r: CourseRoadmap) => r.status === CourseRoadmapStatus.PLANNED
  );
  const inProgressRoadmaps = roadmaps.filter(
    (r: CourseRoadmap) => r.status === CourseRoadmapStatus.IN_PROGRESS
  );
  const completedRoadmaps = roadmaps.filter(
    (r: CourseRoadmap) => r.status === CourseRoadmapStatus.COMPLETED
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <RoadmapHero
        roadmaps={roadmaps}
        plannedRoadmaps={plannedRoadmaps}
        inProgressRoadmaps={inProgressRoadmaps}
        completedRoadmaps={completedRoadmaps}
      />

      {/* In Progress Section */}
      <InProgressCourses inProgressRoadmaps={inProgressRoadmaps} />

      {/* Planned Section */}
      <PlannedCourses plannedRoadmaps={plannedRoadmaps} />

      {/* Completed Section */}
      <CompletedCourses completedRoadmaps={completedRoadmaps} />
    </div>
  );
}
