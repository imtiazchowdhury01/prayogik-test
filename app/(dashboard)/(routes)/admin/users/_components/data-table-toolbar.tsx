// @ts-nocheck

"use client";

import { Table } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchRanks, priorities } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddUserDialog from "./add-user-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statuses: any[]; // Define types for statuses if known
}

export function DataTableToolbar<TData>({
  table,
  statuses,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const [openAddUserDialog, setopenAddUserDialog] = useState(false);
  const [loading, setLoading] = useState(true); // Manage loading state
  const router = useRouter();

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="w-full flex flex-wrap gap-6 sm:gap-2 justify-between">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search by email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="h-8 w-full sm:w-[250px]"
          />

          {table.getColumn("teacherStatus") && (
            <DataTableFacetedFilter
              column={table.getColumn("teacherStatus")}
              title="Status"
              options={statuses}
            />
          )}

          {table.getColumn("role") && (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              title="Role"
              options={[
                { label: "TEACHER", value: "TEACHER" },
                { label: "STUDENT", value: "STUDENT" },
              ]} // Use the extracted rank names for options
            />
          )}

          {table.getColumn("isAdmin") && (
            <DataTableFacetedFilter
              column={table.getColumn("isAdmin")}
              title="Admin"
              options={[{ label: "Admin", value: true }]} // Use the extracted rank names for options
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Button className="h-8" onClick={() => setopenAddUserDialog(true)}>
          <Plus size={14} className="mr-1" />
          Add User
        </Button>
      </div>

      {/* <DataTableViewOptions table={table} /> */}

      <AddUserDialog open={openAddUserDialog} setOpen={setopenAddUserDialog} />
    </div>
  );
}
