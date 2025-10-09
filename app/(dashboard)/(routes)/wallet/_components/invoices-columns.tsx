// @ts-nocheck
"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

export const invoicesColumns: ColumnDef<any, any>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: (info) => info.getValue() ?? "-",
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
    accessorKey: "totalAmountTk",
    header: "Total (৳)",
    cell: (info) => info.getValue()?.toLocaleString?.() ?? info.getValue(),
  },
  {
    accessorKey: "creditsUsedTk",
    header: "Credits Used (৳)",
    cell: (info) => info.getValue()?.toLocaleString?.() ?? info.getValue(),
  },
  {
    accessorKey: "remainingAmountTk",
    header: "Remaining (৳)",
    cell: (info) => info.getValue()?.toLocaleString?.() ?? info.getValue(),
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: (info) => {
      const s = info.getValue();
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {s === "COMPLETED" ? "Paid" : s}
        </span>
      );
    },
  },
];

export default invoicesColumns;
