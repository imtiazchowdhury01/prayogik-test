// @ts-nocheck
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TeacherForm from "./_components/TeacherForm";
import TeacherStatusAlert from "@/app/(site)/_components/teacher/TeacherStatusAlert";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { fetchUserProfile } from "@/services/user";
import TeacherApplicationStatus from "@/app/(site)/_components/teacher/TeacherApplicationStatus";
import TeacherApplicationForm from "@/app/(site)/_components/teacher/TeacherApplicationForm";
import TeacherApplicationStatusCard from "@/app/(site)/_components/teacher/TeacherApplicationStatusCard";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";

export default async function ApplyForTeaching() {
  // Get session server-side
  const session = await getServerSession(authOptions);
  const planId = (await getSubscriptionDBCall()).find((p) => p.isTrial)?.id;

  // Handle unauthenticated users
  if (!session) {
    return (
      <div className="p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <TeacherForm planId={planId} />
        </div>
      </div>
    );
  }

  // Fetch user data for authenticated users
  const userData = await fetchUserProfile(session.user.id);
  const teacherStatus = userData?.teacherProfile?.teacherStatus;
  const applicationDetails = {
    applicationNumber: userData?.teacherProfile?.id,
    applicantName: userData?.name,
    specializedField: userData?.teacherProfile?.subjectSpecializations,
    submissionDate: userData?.teacherProfile?.createdAt,
    email: userData?.email,
    phone: userData?.phoneNumber,
    updatedAt: userData?.teacherProfile?.updatedAt,
  };

    // If teacher already applied (status not NONE), redirect to dashboard
  // if (session?.user && teacherStatus && teacherStatus !== "NONE") {
  //   return redirect("/dashboard");
  // }

  // Show status card if user has teacher status (not NONE)
  if (session?.user && teacherStatus && teacherStatus !== "NONE") {
    return (
      <div className="max-w-4xl mx-auto">
        <TeacherApplicationStatusCard
          status={teacherStatus}
          applicationDetails={applicationDetails}
        />
      </div>
    );
  }
  // default
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <TeacherForm planId={planId} />
      </div>
    </div>
  );
}
