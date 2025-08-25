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
import Link from "next/link";

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
          <Link
            href={`/admin/users/${data?.id}`}
            className="hover:text-primary-brand"
          >
            <span className="font-semibold">{row.getValue("name")}</span>
          </Link>

          {data?.isAdmin && (
            <HoverTotip
              hoverNode={<ShieldCheck width={14} className="text-green-600" />}
              tooltipText="Admin"
            />
          )}
        </div>
      );
    },
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.getValue("role")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "isAdmin",
    header: ({ column }) => null,
    cell: ({ row }) => null,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("gender") ? row.getValue("gender") : "N/A"}</div>
    ),
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },
  {
    accessorKey: "teacherStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teacher Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("teacherStatus") || "NONE";
      const getColor = (status) => {
        switch (status.toUpperCase()) {
          case "VERIFIED":
            return "text-green-500";
          case "PENDING":
            return "text-yellow-500";
          case "REJECTED":
            return "text-red-500";
          default:
            return "text-gray-500";
        }
      };

      return <div className={getColor(status)}>{status}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdCoursesCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created Courses" />
    ),
    cell: ({ row }) => <div>{row.getValue("createdCoursesCount")}</div>,
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },
  {
    accessorKey: "enrolledCoursesCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrolled Courses" />
    ),
    cell: ({ row }) => <div>{row.getValue("enrolledCoursesCount")}</div>,
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },
  {
    accessorKey: "subscription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => {
      const subscriptionStatus = row.original?.subscriptionStatus;
      // console.log(row.original);
      return (
        <div>
        {subscriptionStatus === "ACTIVE" ?  row.getValue("subscription") ?? "N/A" : "N/A"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
