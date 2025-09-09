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
} from "lucide-react";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import { EventType, EventStatus } from "@prisma/client";

export type Event = any;

interface ColumnsProps {
  onDelete: (event: Event) => void;
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
            <div className="font-medium text-sm truncate">{event.title}</div>
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
        <SortableHeader column={column}>Type</SortableHeader>
      ),
      cell: ({ row }) => {
        const type = row.original.type;
        const price = row.original.price;
        return (
          <div className="space-y-1">
            <Badge
              variant={type === EventType.FREE ? "outline" : "default"}
              className="text-xs"
            >
              {type}
            </Badge>
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
      id: "format", // Explicitly set the ID to match what's used in the filter
      header: ({ column }) => (
        <SortableHeader column={column}>Platform</SortableHeader>
      ),
      cell: ({ row }) => {
        const isOnline = row.original.isOnline;
        return (
          <Badge
            variant={isOnline ? "default" : "secondary"}
            className="text-xs"
          >
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
        return (
          <div className="text-sm font-medium text-start">
            <span>
              {attendeeCount}
            </span>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
      sortDescFirst: true, // Show highest attendance first by default
    },
    {
      accessorKey: "waitingCount",
      header: ({ column }) => (
        <SortableHeader column={column}>Waiting</SortableHeader>
      ),
      accessorFn: (row) => row.original.waitingCount || 0,
      cell: ({ row }) => {
        const waitingCount = row.original.waitingCount || 0;
        return (
          <div className="text-sm font-medium text-start">
            <span >
              {waitingCount}
            </span>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
      sortDescFirst: true, // Show highest attendance first by default
    },
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
              return "secondary";
            case "UPCOMING":
              return "default";
            case "WAITING":
              return "outline";
            case "CLOSED":
              return "destructive";
            default:
              return "secondary";
          }
        };
        return (
          <Badge variant={getStatusColor(status)} className="text-xs">
            {status}
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
    // {
    //   id: "location",
    //   header: "Location/Link",
    //   accessorFn: (row) => (row.isOnline ? row.zoomLink : row.location),
    //   cell: ({ row }) => {
    //     const event = row.original;
    //     const locationText = event.isOnline ? event.zoomLink : event.location;
    //     return (
    //       <div
    //         className="text-xs text-gray-600 truncate max-w-[120px]"
    //         title={locationText}
    //       >
    //         {locationText || "Not specified"}
    //       </div>
    //     );
    //   },
    //   enableSorting: false, // Location might not need sorting
    // },
    // {
    //   id: "speakers",
    //   header: "Speakers",
    //   accessorFn: (row) => row.speakers?.length || 0,
    //   cell: ({ row }) => {
    //     const speakers = row.original.speakers || [];
    //     return (
    //       <div className="text-xs">
    //         {speakers.length > 0 ? (
    //           <div className="space-y-1">
    //             {speakers.slice(0, 2).map((speaker: any, index: number) => (
    //               <div
    //                 key={index}
    //                 className="truncate max-w-[100px]"
    //                 title={speaker.name}
    //               >
    //                 {speaker.name}
    //               </div>
    //             ))}
    //             {speakers.length > 2 && (
    //               <div className="text-gray-500">
    //                 +{speakers.length - 2} more
    //               </div>
    //             )}
    //           </div>
    //         ) : (
    //           <span className="text-gray-400">No speakers</span>
    //         )}
    //       </div>
    //     );
    //   },
    //   enableSorting: true,
    //   sortingFn: "alphanumeric",
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
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

              {/* <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(event)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false, // Actions column doesn't need sorting
    },
  ];
};
