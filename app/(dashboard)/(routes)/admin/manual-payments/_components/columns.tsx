// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { capitalizeFirstLetter } from "@/lib/utils/stringUtils";
import { cn } from "@/lib/utils";
import {
  getBkashManualPaymentStatusBadge,
  getBkashPaymentTypeBadge,
} from "./utils";

export const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Email" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold min-w-max">{row.getValue("email")}</div>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "courseOrSubscriptionTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment For" />
    ),
    cell: ({ row }) => {
      return (
        <div className="">{row.getValue("courseOrSubscriptionTitle")}</div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="">{getBkashPaymentTypeBadge(row.getValue("type"))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="">
        {getBkashManualPaymentStatusBadge(row.getValue("status"))}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid Amount" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "payableAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payable Amount" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("payableAmount")}</div>,
  },
  {
    accessorKey: "trxId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bkash trxId" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("trxId")}</div>,
  },
  {
    accessorKey: "payFrom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pay from" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("payFrom")?.join(", ")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
