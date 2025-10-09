"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { WalletBalance } from "@/types/wallet";
import type { CreditLot, WalletTransaction } from "@prisma/client";
import { AlertCircle, CreditCard } from "lucide-react";
import { useState } from "react";
import { DataTable } from "./data-table";
import { InvoiceDataTable } from "./invoice-data-table";
import invoicesColumns from "./invoices-columns";
import transactionsColumns from "./transactions-columns";
import WalletStats from "./wallet-stats";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

type Props = {
  initialWalletBalance: WalletBalance | null;
  initialTransactions: WalletTransaction[];
  initialExpiringCredits: CreditLot[];
  initialInvoices?: any[];
  role?: string | null;
  pendingCommissions?: number | null;
};

export default function WalletClient({
  initialWalletBalance,
  initialTransactions,
  initialExpiringCredits,
  initialInvoices = [],
  role = null,
  pendingCommissions = null,
}: Props) {
  const [activeTab, setActiveTab] = useState("transaction");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    initialWalletBalance
  );
  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(initialTransactions);
  const [expiringCredits, setExpiringCredits] = useState<CreditLot[]>(
    initialExpiringCredits
  );
  const [error, setError] = useState<string | null>(null);

  const calculateExpiringIn30Days = () => {
    return expiringCredits.reduce(
      (sum, lot) => sum + (lot.remainingAmount || 0),
      0
    );
  };

  const filteredTransactions = transactions.filter((txn) =>
    (txn.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
      </div>

      <WalletStats
        role={role}
        walletBalance={walletBalance}
        pendingCommissions={pendingCommissions}
        expiringNext30={calculateExpiringIn30Days()}
      />

      <Card className="shadow-none">
        <div className="border-b border-gray-200">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab("transaction")}
              className={`py-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === "transaction"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Transaction History
            </button>
            <button
              onClick={() => setActiveTab("invoice")}
              className={`py-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === "invoice"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Invoice History
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "transaction" && (
            <div className="p-4">
              <DataTable
                columns={transactionsColumns}
                data={filteredTransactions}
                categories={[]}
              />
            </div>
          )}

          {activeTab === "invoice" && (
            <div className="p-4">
              <InvoiceDataTable
                columns={invoicesColumns}
                data={initialInvoices || []}
                categories={[]}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
