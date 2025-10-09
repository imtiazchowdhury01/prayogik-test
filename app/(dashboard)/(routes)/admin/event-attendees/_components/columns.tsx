// @ts-nocheck
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { ArrowUp, ArrowDown, ChevronsUpDown, Eye } from "lucide-react";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import { FaFacebook, FaLinkedin } from "react-icons/fa6";
import Image from "next/image";
import ApprovalSwitch from "./approval-switch";

export type Event = any;

// Helper component for sortable column headers
const SortableHeader = ({
  column,
  children,
}: {
  column: any;
  children: React.ReactNode;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {children}
      <div className="ml-2 flex flex-col">
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="w-4 h-4" />
        )}
      </div>
    </Button>
  );
};

export const createEventRegistrationColumns = (
  onViewProfile?: (user: any) => void
): ColumnDef<Event>[] => {
  return [
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
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <SortableHeader column={column}>Name</SortableHeader>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        const user = row.original.user;
        return (
          <div
            // onClick={() => {
            //   // Pass the entire attendee object with a fresh copy
            //   onViewProfile?.({ ...lead });
            // }}
            className="font-medium text-sm truncate hover:underline cursor-pointer hover:text-brand"
          >
            <Link
              href={`/admin/users/${user?.id}`}
              className="hover:text-primary-brand"
            >
              {lead?.user?.name}
            </Link>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return (
          row
            .getValue(id)
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()) ?? false
        );
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "user.phoneNumber",
      header: ({ column }) => <div>Phone</div>,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="font-medium text-sm truncate">
            {lead.user?.phoneNumber ? lead?.user?.phoneNumber : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "event.title",
      header: ({ column }) => (
        <SortableHeader column={column}>Event</SortableHeader>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="font-medium text-sm truncate">
            {lead?.event?.title}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return (
          row
            .getValue(id)
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()) ?? false
        );
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      id: "eventType", // Add a simple id
      accessorKey: "event.type",
      header: ({ column }) => (
        <SortableHeader column={column}>Type</SortableHeader>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div
            className={`font-normal text-xs truncate border rounded-full text-center
        ${
          lead?.event?.type === "FREE"
            ? "bg-green-100 text-green-700 border-green-200"
            : ""
        }
        ${
          lead?.event?.type === "PAID"
            ? "bg-blue-100 text-blue-700 border-blue-200"
            : ""
        }
        ${
          lead?.event?.type === "EOI"
            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
            : ""
        }
      `}
          >
            {lead?.event?.type}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        // For faceted filter, it expects an array of values
        if (Array.isArray(value) && value.length > 0) {
          return value.includes(row.original.event?.type);
        }
        return true;
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "registeredAt",
      header: ({ column }) => (
        <SortableHeader column={column}>Registered At</SortableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {formatDateForDisplay(row.original.registeredAt)}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!Array.isArray(value)) return true;

        const [start, end] = value;
        const dateValue = row.getValue(id);

        if (!dateValue) return false;

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) return false;

        // Single day selection (when end is undefined or null)
        if (start && !end) {
          return isWithinInterval(date, {
            start: startOfDay(start),
            end: endOfDay(start),
          });
        }

        // Only end date selected (shouldn't happen in normal usage)
        if (!start && end) {
          return date <= endOfDay(end);
        }

        // Date range selection (when both start and end are provided)
        if (start && end) {
          return isWithinInterval(date, {
            start: startOfDay(start),
            end: endOfDay(end),
          });
        }

        return true;
      },
      enableSorting: true,
      sortingFn: "datetime",
      sortDescFirst: true,
    },
    {
      id: "purchase",
      accessorKey: "purchase",
      accessorFn: (row) => (row.purchase ? "true" : "false"),
      header: ({ column, table }) => {
        // Count paid/unpaid from all rows
        const allRows = table.getFilteredRowModel().rows;
        const unpaidCount = allRows.filter(
          (row) => !row.original.purchase
        ).length;
        const paidCount = allRows.filter((row) => row.original.purchase).length;

        return (
          <div className="flex items-center gap-2">
            <SortableHeader column={column}>Payment Status</SortableHeader>
          </div>
        );
      },
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div
            className={`font-medium text-sm truncate ${
              lead?.purchase ? "text-green-500" : "text-red-500"
            }`}
          >
            {lead?.purchase ? "Paid" : "Unpaid"}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const cellValue = row.getValue(id);
        const normalized = cellValue ? "true" : "false";
        return value.includes(normalized);
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "social",
      header: ({ column }) => <div>Social Links</div>,
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-1">
            {user?.facebook ? (
              <Link href={user.facebook} target="_blank" className="text-brand">
                <Image
                  src="/icon/social/Facebook.svg"
                  width={16.5}
                  height={16.5}
                  alt="facebook-logo"
                  className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                />
              </Link>
            ) : null}
            {user?.linkedin ? (
              <Link href={user.linkedin} target="_blank" className="text-brand">
                <Image
                  src="/icon/social/linkedin.svg"
                  width={16.5}
                  height={16.5}
                  alt="linkedin-logo"
                  className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                />
              </Link>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "approvalStatus",
      accessorKey: "isApproved",
      header: ({ column }) => (
        <SortableHeader column={column}>Approval Status</SortableHeader>
      ),
      cell: ({ row }) => {
        const registration = row.original;
        return <ApprovalSwitch registration={registration} />;
      },
      filterFn: (row, id, value) => {
        if (Array.isArray(value) && value.length > 0) {
          const isApproved = row.original.isApproved;
          return value.includes(isApproved ? "approved" : "rejected");
        }
        return true;
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.isApproved;
        const b = rowB.original.isApproved;
        return a === b ? 0 : a ? 1 : -1;
      },
    },
    {
      id: "viewProfile",
      header: ({ column }) => <div>View Profile</div>,
      cell: ({ row }) => {
        const attendee = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Pass the entire attendee object with a fresh copy
              onViewProfile?.({ ...attendee });
            }}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="View Profile"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        );
      },
      enableSorting: false,
    },
  ];
};
