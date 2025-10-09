"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Award, Clock, BarChart3 } from "lucide-react";
import { ReferrerType } from "@prisma/client";

type Props = {
  role?: string | null;
  walletBalance?: any;
  pendingCommissions?: number | null;
  expiringNext30?: number | null;
};

export default function WalletStats({
  role,
  walletBalance,
  pendingCommissions,
  expiringNext30,
}: Props) {
  // Prepare stats array for both roles but reuse same card design
  const stats =
    role === ReferrerType.TEACHER || role === ReferrerType.AFFILIATE
      ? (() => {
          return [
            {
              icon: BarChart3,
              title: "Total Earnings",
              subtitle: "Lifetime earnings (BDT)",
              value: (walletBalance?.totalCredits ?? 0).toLocaleString(),
              iconBg: "bg-purple-100",
              iconColor: "text-purple-600",
            },
            {
              icon: CreditCard,
              title: "Available Cash",
              subtitle: "After withdrawals (BDT)",
              value: (walletBalance?.availableCredits ?? 0).toLocaleString(),
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              icon: Award,
              title: "Pending Commissions",
              subtitle: "Awaiting payout (BDT)",
              value: (pendingCommissions ?? 0).toLocaleString(),
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },
          ];
        })()
      : [
          {
            icon: CreditCard,
            title: "Available Credits",
            subtitle: "Total earned",
            value: (walletBalance?.availableCredits ?? 0).toLocaleString(),
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            icon: Clock,
            title: "Due in 30 days",
            subtitle: "Expiring in 30 days",
            value: (expiringNext30 ?? 0).toLocaleString(),
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
          },
          {
            icon: BarChart3,
            title: "Total Credits",
            subtitle: "Total credits earned",
            value: (walletBalance?.totalCredits ?? 0).toLocaleString(),
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
          },
        ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="shadow-none hover:shadow-lg hover:-translate-y-1 duration-200 transition-all cursor-pointer"
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-4 mb-2">
              <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500 mb-2">{stat.subtitle}</p>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
