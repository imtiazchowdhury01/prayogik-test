// @ts-nocheck
export const dynamic = "force-dynamic";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CheckCircle, Circle, Clock, Info } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { CoursesTab } from "./_components/courses-tab";
import { formatDateToBangla } from "@/lib/utils/stringUtils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const { userId } = await getServerUserSession();

  // If userId is not available, redirect to home page

  if (!userId) {
    return redirect("/");
  }

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
  console.log("subscription result:", subscription);
  return (
    <div className="space-y-6">
      {subscription?.status === "EXPIRED" && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg shadow-sm bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700">
              আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে{" "}
              {formatDateToBangla(new Date(subscription?.expiresAt))}। সকল
              কোর্সের ফ্রি এক্সেস পেতে অনুগ্রহ করে সাবস্ক্রাইব করুন।
            </span>
          </div>
          <Link href="/prime">
            <Button className="bg-brand hover:bg-teal-700 text-white">
              {subscription?.type === "Trial" &&
              subscription?.status === "EXPIRED"
                ? "রিনিউ করুন"
                : "আপগ্রেড করুন "}
            </Button>
          </Link>
        </div>
      )}
      {/* Render the info cards for courses in progress and completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
          className="bg-white"
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
          className="bg-white"
        />
      </div>
      <CoursesTab
        userId={userId}
        purchasedCourses={[...coursesInProgress, ...completedCourses]}
        purchasedCourseIds={purchasedCourseIds}
        isSubscriber={isSubscriber}
        subscription={subscription}
        subscribedCourses={subscribedCourses}
      />
    </div>
  );
}
