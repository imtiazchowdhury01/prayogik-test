// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { capitalizeFirstLetter } from "@/lib/utils/stringUtils";
import { cn } from "@/lib/utils";
import { getDifficultyBadge, getStatusBadge } from "./utils";

// Create a function that returns columns with teachers data
export const createColumns = (teachers = []) => [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[250px]">
        <div className="font-semibold break-words w-full">
          {row.getValue("title")}
        </div>
        <div className="text-xs text-slate-500 truncate w-full">
          {row.original?.description}
        </div>
      </div>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="">{getStatusBadge(row.getValue("status"))}</div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "teacher",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teacher" />
    ),
    cell: ({ row }) => {
      const teacher = row?.original?.teacher;
      if (!teacher) return <div className="">N/A</div>;
      return <div className="">{teacher?.user?.name}</div>;
    },
  },
  {
    accessorKey: "estimatedDuration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("estimatedDuration")}</div>
    ),
  },
  {
    accessorKey: "targetDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Date" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("targetDate")}</div>,
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Difficulty" />
    ),
    cell: ({ row }) => (
      <div className="">{getDifficultyBadge(row.getValue("difficulty"))}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // console.log(row);
      return <DataTableRowActions row={row} teachers={teachers} />;
    },
  },
];

// Keep the original columns export for backward compatibility
export const columns = createColumns();
