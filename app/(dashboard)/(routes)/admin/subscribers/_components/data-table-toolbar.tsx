import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface StatusOption {
  value: string;
  label: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statuses: StatusOption[];
}

export function DataTableToolbar<TData>({
  table,
  statuses,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search by subscriber name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[250px]"
        />

        {table.getColumn("subscriptionStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("subscriptionStatus")}
            title="Status"
            options={statuses}
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
    </div>
  );
}
