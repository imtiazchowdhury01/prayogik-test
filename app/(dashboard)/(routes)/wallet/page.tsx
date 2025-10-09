import React from "react";
import WalletClient from "./_components/wallet-page";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { fetchJson } from "@/lib/utils/fetchApi";
import { ReferrerType } from "@prisma/client";
import { db } from "@/lib/db";

export default async function MyWalletPage() {
  const { userId, role } = await getServerUserSession();

  if (!userId) {
    return (
      <WalletClient
        initialWalletBalance={null}
        initialTransactions={[]}
        initialExpiringCredits={[]}
        initialInvoices={[]}
      />
    );
  }

  // Call the API endpoints in parallel
  const [balanceResp, txResp, expiringResp, purchasesResp] = await Promise.all([
    fetchJson(`/api/wallet/balance?userId=${encodeURIComponent(userId)}`),
    fetchJson(
      `/api/wallet/transactions?userId=${encodeURIComponent(userId)}&limit=50`
    ),
    fetchJson(`/api/wallet/expiring?userId=${encodeURIComponent(userId)}`),
    fetchJson(
      `/api/wallet/purchases?userId=${encodeURIComponent(userId)}&limit=20`
    ),
  ]);

  let pendingCommissions = null;
  if (role === ReferrerType.TEACHER || role === ReferrerType.AFFILIATE) {
    try {
      const pendingCommissionTotal = await db.referrerCommission.aggregate({
        _sum: {
          amountTk: true,
        },
        where: {
          beneficiaryUserId: userId,
          status: "PENDING",
        },
      });

      pendingCommissions = pendingCommissionTotal._sum.amountTk ?? 0;
    } catch (e) {
      pendingCommissions = null;
    }
  }

  const initialWalletBalance = balanceResp?.success ? balanceResp.data : null;
  const initialTransactions = txResp?.success
    ? txResp.data.transactions ?? txResp.data
    : [];
  const initialExpiringCredits = expiringResp?.success
    ? expiringResp.data ?? []
    : [];
  const initialInvoices = purchasesResp?.success
    ? purchasesResp.data?.purchases ?? purchasesResp.data ?? []
    : [];

  return (
    <WalletClient
      initialWalletBalance={initialWalletBalance}
      initialTransactions={initialTransactions || []}
      initialExpiringCredits={initialExpiringCredits || []}
      initialInvoices={initialInvoices || []}
      role={role}
      pendingCommissions={pendingCommissions}
    />
  );
}
