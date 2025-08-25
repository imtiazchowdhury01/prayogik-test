// @ts-nocheck
export const dynamic = "force-dynamic";

import PageTitle from "@/components/pageTitle";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getTeacherPaymentsByAdmin } from "@/services/admin";

// Server component
const Payments = async ({ params }) => {
  const { teacherId } = params;

  let data = [];
  data = await getTeacherPaymentsByAdmin(teacherId);

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
      <PageTitle title="Payments" url="/admin/teachers" />
      <DataTable
        data={data}
        columns={columns}
        statuses={statuses}
        months={months}
        years={years}
      />
    </div>
  );
};

export default Payments;
