import { getDashboardMetricsWithTrendsDBCall } from "@/lib/data-access-layer/student-dashboard";
import { SummaryAndCourses } from "./summary-and-courses";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function SummaryAndCoursesWrapper() {
  const { userId } = await getServerUserSession();
  if (!userId) {
    return null;
  }
  const dashboardMetrics = await getDashboardMetricsWithTrendsDBCall(userId);

  return (
    <SummaryAndCourses userId={userId} dashboardMetrics={dashboardMetrics} />
  );
}
