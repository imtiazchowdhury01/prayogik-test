"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { SubscriptionDiscount } from "@prisma/client";

export const columns: ColumnDef<
  Pick<SubscriptionDiscount, "id" | "name" | "discountPercentage">
>[] = [
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
      <DataTableColumnHeader column={column} title="Discount title" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold min-w-max">{row.getValue("name")}</div>
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "discountPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount Percentage" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("discountPercentage")}%</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
