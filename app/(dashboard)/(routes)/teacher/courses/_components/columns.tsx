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
import Link from "next/link";
import { Eye } from "lucide-react";

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
        href={`/teacher/courses/${row.original.id}`}
        className="hover:text-primary-brand"
      >
        {row.getValue("title")}
      </Link>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "isAuthor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => {
      const isAuthor = row.getValue("isAuthor");

      return (
        <Badge
          className={cn("bg-slate-500 min-w-150", isAuthor && "bg-primary-500")}
        >
          {isAuthor ? "Author" : "Co-Author"}
        </Badge>
      );
    },
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const cat = row.getValue("category");
      return <div className="">{cat?.name}</div>;
    },
  },
  {
    accessorFn: (row) => {
      // Extract the regularAmount from the prices array
      const prices = row.prices || [];
      return prices.length > 0 ? prices[0].regularAmount : 0;
    },
    accessorKey: "prices",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const discountPrice = row?.original?.prices[0]?.discountedAmount;

      // Get the processed price value
      const price = row.getValue("prices");

      // Display "Free" if the price is 0, otherwise show the price
      return (
        <div className="flex items-center gap-2">
          <span className={cn(discountPrice && "line-through")}>
            &#2547;{formatCurrency(price.toFixed(2))}
          </span>
          {discountPrice ? (
            <span>&#2547;{formatCurrency(String(discountPrice))}</span>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "enrolledStudents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Students" />
    ),
    cell: ({ row }) => {
      const studentsCount = row.getValue("enrolledStudents")?.length;

      return <div>{studentsCount}</div>;
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
