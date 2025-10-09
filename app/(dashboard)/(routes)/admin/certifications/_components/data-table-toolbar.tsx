// app/certifications/data-table-toolbar.tsx
"use client";

import { Table } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { DifficultyLevel } from "@prisma/client";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  skills: { id: string; name: string }[];
}

export function DataTableToolbar<TData>({
  table,
  skills,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const router = useRouter();

  const skillOptions = skills.map((skill) => ({
    value: skill.name,
    label: skill.name,
  }));



  const levelOptions = [
    { label: "Beginner", value: DifficultyLevel.BEGINNER },
    { label: "Intermediate", value: DifficultyLevel.INTERMEDIATE },
    { label: "Advanced", value: DifficultyLevel.ADVANCED },
  ];

  const statusOptions = [
    { label: "Published", value: true },
    { label: "Draft", value: false },
  ];

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-1 items-center flex-wrap gap-2">
       <Input
          placeholder="Filter events..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("level") && (
          <DataTableFacetedFilter
            column={table.getColumn("level")}
            title="Level"
            options={levelOptions}
          />
        )}

        {table.getColumn("skills") && (
          <DataTableFacetedFilter
            column={table.getColumn("skills")}
            title="Skills"
            options={skillOptions}
          />
        )}


        {table.getColumn("isPublished") && (
          <DataTableFacetedFilter
            column={table.getColumn("isPublished")}
            title="Status"
            options={statusOptions}
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

      <div className="flex gap-2">
        <Button
          className="h-8"
          onClick={() => router.push("/admin/certifications/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
    </div>
  );
}