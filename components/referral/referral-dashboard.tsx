// components/referral/referral-dashboard.tsx
"use client";

import { ReferralStatsCards } from "./referral-stats-cards";
import { ReferralLinkShare } from "./referral-link-share";
import { ReferralsTable } from "./referrals-table";

interface ReferralDashboardProps {
  data: any;
}

export function ReferralDashboard({ data }: ReferralDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral</h1>
        <p className="text-muted-foreground">
          Track your referrals and earn rewards
        </p>
      </div>

      <ReferralStatsCards stats={data?.summary || data.stats} role={data?.role} />
      <ReferralLinkShare referralCode={data.referralCode} />
      <ReferralsTable referrals={data.referrals} />
    </div>
  );
}