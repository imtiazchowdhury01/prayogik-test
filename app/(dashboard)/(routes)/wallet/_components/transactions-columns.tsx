// @ts-nocheck
"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  creditsToBdt,
  getTransactionTypeBgColor,
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from "@/lib/utils/wallet/walletUtils";
import { TransactionDetails } from "./data-table-transaction-details";

// Loose typing to avoid strict TS issues in various contexts
export const transactionsColumns: ColumnDef<any, any>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (info) => {
      const val = info.getValue();
      return (
        <span className={`inline-flex items-center rounded-full ${getTransactionTypeColor(val)}`}>
          {getTransactionTypeLabel(val)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: (info) => new Date(info.getValue() || Date.now()).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => {
      const val = info.getValue() || 0;
      const sign = val > 0 ? "+" : "";
      return (
        <div className={val < 0 ? "text-red-600" : "text-green-600"}>
          {sign}
          {Number(val).toLocaleString()}
          <span className="text-xs text-gray-500 ml-1">(৳{creditsToBdt(Math.abs(val))})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const s = info.getValue();
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {s === "COMPLETED" ? "Complete" : s}
        </span>
      );
    },
  },
  {
    accessorKey: "referenceId",
    header: "Reference ID",
    cell: (info) => {
      return <TransactionDetails/>
    },

  }
];

export default transactionsColumns;
