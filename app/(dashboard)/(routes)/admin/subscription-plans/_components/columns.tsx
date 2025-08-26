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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold min-w-max">{row.getValue("name")}</div>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "regularPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Regular Price" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("regularPrice")}</div>,
  },
  {
    accessorKey: "subscriptionDiscount_discountPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount on course" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("subscriptionDiscount_discountPercentage")}%
      </div>
    ),
  },
  {
    accessorKey: "_count.subscription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscribers Count" />
    ),
    cell: ({ row }) => {
      const subscriptionCount = row.original._count?.subscription ?? 0;
      return <div className="">{subscriptionCount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
