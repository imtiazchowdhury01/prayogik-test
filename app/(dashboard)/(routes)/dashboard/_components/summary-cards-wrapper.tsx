import { getDashboardMetricsWithTrendsDBCall } from "@/lib/data-access-layer/student-dashboard";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { SummaryCardsWithState } from "./summary-cards-with-state";

export async function SummaryCardsWrapper() {
  const { userId } = await getServerUserSession();
  if (!userId) {
    return null;
  }
  const dashboardMetrics = await getDashboardMetricsWithTrendsDBCall(userId);

  return <SummaryCardsWithState dashboardMetrics={dashboardMetrics} />;
}
