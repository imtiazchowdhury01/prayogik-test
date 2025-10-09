// components/referral-stats-cards.tsx
import {
  Users,
  TrendingUp,
  Wallet,
  DollarSign,
  Coins,
  CreditCard,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { Role } from "@prisma/client";

interface ReferralStatsCardsProps {
  stats: any; // We'll use any here since the shape varies by role
  role: Role;
}

export function ReferralStatsCards({ stats, role }: ReferralStatsCardsProps) {
  console.log('stats result:', stats);
  if (role === "STUDENT") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Referees"
          value={stats?.totalReferees}
          icon={Users}
        />
        <StatCard
          title="Prime Upgrades"
          value={stats?.totalPrimeUpgradedReferees}
          icon={TrendingUp}
        />
        <StatCard
          title="Current Credits"
          value={stats?.currentCredits || 0}
          icon={Coins}
        />
        <StatCard
          title="Used Credits"
          value={stats?.usedCredits || 0}
          icon={CreditCard}
        />
      </div>
    );
  }

  // console.log(stats, "stats in referral stats cards");
  // For TEACHER and AFFILIATE
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Referees"
        value={stats?.totalReferees}
        icon={Users}
      />
      <StatCard
        title="Prime Upgrades"
        value={stats?.totalPrimeUpgradedReferees}
        icon={TrendingUp}
      />
      <StatCard
        title="Cash Earnings"
        value={`BDT ${stats?.cashEarningsApproved + stats?.cashEarningsPaid || 0}`}
        icon={DollarSign}
      />
      <StatCard
        title="Lifetime Revenue"
        value={`BDT ${stats?.lifetimeRevenue || 0}`}
        icon={Wallet}
      />
    </div>
  );
}
