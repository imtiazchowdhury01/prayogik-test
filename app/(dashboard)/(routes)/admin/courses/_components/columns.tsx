// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { capitalizeFirstLetter, formatCurrency } from "@/lib/utils/stringUtils";
import { cn } from "@/lib/utils";
import { Eye, EyeIcon } from "lucide-react";
import Link from "next/link";

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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/admin/courses/${row.original.id}`}
        className="hover:text-primary-brand"
      >
        {row.getValue("title")}
      </Link>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "authorId", // Changed from "author" to "authorId"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => {
      // Display the author name but the column uses authorId for filtering
      const data = row.original;
      return <div className="">{data.author}</div>; // Display name
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className={cn(data?.discountPrice && "line-through")}>
            &#2547;{formatCurrency(row.getValue("price"))}
          </span>
          {data?.discountPrice ? (
            <span>&#2547;{formatCurrency(String(data?.discountPrice))}</span>
          ) : null}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },
  {
    accessorKey: "isUnderSubscription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("isUnderSubscription") ? "Yes" : "No"}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "courseMode",
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: "enrolledStudents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Students" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            <span>{row.getValue("enrolledStudents")}</span>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data = row?.original;
      return (
        <div className="flex items-center justify-center">
          <Link
            href={`/preview/courses/${data?.id}`}
            title="Course Preview"
            target="_blank"
            className="mr-4"
          >
            <Eye className="h-4 w-4 text-sm text-gray-500" />
          </Link>
          <DataTableRowActions row={row} />
        </div>
      );
    },
  },
];
