// @ts-nocheck

"use client";

import { Table } from "@tanstack/react-table";
import { Plus, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchRanks, priorities } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseRoadMapDialog } from "./course-roadmap-form";
import { CourseRoadmapStatus, DifficultyLevel } from "@prisma/client";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  teachers: any[]; // Define types for statuses if known
}

export function DataTableToolbar<TData>({
  table,
  teachers,
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
          placeholder="Search by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 lg:w-fit"
        />

        {table.getColumn("difficulty") && (
          <DataTableFacetedFilter
            column={table.getColumn("difficulty")}
            title="Difficulty"
            options={[
              { label: "Beginner", value: DifficultyLevel.BEGINNER },
              { label: "Intermediate", value: DifficultyLevel.INTERMEDIATE },
              { label: "Advanced", value: DifficultyLevel.ADVANCED },
            ]}
          />
        )}

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { label: "Planned", value: CourseRoadmapStatus.PLANNED },
              { label: "In Progress", value: CourseRoadmapStatus.IN_PROGRESS },
              { label: "Completed", value: CourseRoadmapStatus.COMPLETED },
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
        onClick={() => setcreateCatOpen(true)}
        className="h-8 px-3 lg:px-4"
      >
        <PlusCircle size={14} className="mr-1" />
        Add New Course
      </Button>
      {/* <DataTableViewOptions table={table} /> */}
      <CourseRoadMapDialog
        open={createCatOpen}
        setOpen={setcreateCatOpen}
        teachers={teachers}
      />
    </div>
  );
}
