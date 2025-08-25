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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statuses: any[]; // Define types for statuses if known
}

export function DataTableToolbar<TData>({
  table,
  statuses,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        <Input
          placeholder="Search by trxId..."
          value={(table.getColumn("trxId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("trxId")?.setFilterValue(event.target.value)
          }
          className="h-8 lg:w-fit"
        />

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
    </div>
  );
}
