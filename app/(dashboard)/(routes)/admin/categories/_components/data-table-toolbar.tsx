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
import { CategoryDialog } from "./category-form";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories: any[]; // Define types for statuses if known
}

export function DataTableToolbar<TData>({
  table,
  categories,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const [ranks, setRanks] = useState<any[]>([]); // Define types for ranks if known
  const [loading, setLoading] = useState(true); // Manage loading state
  const router = useRouter();
  const [createCatOpen, setcreateCatOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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

      <Button
        onClick={() => setcreateCatOpen(true)}
        className="h-8 px-3 lg:px-4"
      >
        <Plus size={14} className="mr-1" />
        Create
      </Button>
      {/* <DataTableViewOptions table={table} /> */}
      <CategoryDialog
        open={createCatOpen}
        setOpen={setcreateCatOpen}
        categories={categories}
      />
    </div>
  );
}
