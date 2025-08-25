// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";

export const columns: ColumnDef<NewsletterTag>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag Name" />
    ),
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center min-w-max">
          <span className="capitalize">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "leads",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leads" />
    ),
    cell: ({ row }) => {
      const leads = row.getValue("leads") as number;
      return <div className="text-sm">{leads}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.getValue("updatedAt")), "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row.original} />,
  },
];
