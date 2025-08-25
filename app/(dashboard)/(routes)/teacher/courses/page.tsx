// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";

// Server component
const TeacherCourses = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const teacherProfileId = await useTeacherProfile(userId);

  const response = await clientApi.getTeacherCoursesQuery({
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });
  const courses = response?.body?.courses || [];

  const convertData = (data) => {
    return data.map((item) => ({
      ...item,
      isAuthor: item.teacherProfileId === teacherProfileId,
    }));
  };

  return (
    <div className="flex flex-col flex-1 h-full space-y-8">
      <DataTable data={convertData(courses)} columns={columns} statuses={[]} />
    </div>
  );
};

export default TeacherCourses;
