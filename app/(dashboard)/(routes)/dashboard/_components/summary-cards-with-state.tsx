"use client";

import { useDashboardTab } from "@/hooks/use-dashboard-tab";
import { SummaryCards } from "./summary-cards";

interface SummaryCardsWithStateProps {
  dashboardMetrics?: {
    purchasedCourses: number;
    purchasedCertificationCoursesCount: number;
    subscriptionCourses: number;
    registeredEvents: number;
    trends?: {
      purchasedCoursesLastMonth: number;
      newSubscriptionCourses: number;
      eventsThisWeek: number;
    };
  };
}

export function SummaryCardsWithState({
  dashboardMetrics,
}: SummaryCardsWithStateProps) {
  const { setActiveTab } = useDashboardTab();

  return (
    <SummaryCards
      purchasedCourses={dashboardMetrics?.purchasedCourses}
      purchasedCertificationCoursesCount={
        dashboardMetrics?.purchasedCertificationCoursesCount
      }
      subscriptionCourses={dashboardMetrics?.subscriptionCourses}
      registeredEvents={dashboardMetrics?.registeredEvents}
      trends={dashboardMetrics?.trends}
      onTabChange={setActiveTab}
    />
  );
}
