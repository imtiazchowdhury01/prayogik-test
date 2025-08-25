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
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import { clientApi } from "@/lib/utils/openai/client";
import { CourseMode } from "@prisma/client";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories: any[];
  authors: any[];
}

export function DataTableToolbar<TData>({
  table,
  categories,
  authors,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setsearchTerm] = useState("");

  // Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: {
            title: searchTerm,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );

      router.push(url);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, router]);

  // Extract rank names for the filter options
  const isCategories = categories.map((rank) => ({
    value: rank?.name, // Use rank name as value
    label: rank?.name, // Use rank name as label
  }));

  const isAuthors = authors?.map((teacher) => ({
    value: teacher?.id,
    label: teacher?.name,
  }));

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(event) => setsearchTerm(event.target.value)}
          className="h-8 lg:w-fit"
        />

        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={isCategories}
          />
        )}

        {table.getColumn("isPublished") && (
          <DataTableFacetedFilter
            column={table.getColumn("isPublished")}
            title="Status"
            options={[
              { label: "Published", value: true },
              { label: "Draft", value: false },
            ]}
          />
        )}

        {table.getColumn("isUnderSubscription") && (
          <DataTableFacetedFilter
            column={table.getColumn("isUnderSubscription")}
            title="Subscription"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
        )}

        {table.getColumn("authorId") && (
          <DataTableFacetedFilter
            column={table.getColumn("authorId")}
            title="Author"
            options={isAuthors}
          />
        )}

        {table.getColumn("courseMode") && (
          <DataTableFacetedFilter
            column={table.getColumn("courseMode")}
            title="Mode"
            options={[
              { label: CourseMode.LIVE, value: CourseMode.LIVE },
              { label: CourseMode.RECORDED, value: CourseMode.RECORDED },
            ]}
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
      <Button
        className="h-8"
        onClick={() => router.push("/admin/courses/create")}
      >
        <Plus size={14} className="mr-1" />
        New Course
      </Button>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
