// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { HoverTotip } from "@/components/hoverTotip";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils/stringUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center min-w-max">
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={data?.avatarUrl} />
            <AvatarFallback>
              {row.getValue("name").slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold">{row.getValue("name")}</span>

          {data?.isAdmin && (
            <HoverTotip
              hoverNode={<ShieldCheck width={14} className="text-green-600" />}
              tooltipText="Admin"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center">
          {row.getValue("email")}
          {data?.emailVerified && (
            <HoverTotip
              hoverNode={<BadgeCheck width={14} className="text-green-600" />}
              tooltipText="Email verified"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("subscriptionStatus");
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
    accessorKey: "subscription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => <div>{row.getValue("subscription") || "N/A"}</div>,
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },

  {
    accessorKey: "subscriptionCreatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrolled on" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("subscriptionCreatedAt"));
      return (
        <div className="whitespace-nowrap">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: true,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "subscriptionExpiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Renew On" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("subscriptionExpiresAt"));
      return (
        <div>
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: true,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
