// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getUsersByAdmin } from "@/services/admin";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";

// Server component
const UserList = async () => {
  const statuses = [
    { value: "NONE", label: "None" }, // Removed extra space
    { value: "VERIFIED", label: "Verified" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
  ];

  let data = [];

  try {
    const response = await clientApi.getAdminUsers({
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });

    data = convertData(response.body || []);
  } catch (err) {
    console.error("Failed to fetch teachers details:", err);
  }
  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} statuses={statuses} />
    </div>
  );
};

const convertData = (data) => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    avatarUrl: item.avatarUrl,
    role: item.role,
    isAdmin: item.isAdmin,
    emailVerified: item.emailVerified,
    createdCoursesCount: item?.teacherProfile
      ? item?.teacherProfile?.createdCourses?.length
      : 0,
    enrolledCoursesCount: item?.studentProfile
      ? item?.studentProfile?.enrolledCourseIds?.length
      : 0,
    subscription: item?.studentProfile?.subscription?.subscriptionPlan?.name,
    subscriptionStatus: item?.studentProfile?.subscription?.status,
    isAdmin: item.isAdmin,
    isSuperAdmin: item.isSuperAdmin,
    gender: item.gender,
    teacherStatus: item.teacherProfile?.teacherStatus,
    role: item.role,
    teacherProfileId: item.teacherProfile?.id,
    subjectSpecializations: item.teacherProfile?.subjectSpecializations,
    certifications: item.teacherProfile?.certifications,
    yearsOfExperience: item.teacherProfile?.yearsOfExperience,
    totalSales: item.teacherProfile?.totalSales,
    lastPaymentDate: item.teacherProfile?.lastPaymentDate,
    lastPaymentAmount: item.teacherProfile?.lastPaymentAmount,
    teacherRank_id: item.teacherProfile?.teacherRankId,
    teacherRank_name: item.teacherProfile?.teacherRank?.name,
    teacherRank_description: item.teacherProfile?.teacherRank?.description,
    teacherRank_numberOfSales: item.teacherProfile?.teacherRank?.numberOfSales,
    teacherRank_feePercentage: item.teacherProfile?.teacherRank?.feePercentage,
  }));
};

export default UserList;
