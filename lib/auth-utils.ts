// lib/auth-utils.ts
export const isActiveTeacher = (user: any) =>
  user?.info?.teacherProfile?.teacherStatus === "VERIFIED";

export const hasActivePlan = (user: any) => user?.currentPlan !== "NONE";

export const hasActiveSubscription = (user: any) =>
  user?.info?.studentProfile?.subscription?.status === "ACTIVE";
