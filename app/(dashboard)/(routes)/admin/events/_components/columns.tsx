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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import { EventType } from "@prisma/client";

export type Event = any;

interface ColumnsProps {
  onDelete: (event: Event) => void;
}

export const createColumns = ({
  onDelete,
}: ColumnsProps): ColumnDef<Event>[] => {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div>
            <div className="font-medium">{event.title}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {formatDateForDisplay(row.original.date)}
          </div>
        );
      },
    },
    {
      accessorKey: "isOnline",
      header: "Meeting Type",
      cell: ({ row }) => {
        const isOnline = row.original.isOnline;
        return (
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        );
      },
    },
    {
      id: "location",
      header: "Location/Link",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="text-sm text-gray-600 truncate max-w-xs">
            {event.isOnline ? event.zoomLink : event.location}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Payment Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge variant={type === EventType.FREE ? "default" : "secondary"}>
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "attendees",
      header: "Attendees",
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium">
            {row.original.attendees.length}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/events/${row.original.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(event)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
