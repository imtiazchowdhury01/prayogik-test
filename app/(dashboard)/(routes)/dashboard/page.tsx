export const dynamic = "force-dynamic";
import { ProgressAndCompletedSection } from "./_components/progress-and-completed-section";
import DashboardSubscriptionMessage from "./_components/dashboard-subscription-message";
import { Suspense } from "react";
import {
  DashboardSummarySkeleton,
} from "./_components/dashboard-skeleton";
import { SummaryAndCoursesWrapper } from "./_components/summary-and-courses-wrapper";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* subscription message */}
      <DashboardSubscriptionMessage />
      <h2 className="text-3xl font-semibold">Dashboard</h2>
      {/* complete and progress cards  */}
      <Suspense fallback={null}>
        <ProgressAndCompletedSection />
      </Suspense>
      {/* summary and course tab */}
      <Suspense fallback={<DashboardSummarySkeleton />}>
        <SummaryAndCoursesWrapper />
      </Suspense>
    </div>
  );
}
