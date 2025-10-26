import { getSalesData } from "@/lib/data-access-layer/sales";
import { SalesReportDashboard } from "./_components/sales-report-dashboard";

export default async function SalesPage() {
  const salesData = await getSalesData({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  // console.log('salesData result:', salesData);

  return (
    <div className="min-h-screen">
      <SalesReportDashboard salesData={salesData} />
    </div>
  );
}
