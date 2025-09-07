"use client";

import { useState } from "react";
import { CoursesTab } from "./courses-tab";
import { DashboardSummary } from "./dashboard-summary";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./info-card";

export type TabValue = "purchased" | "subscription" | 'certificate' | "event";

interface DashboardClientWrapperProps {
  // Dashboard metrics
  dashboardMetrics: {
    purchasedCourses: number;
    subscriptionCourses: number;
    registeredEvents: number;
    trends?: {
      purchasedCoursesLastMonth: number;
      newSubscriptionCourses: number;
      eventsThisWeek: number;
    };
  };
  
  // Course data
  coursesData: {
    completedCourses: any[];
    coursesInProgress: any[];
    purchasedCourseIds: string[];
    subscribedCourses: any[];
    isSubscriber: boolean;
    subscription: any;
  };
  
  // Events data
  registeredEvents: any[];
  
  // User data
  userId: string;
}

export function DashboardClientWrapper({
  dashboardMetrics,
  coursesData,
  registeredEvents,
  userId,
}: DashboardClientWrapperProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("purchased");

  return (
    <>
      {/* Dashboard Summary */}
      <DashboardSummary
        purchasedCourses={dashboardMetrics.purchasedCourses}
        subscriptionCourses={dashboardMetrics.subscriptionCourses}
        registeredEvents={dashboardMetrics.registeredEvents}
        trends={dashboardMetrics.trends}
        onTabChange={setActiveTab}
      />

      {/* Render the info cards for courses in progress and completed */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesData.coursesInProgress.length}
          className="bg-white"
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={coursesData.completedCourses.length}
          variant="success"
          className="bg-white"
        />
      </div> */}

      <CoursesTab
        userId={userId}
        purchasedCourses={[...coursesData.coursesInProgress, ...coursesData.completedCourses]}
        purchasedCourseIds={coursesData.purchasedCourseIds}
        isSubscriber={coursesData.isSubscriber}
        subscription={coursesData.subscription}
        subscribedCourses={coursesData.subscribedCourses}
        RegisterEvents={registeredEvents}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}