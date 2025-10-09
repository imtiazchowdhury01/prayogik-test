//@ts-nocheck
import { ReferralDashboard } from "@/components/referral/referral-dashboard";
import type { ReferralDashboardData, Purchase } from "@/types/referral";
import { cookies } from "next/headers";

export default async function TeacherOrAffiliateReferralPage() {
  const cookieStore = cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/referrals/stats`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );
  const result = await res.json();

  return (
    <div className="mx-auto py-2">
      <ReferralDashboard data={result || []} />
    </div>
  );
}
