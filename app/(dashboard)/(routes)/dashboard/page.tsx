// @ts-nocheck
export const dynamic = "force-dynamic";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { formatDateToBangla } from "@/lib/utils/stringUtils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllRegisteredEventDBCall } from "@/lib/data-access-layer/event-registration";
import { getDashboardMetricsWithTrendsDBCall } from "@/lib/data-access-layer/student-dashboard";
import { DashboardClientWrapper } from "./_components/dashbooard-wrapper";

export default async function Dashboard() {
  const { userId } = await getServerUserSession();

  // If userId is not available, redirect to home page
  if (!userId) {
    return redirect("/");
  }

  const [dashboardMetrics, registeredEvents] = await Promise.all([
    getDashboardMetricsWithTrendsDBCall(userId),
    getAllRegisteredEventDBCall(userId),
  ]);

  
  // Initialize variables to hold course data
  let completedCourses = [];
  let coursesInProgress = [];
  let purchasedCourseIds = [];
  let subscribedCourses = [];
  let isSubscriber: boolean = false;
  let subscription: any = null;
  
  try {
    // Fetch dashboard courses using the client API
    // Pass cookies for authentication
    const response = await clientApi.getDashboardCourses({
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });

    // If the response is successful, extract course data
    if (response.status === 200) {
      completedCourses = response.body.completedCourses || [];
      coursesInProgress = response.body.coursesInProgress || [];
      purchasedCourseIds = response.body.purchasedCourseIds || [];
      subscribedCourses = response.body.subscribedCourses || [];
      isSubscriber = response.body.isSubscriber;
      subscription = response.body.subscription;
    }
  } catch (err) {
    console.error("Failed to fetch dashboard courses:", err);
  }

  // Prepare data for client wrapper
  const coursesData = {
    completedCourses,
    coursesInProgress,
    purchasedCourseIds,
    subscribedCourses,
    isSubscriber,
    subscription,
  };

  return (
    <div className="space-y-6">
      {/* Subscription notifications */}
      {subscription?.isTrial && subscription?.status === "ACTIVE" && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg shadow-sm bg-yellow-200/50 border-yellow-30 text-primary">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700">
              আপনার ট্রায়াল সাবস্ক্রিপশন চলছে।{" "}
              {(() => {
                const today = new Date();
                const trialEndsAt = new Date(subscription?.trialEndsAt);
                const remainingDays = Math.max(
                  0,
                  Math.ceil(
                    (trialEndsAt.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
                return ` আপনার সাবস্ক্রিপশন আর ${remainingDays} দিন বাকি রয়েছে।`;
              })()}
            </span>
          </div>
          <Link href="/prime">
            <Button className="bg-secondary-button transition-all duration-300 hover:bg-secondary-button hover:opacity-85 text-white">
              প্ল্যান আপগ্রেড করুন
            </Button>
          </Link>
        </div>
      )}
      
      {subscription?.status === "EXPIRED" && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg shadow-sm bg-yellow-200/50 border-yellow-30 text-primary">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700">
              আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে{" "}
              {formatDateToBangla(new Date(subscription?.expiresAt))}। সকল
              কোর্সের ফ্রি এক্সেস পেতে অনুগ্রহ করে সাবস্ক্রাইব করুন।
            </span>
          </div>
          <Link href="/prime">
            <Button className="bg-secondary-button transition-all duration-300 hover:bg-secondary-button hover:opacity-85 text-white">
              {subscription?.type === "Trial" &&
              subscription?.status === "EXPIRED"
                ? "রিনিউ করুন"
                : "আপগ্রেড করুন "}
            </Button>
          </Link>
        </div>
      )}

      {/* Client Wrapper with all interactive components */}
      <DashboardClientWrapper
        dashboardMetrics={dashboardMetrics}
        coursesData={coursesData}
        registeredEvents={registeredEvents}
        userId={userId}
      />
    </div>
  );
}