import { getServerUserSession } from "@/lib/getServerUserSession";
import { redirect } from "next/navigation";
import { Chart } from "./_components/chart";
import { DataCard } from "./_components/data-card";
import PageTitle from "@/components/pageTitle";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";

const AnalyticsPage = async () => {
  const session = await getServerUserSession();

  if (!session || !session.userId) {
    redirect("/");
  }

  try {
    const result = await clientApi.getTeacherAnalytics({
      extraHeaders: {
        cookie: cookies().toString()
      },
    });

    if (result.status !== 200) {
      throw new Error("Failed to fetch analytics");
    }
    const revenueData = result.body;
    
    return (
      <div>
        <PageTitle title="Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          <DataCard
            label="Total Revenue"
            value={revenueData?.totalRevenue}
            shouldFormat
          />
          <DataCard label="Total Sales" value={revenueData?.totalSalesCount} />
        </div>
        <Chart data={revenueData?.courseSales} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching revenue and sales data:", error);
    return <p>Error fetching revenue data.</p>;
  }
};

export default AnalyticsPage;
