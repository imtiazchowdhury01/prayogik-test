// Removing "use client" as this will be a server component
// @ts-nocheck
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TeacherForm from "./_components/TeacherForm";
import TeacherStatusAlert from "@/app/(site)/_components/teacher/TeacherStatusAlert";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { fetchUserProfile } from "@/services/user";

export default async function ApplyForTeaching() {
  // Get session server-side
  const session = await getServerSession(authOptions);

  // Handle unauthenticated users
  if (!session?.user) {
    redirect("/login"); // Redirect to login if user is not authenticated
  }

  const userData = await fetchUserProfile(session.user.id);
  const teacherStatus = userData?.teacherProfile?.teacherStatus;

  return (
    <div className="">
      {teacherStatus ? (
        <div className="min-h-screen pt-20">
          <TeacherStatusAlert status={teacherStatus} />
        </div>
      ) : (
        <div className="min-h-screen p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <TeacherForm />
          </div>
        </div>
      )}
    </div>
  );
}
