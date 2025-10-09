// @ts-nocheck
"use client";
import { useSession } from "next-auth/react";
import { CoursesTab, TabValue } from "./courses-tab";
import { useDashboardTab } from "@/hooks/use-dashboard-tab";
export function CoursesTabWrapper() {
  const { activeTab, setActiveTab } = useDashboardTab();
  const { data } = useSession();

  if (!data?.user?.id) return null;

  return (
    <CoursesTab
      userId={data?.user?.id}
      activeTab={activeTab as TabValue}
      onTabChange={setActiveTab}
    />
  );
}
