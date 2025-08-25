// @ts-nocheck
import { getServerUserSession } from "@/lib/getServerUserSession";
import { redirect } from "next/navigation";
import EarningsCalculator from "./_components/earning-calculator";
import PageTitle from "@/components/pageTitle";

export default async function MonthlyEarnings() {
  const { userId, isAdmin } = await getServerUserSession();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="space-y-4">
      <PageTitle title="Monthly Earnings Generator" />
      <EarningsCalculator isAdmin={isAdmin} />
    </div>
  );
}
