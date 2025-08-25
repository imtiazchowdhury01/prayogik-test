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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center min-w-max">
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={data?.avatarUrl} />
            <AvatarFallback>
              {row.getValue("name").slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold">{row.getValue("name")}</span>

          {data?.isAdmin && (
            <HoverTotip
              hoverNode={<ShieldCheck width={14} className="text-green-600" />}
              tooltipText="Admin"
            />
          )}
        </div>
      );
    },
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div>
        <span
          className={cn(
            "rounded-sm p-1 text-xs font-medium",
            row.getValue("status") === "VERIFIED"
              ? "text-green-600"
              : "text-yellow-600"
          )}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "teacherRank_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {capitalizeFirstLetter(row.original.teacherRank_name)}{" "}
            {`(${row.original.teacherRank_feePercentage}%)`}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
