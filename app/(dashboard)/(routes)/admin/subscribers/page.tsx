// @ts-nocheck
export const dynamic = "force-dynamic";

import { clientApi } from "@/lib/utils/openai/client";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { cookies } from "next/headers";

const Subscribers = async () => {
  // subscription status
  const statuses = [
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "INACTIVE", label: "INACTIVE" },
    { value: "EXPIRED", label: "EXPIRED" },
    { value: "CANCELLED", label: "CANCELLED" },
    { value: "PENDING", label: "PENDING" },
  ];

  let data = [];

  try {
    const response = await clientApi.getSubscribers({
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });

    if (response.body) {
      data = convertSubscriberData(response.body);
    }
  } catch (err) {
    console.error("Failed to fetch subscribers:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} statuses={statuses} />
    </div>
  );
};

// Convert the subscriber data to match your table format
const convertSubscriberData = (subscribers) => {
  return subscribers.map((subscriber) => {
    // Handle cases where subscriptionPlan or studentProfile might be null
    const subscriptionPlanName = subscriber.subscriptionPlan?.name || "No Plan";
    const studentProfile = subscriber.studentProfile || {};
    const user = studentProfile.user || {};

    return {
      id: subscriber.id, // Fallback to subscription id if user id not available
      name: user.name || "Unknown",
      email: user.email || "",
      avatarUrl: user.avatarUrl || "",
      role: user.role || "STUDENT",
      subscription: subscriptionPlanName,
      subscriptionStatus: subscriber.status || "",
      subscriptionExpiresAt: subscriber.expiresAt,
      subscriptionCreatedAt: subscriber.createdAt,
      enrolledCoursesCount: studentProfile?.enrolledCourseIds?.length || 0,
      // Add any additional fields that your columns expect
      updatedAt: subscriber.updatedAt,
      // Handle null values for nested objects
      studentProfileId: studentProfile.id || "",
      userId: user.id || "",
    };
  });
};

export default Subscribers;
