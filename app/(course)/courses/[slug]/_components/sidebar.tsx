//@ts-nocheck
import { fetchSubscriptionDisounts } from "@/services";
import StudentSidebar from "./student-sidebar";
import VisitorSidebar from "./visitor-sidebar";
import { fetchUserSubscription } from "@/services/user";

export default async function Sidebar({
  course,
  access,
  lesson,
  videoUrl,
  onVideoUrlUpdate,
  userId,
  plan,
  preview,
  paymentStatus,
}) {
  const salesData = await fetchSubscriptionDisounts();
  const subscriptionsData = await fetchUserSubscription();

  return (
    <div>
      {access ? (
        <StudentSidebar
          courseSlug={course?.slug}
          lesson={lesson}
          videoUrl={videoUrl}
          onVideoUrlUpdate={onVideoUrlUpdate}
        />
      ) : (
        <VisitorSidebar
          course={course}
          access={access}
          userId={userId}
          salesData={salesData}
          subscriptionsData={subscriptionsData}
          preview={preview}
          plan={plan}
          paymentStatus={paymentStatus}
        />
      )}
    </div>
  );
}

Sidebar.Skeleton = () => {
  return (
    <div className="mt-4 border rounded-lg p-6 bg-gray-50 border-[#4AAFA6]">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-brand-primary-light rounded w-1/2"></div>
        <div className="rounded-lg p-6 border">
          <div className="h-4 bg-brand-primary-light rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-brand-primary-light rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-brand-primary-light rounded"></div>
        </div>
        <div className="rounded-lg p-6 border">
          <div className="h-4 bg-brand-primary-light rounded w-2/3 mb-2"></div>
          <div className="h-8 bg-brand-primary-light rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-brand-primary-light rounded"></div>
        </div>
      </div>
    </div>
  );
};
