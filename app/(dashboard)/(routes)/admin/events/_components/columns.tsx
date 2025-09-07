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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import { EventType, EventStatus } from "@prisma/client";

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
      header: "Event Title",
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
    },
    {
      accessorKey: "status",
      header: "Status",
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
    },
    {
      accessorKey: "date",
      header: "Event Date",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {formatDateForDisplay(row.original.date)}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
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
    },
    {
      accessorKey: "isOnline",
      header: "Format",
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
    },
    {
      accessorKey: "attendees",
      header: "Attendees",
      cell: ({ row }) => {
        const attendeeCount = row.original.attendees?.length || 0;
        return (
          <div className="text-sm font-medium text-center">
            <span className="bg-info-50 text-info-700 px-2 py-1 rounded-full text-xs border border-info-200">
              {attendeeCount}
            </span>
          </div>
        );
      },
    },
    {
      id: "location",
      header: "Location/Link",
      cell: ({ row }) => {
        const event = row.original;
        const locationText = event.isOnline ? event.zoomLink : event.location;
        return (
          <div
            className="text-xs text-gray-600 truncate max-w-[120px]"
            title={locationText}
          >
            {locationText || "Not specified"}
          </div>
        );
      },
    },
    {
      accessorKey: "speakers",
      header: "Speakers",
      cell: ({ row }) => {
        const speakers = row.original.speakers || [];
        return (
          <div className="text-xs">
            {speakers.length > 0 ? (
              <div className="space-y-1">
                {speakers.slice(0, 2).map((speaker: any, index: number) => (
                  <div
                    key={index}
                    className="truncate max-w-[100px]"
                    title={speaker.name}
                  >
                    {speaker.name}
                  </div>
                ))}
                {speakers.length > 2 && (
                  <div className="text-gray-500">
                    +{speakers.length - 2} more
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-400">No speakers</span>
            )}
          </div>
        );
      },
    },
  
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
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
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
    },
  ];
};
