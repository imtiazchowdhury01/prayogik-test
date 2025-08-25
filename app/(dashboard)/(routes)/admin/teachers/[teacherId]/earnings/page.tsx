// @ts-nocheck
export const dynamic = "force-dynamic";

import PageTitle from "@/components/pageTitle";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getTeacherEarningsByAdmin } from "@/services/admin";

// Server component
const Earnings = async ({ params }) => {
  const { teacherId } = params;

  let data = [];

  try {
    data = await getTeacherEarningsByAdmin(teacherId);
  } catch (error) {
    console.error("Error fetching monthly earnings:", error);
  }

  const normalizedData = data.map((item) => ({
    id: item.id,
    month: item.month,
    year: item.year,
    total_earned: item.earned,
    total_paid: item.paid,
    balance_remaining: item.remaining,
    status: item.status,
  }));

  const statuses = [
    { value: "PAID", label: "PAID" },
    { value: "UNPAID", label: "UNPAID" },
    { value: "DUE", label: "DUE" },
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthNames.map((label, index) => ({
    value: index + 1,
    label: label,
  }));

  const years = [];

  for (let year = 2020; year <= 2040; year++) {
    years.push({
      value: year,
      label: year.toString(),
    });
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <PageTitle title="Earnings" url="/admin/teachers" />
      <DataTable
        data={normalizedData}
        columns={columns}
        statuses={statuses}
        months={months}
        years={years}
      />
    </div>
  );
};

export default Earnings;
