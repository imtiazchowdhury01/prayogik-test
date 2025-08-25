// @ts-nocheck
"use client";

import { Checkbox } from "@/components/ui/checkbox";

import moment from "moment";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

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
    accessorKey: "payment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => {
      const paymentDate = row.getValue("payment_date");
      // Format the date using moment
      return paymentDate
        ? moment(paymentDate).format("MMM D, YYYY - h:mm A")
        : "No Date";
    },
  },
  {
    accessorKey: "month_paid_for",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month For" />
    ),
    cell: ({ row }) => {
      const monthNumber = row.getValue("month_paid_for");
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
    accessorKey: "year_paid_for",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year For" />
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
    accessorKey: "amount_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("amount_paid").toFixed(2)}</span>
      </div>
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("payment_status");
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
];
