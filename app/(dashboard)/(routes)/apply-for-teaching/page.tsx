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

export default async function ApplyForTeaching() {
  // Get session server-side
  const session = await getServerSession(authOptions);

  // Handle unauthenticated users
  if (!session?.user) {
    redirect("/login"); // Redirect to login if user is not authenticated
  }

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

  return (
    <div>
      {teacherStatus && teacherStatus !== "NONE" ? (
        <div className="max-w-4xl mx-auto">
          {/* render status */}
          <TeacherApplicationStatusCard
            status={teacherStatus}
            applicationDetails={applicationDetails}
          />
        </div>
      ) : (
        <div className="p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <TeacherForm />
          </div>
        </div>
      )}
    </div>
  );
}
