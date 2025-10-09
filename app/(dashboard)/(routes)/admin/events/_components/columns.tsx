"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import { EventType, EventStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import AttendeesSheet from "./AttendeesSheet";

export type Event = any;

interface ColumnsProps {
  onDelete: (event: Event) => void;
  eventLeads?: any[];
}

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

export const createColumns = ({
  onDelete,
  eventLeads = [],
}: ColumnsProps): ColumnDef<Event>[] => {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column}>Event Title</SortableHeader>
      ),
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="max-w-xs">
            <div className="font-medium text-sm truncate">
              <Link
                href={`/admin/events/${row.original.id}`}
                className="flex items-center hover:underline hover:text-primary-brand"
              >
                {event.title}
              </Link>
            </div>
            {event.slug && (
              <div className="text-xs text-gray-500 truncate">
                /{event.slug}
              </div>
            )}
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
      accessorKey: "date",
      header: ({ column }) => (
        <SortableHeader column={column}>Scheduled At</SortableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {formatDateForDisplay(row.original.date)}
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "datetime",
      sortDescFirst: true, // Show most recent dates first by default
    },
    {
      accessorKey: "type",
      id: "type", // Explicitly set the ID
      header: ({ column }) => (
        <SortableHeader column={column}>Price</SortableHeader>
      ),
      cell: ({ row }) => {
        const type = row.original.type;
        const price = row.original.price;
        return (
          <div className="space-y-1">
            {type === EventType.FREE ? (
              <>Free</>
            ) : price === 0 ? (
              <>Not set</>
            ) : (
              <>{price}</>
            )}
          </div>
        );
      },
      // Fixed filterFn for faceted filter (expects array of selected values)
      filterFn: (row, id, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) return true;
        return value.includes(row.getValue(id));
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      accessorFn: (row) => (row.isOnline ? "ONLINE" : "OFFLINE"), // Use accessorFn for computed values
      id: "platform", // Explicitly set the ID to match what's used in the filter
      header: ({ column }) => (
        <SortableHeader column={column}>Platform</SortableHeader>
      ),
      cell: ({ row }) => {
        const isOnline = row.original.isOnline;
        return (
          <Badge className={cn("bg-slate-500", isOnline && "bg-sky-700")}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        );
      },
      // Fixed filterFn for faceted filter (expects array of selected values)
      filterFn: (row, id, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) return true;
        return value.includes(row.getValue(id));
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "attendees",
      header: ({ column }) => (
        <SortableHeader column={column}>Attendees</SortableHeader>
      ),
      accessorFn: (row) => row.attendees?.length || 0,
      cell: ({ row }) => {
        const attendeeCount = row.original.attendees?.length || 0;
        const event = row.original;
        return (
          <div className="text-sm font-medium text-start">
            <Link
              href={`/admin/events/${event?.id}/attendees`}
              className="hover:text-primary-brand hover:underline"
            >
              <span>{attendeeCount}</span>
            </Link>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
      sortDescFirst: true, // Show highest attendance first by default
    },
    // {
    //   id: "attendeesList",
    //   accessorKey: "attendees",
    //   header: ({ column }) => (
    //     <SortableHeader column={column}>Attendees</SortableHeader>
    //   ),
    //   accessorFn: (row) => row.attendees?.length || 0,
    //   cell: ({ row }) => {
    //     const event = row.original;
    //     return <AttendeesSheet event={event} eventLeads={eventLeads} />;
    //   },
    //   enableSorting: true,
    //   sortingFn: "alphanumeric",
    //   sortDescFirst: true,
    // },
    {
      accessorKey: "status",
      id: "status", // Explicitly set the ID
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusColor = (status: EventStatus) => {
          switch (status) {
            case "DRAFT":
              return "bg-slate-500";
            case "UPCOMING":
              return "bg-brand text-white";
            case "CLOSED":
              return "bg-red-500 text-white";
            default:
              return "secondary";
          }
        };
        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      },
      // Fixed filterFn for faceted filter (expects array of selected values)
      filterFn: (row, id, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) return true;
        return value.includes(row.getValue(id));
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex items-center space-x-2 justify-end">
            <Link
              href={`/preview/events/${event?.slug}`}
              target="_blank"
              title="Preview"
              className="hover:text-brand"
            >
              <Eye className="h-4 w-4 text-sm text-gray-500" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/events/${row.original.id}`}
                    className="flex items-center"
                  >
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/events/${event?.id}/attendees`}
                    className="flex items-center"
                  >
                    View Attendees
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
};
