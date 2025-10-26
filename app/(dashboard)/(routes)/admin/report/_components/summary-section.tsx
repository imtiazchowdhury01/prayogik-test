// app/(dashboard)/sales/_components/summary-section.tsx
import { Suspense } from "react";
import { SummaryCard } from "./summary-card";
import { SummarySkeleton } from "./summary-skeleton";

interface SummarySectionProps {
  summary: {
    courses: { count: number; revenue: number };
    subscriptions: { count: number; revenue: number };
    events: { count: number; revenue: number };
    certifications: { count: number; revenue: number };
  };
}

export function SummarySection({ summary }: SummarySectionProps) {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Courses"
          value={summary.courses.count}
          revenue={summary.courses.revenue}
          type="course"
        />
        <SummaryCard
          title="Subscriptions"
          value={summary.subscriptions.count}
          revenue={summary.subscriptions.revenue}
          type="subscription"
        />
        <SummaryCard
          title="Events"
          value={summary.events.count}
          revenue={summary.events.revenue}
          type="event"
        />
        <SummaryCard
          title="Certifications"
          value={summary.certifications.count}
          revenue={summary.certifications.revenue}
          type="certification"
        />
      </div>
    </Suspense>
  );
}
