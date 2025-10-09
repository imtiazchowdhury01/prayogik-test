export const dynamic = "force-dynamic";
import { ProgressAndCompletedSection } from "./_components/progress-and-completed-section";
import { Suspense } from "react";
import { DashboardSummarySkeleton } from "./_components/dashboard-skeleton";
import { SummaryCardsWrapper } from "./_components/summary-cards-wrapper";
import { CoursesTabWrapper } from "./_components/courses-tab-wrapper";
import { DashboardTabProvider } from "@/hooks/use-dashboard-tab";
import SubscriptionMessageContent from "./_components/dashboard-subscription-message";

export default function Dashboard() {
  return (
    <DashboardTabProvider>
      <div className="space-y-6">
        {/* subscription message */}
        <Suspense fallback={null}>
          <SubscriptionMessageContent />
        </Suspense>

        <h2 className="text-3xl font-semibold">Dashboard</h2>
        {/* complete and progress cards  */}
        <Suspense fallback={null}>
          <ProgressAndCompletedSection />
        </Suspense>
        {/* summary cards */}
        <Suspense fallback={<DashboardSummarySkeleton />}>
          <SummaryCardsWrapper />
        </Suspense>
        {/* courses tab - renders immediately */}
        <CoursesTabWrapper />
      </div>
    </DashboardTabProvider>
  );
}
