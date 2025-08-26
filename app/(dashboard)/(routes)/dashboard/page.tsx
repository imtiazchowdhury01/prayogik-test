// @ts-nocheck
export const dynamic = "force-dynamic";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { CoursesTab } from "./_components/courses-tab";

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

  return (
    <div className="space-y-6">
      {/* Render the info cards for courses in progress and completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      {/* Render the list of courses */}
      {/* <CoursesList
        userId={userId}
        items={[...coursesInProgress, ...completedCourses]}
        purchasedCourseIds={purchasedCourseIds}
      /> */}

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
