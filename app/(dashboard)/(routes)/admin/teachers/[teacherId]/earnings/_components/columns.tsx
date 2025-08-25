// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { capitalizeFirstLetter } from "@/lib/utils/stringUtils";
import { Checkbox } from "@/components/ui/checkbox";

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
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
    cell: ({ row }) => {
      const monthNumber = row.getValue("month");
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Convert month number (1-12) to month name (using 0-based array index)
      return monthNames[monthNumber - 1] || `Month ${monthNumber}`;
    },
    filterFn: (row, id, filterValue) => {
      const monthNumber = row.getValue(id);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = monthNames[monthNumber - 1] || `Month ${monthNumber}`;

      // If no filter applied, show all rows
      if (
        !filterValue ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        return true;
      }

      // Handle array-based filters (from faceted filter)
      if (Array.isArray(filterValue)) {
        return filterValue.some((val) => {
          // If val is a month name, compare with month name
          if (typeof val === "string") {
            return val.trim().toLowerCase() === monthName.toLowerCase();
          }
          // If val is a month number, compare with month number
          return val === monthNumber;
        });
      }

      // Handle single value filter (could be month name or number)
      if (typeof filterValue === "string") {
        return filterValue.trim().toLowerCase() === monthName.toLowerCase();
      } else {
        return filterValue === monthNumber;
      }
    },
  },

  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    filterFn: (row, id, filterValue) => {
      // Handle numeric array filtering for faceted filter
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(id));
      }
      return row.getValue(id) === filterValue;
    },
  },

  {
    accessorKey: "total_earned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Earned" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("total_earned").toFixed(2)}</span>
      </div>
    ),
  },
  {
    accessorKey: "total_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Paid" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("total_paid").toFixed(2)}</span>
      </div>
    ),
  },
  {
    accessorKey: "balance_remaining",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remaining" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("balance_remaining").toFixed(2)}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <div>{status}</div>;
    },
    filterFn: (row, id, filterValue) => {
      // Get the status value from the row
      const status = String(row.getValue(id)).trim();

      // For array-based filters (from faceted filter)
      if (Array.isArray(filterValue)) {
        // Case-insensitive comparison for each filter value
        return filterValue.some(
          (val) => String(val).trim().toLowerCase() === status.toLowerCase()
        );
      }

      // For single value filters
      if (filterValue) {
        return (
          String(filterValue).trim().toLowerCase() === status.toLowerCase()
        );
      }

      return true;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
