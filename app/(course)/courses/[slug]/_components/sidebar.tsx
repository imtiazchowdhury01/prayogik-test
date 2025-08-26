//@ts-nocheck
import StudentSidebar from "./student-sidebar";
import VisitorSidebar from "./visitor-sidebar";

export default function Sidebar({
  course,
  access,
  lesson,
  videoUrl,
  onVideoUrlUpdate,
  userId,
  salesData,
  subscriptionsData,
  plan,
  preview,
  paymentStatus,
}) {
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
