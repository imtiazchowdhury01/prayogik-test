import { ReferralDashboard } from "@/components/referral/referral-dashboard";
import { cookies } from "next/headers";

export default async function ReferralPage() {
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
