export const dynamic = "force-dynamic";
import { ServerInfoCards } from "./_components/server-components";
import DashboardSubscriptionMessage from "./_components/dashboard-subscription-message";
import { Suspense } from "react";
import {
  DashboardSummarySkeleton,
  InfoCardSkeleton,
} from "./_components/dashboard-loading";
import { DashboardSummaryServer } from "./_components/DashboardSummaryServer";

export default async function Dashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <DashboardSubscriptionMessage />
      </Suspense>
      <Suspense fallback={<InfoCardSkeleton />}>
        <ServerInfoCards />
      </Suspense>
      <Suspense fallback={<DashboardSummarySkeleton />}>
        <DashboardSummaryServer />
      </Suspense>
    </div>
  );
}
