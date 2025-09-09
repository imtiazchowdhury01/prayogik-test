// _components/async-dashboard-components.tsx
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./info-card";
import { ClientDashboardSummary } from "./client-dashboard-summary";
import { getDashboardMetricsWithTrendsDBCall } from "@/lib/data-access-layer/student-dashboard";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { TabValue } from "./dashboard-wrapper";

// Server component for Info Cards
export async function AsyncInfoCards({ userId }: { userId: string }) {
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
        countComponent={coursesInProgress.length}
        className="bg-white"
      />
      <InfoCard
        icon={CheckCircle}
        label="Completed"
        countComponent={completedCourses.length}
        variant="success"
        className="bg-white"
      />
    </div>
  );
}

// Server component wrapper for Dashboard Summary
export async function AsyncDashboardSummary({
  userId,
  onTabChange,
}: {
  userId: string;
  onTabChange?: (tab: TabValue) => void;
}) {
  const dashboardMetrics = await getDashboardMetricsWithTrendsDBCall(userId);

  return (
    <DashboardSummaryWrapper
      dashboardMetrics={dashboardMetrics}
      onTabChange={onTabChange}
    />
  );
}

// Client wrapper component for Dashboard Summary
function DashboardSummaryWrapper({
  dashboardMetrics,
  onTabChange,
}: {
  dashboardMetrics: any;
  onTabChange?: (tab: TabValue) => void;
}) {
  return (
    <ClientDashboardSummary
      purchasedCourses={dashboardMetrics.purchasedCourses}
      subscriptionCourses={dashboardMetrics.subscriptionCourses}
      registeredEvents={dashboardMetrics.registeredEvents}
      trends={dashboardMetrics.trends}
      onTabChange={onTabChange}
    />
  );
}
