// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getTeachersByAdmin } from "@/services/admin";

// Server component
const TeachersList = async () => {
  const statuses = [
    { value: "NONE", label: "None" }, // Removed extra space
    { value: "VERIFIED", label: "Verified" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
  ];

  let data = [];

  try {
    const response = await getTeachersByAdmin();

    data = convertData(response);
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
    id: item.teacherProfile?.id,
    name: item.name,
    email: item.email,
    avatarUrl: item.avatarUrl,
    emailVerified: item.emailVerified,
    isAdmin: item.isAdmin,
    isSuperAdmin: item.isSuperAdmin,
    status: item.teacherProfile?.teacherStatus,
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

export default TeachersList;
