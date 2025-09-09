//@ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { ClientDashboardSummary } from "./client-dashboard-summary";
import { CoursesTab } from "./courses-tab";
export type TabValue = "purchased" | "subscription" | "certificate" | "event";

interface DashboardWrapperProps {
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

export function DashboardWrapper({
  userId,
  dashboardMetrics,
}: DashboardWrapperProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("purchased");

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
  }, []);

  return (
    <>
      {/* Dashboard Summary */}
      {dashboardMetrics && (
        <ClientDashboardSummary
          purchasedCourses={dashboardMetrics.purchasedCourses}
          subscriptionCourses={dashboardMetrics.subscriptionCourses}
          registeredEvents={dashboardMetrics.registeredEvents}
          trends={dashboardMetrics.trends}
          onTabChange={handleTabChange}
        />
      )}

      {/* Lazy Loading Courses Tab */}
      <CoursesTab
        userId={userId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
