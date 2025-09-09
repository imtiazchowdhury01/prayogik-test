import { getDashboardMetricsWithTrendsDBCall } from "@/lib/data-access-layer/student-dashboard";
import { DashboardWrapper } from "./dashboard-wrapper";
import { getServerUserSession } from "@/lib/getServerUserSession";

// Server component for Dashboard Summary - Only fetch metrics initially
export async function DashboardSummaryServer() {
  // Only fetch dashboard metrics initially, other data will be fetched lazily
  const { userId } = await getServerUserSession();
  if (!userId) {
    return null;
  }
  const dashboardMetrics = await getDashboardMetricsWithTrendsDBCall(userId);
  // console.log("dashboardMetrics result:", dashboardMetrics);

  return (
    <DashboardWrapper userId={userId} dashboardMetrics={dashboardMetrics} />
  );
}
