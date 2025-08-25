// @ts-nocheck
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  const userId = await session?.user?.id;
  // Check if admin user or teacher
  const teacher = await db.teacherProfile.findUnique({
    where: {
      userId,
      teacherStatus: "VERIFIED",
    },
  });

  if (!teacher || session?.user?.role !== "TEACHER") {
    return redirect("/dashboard");
  }

  return <div className="w-full">{children}</div>;
};

export default TeacherLayout;
