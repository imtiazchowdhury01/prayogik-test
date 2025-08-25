// @ts-nocheck
"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";

// Define NewsletterTag type if not imported
type NewsletterTag = {
  email: string;
  tag?: {
    name?: string;
  };
  createdAt: string | Date;
};

export const columns: ColumnDef<NewsletterTag>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] border-gray-300"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] border-gray-300"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center min-w-max">
          <span className="font-semibold">{row.getValue("email")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "tag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag" />
    ),
    cell: ({ row }) => {
      const tag = row.original.tag;
      return (
        <Badge variant="outline" className="capitalize">
          {tag?.name || "Unassigned"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const tag = row.original.tag;
      const tagName = tag?.name || "Unassigned";

      // If no filter value is set, show all rows
      if (!value || value.length === 0) {
        return true;
      }

      // Check if the tag name is in the selected filter values
      return value.includes(tagName);
    },
    // Add this to enable faceted filtering
    getFacetedUniqueValues: (table) => {
      const uniqueValues = new Map();
      table.getPreFilteredRowModel().rows.forEach((row) => {
        const tag = row.original.tag;
        const tagName = tag?.name || "Unassigned";
        uniqueValues.set(tagName, (uniqueValues.get(tagName) ?? 0) + 1);
      });
      return uniqueValues;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscribed On" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row as any} />,
  },
];
