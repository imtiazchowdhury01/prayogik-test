// @ts-nocheck
"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statuses: any[];
  months: any[];
  years: any[];
}

export function DataTableToolbar<TData>({
  table,
  statuses,
  months,
  years,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Enter month name..."
          value={
            (table
              .getColumn("month")
              ?.getFilterValue()) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("month")
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}

        {table.getColumn("payment_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("payment_status")}
            title="Status"
            options={statuses}
          />
        )}

        {table.getColumn("month_paid_for") && (
          <DataTableFacetedFilter
            column={table.getColumn("month_paid_for")}
            title="Month"
            options={months.map((option) => ({
              ...option,
              value: Number(option.value),
            }))}
          />
        )}

        {table.getColumn("year_paid_for") && (
          <DataTableFacetedFilter
            column={table.getColumn("year_paid_for")}
            title="Year"
            options={years.map((option) => ({
              ...option,
              value: Number(option.value),
            }))}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
