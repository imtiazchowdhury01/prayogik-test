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
import moment from "moment";

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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank Title" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold min-w-max">{row.getValue("name")}</div>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "feePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee Percentage" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("feePercentage")}</div>,
  },
  {
    accessorKey: "numberOfSales",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Sales" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("numberOfSales")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
