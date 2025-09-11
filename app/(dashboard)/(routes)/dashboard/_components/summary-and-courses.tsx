//@ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { SummaryCards } from "./summary-cards";
import { CoursesTab } from "./courses-tab";
export type TabValue = "purchased" | "subscription" | "certificate" | "event";

interface SummaryAndCoursesProps {
  userId: string;
  dashboardMetrics?: {
    purchasedCourses: number;
    subscriptionCourses: number;
    registeredEvents: number;
    trends?: {
      purchasedCoursesLastMonth: number;
      newSubscriptionCourses: number;
      eventsThisWeek: number;
    };
  };
}

export function SummaryAndCourses({
  userId,
  dashboardMetrics,
}: SummaryAndCoursesProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("purchased");

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
  }, []);

  return (
    <>
      {/* Dashboard Summary */}
      {dashboardMetrics && (
        <SummaryCards
          purchasedCourses={dashboardMetrics.purchasedCourses}
          subscriptionCourses={dashboardMetrics.subscriptionCourses}
          registeredEvents={dashboardMetrics.registeredEvents}
          trends={dashboardMetrics.trends}
          onTabChange={handleTabChange}
        />
      )}

      {/* Courses Tab */}
      <CoursesTab
        userId={userId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
