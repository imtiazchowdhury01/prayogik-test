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
import AddTeacher from "./add-teacher";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statuses: any[];
}

export function DataTableToolbar<TData>({
  table,
  statuses,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTeacherModal, setaddTeacherModal] = useState(false);
  const router = useRouter();

  // Fetch ranks when the component mounts
  useEffect(() => {
    const getRanks = async () => {
      setLoading(true);
      try {
        const fetchedRanks = await fetchRanks();
        setRanks(fetchedRanks);
      } catch (error) {
        console.error("Error fetching ranks:", error);
      } finally {
        setLoading(false);
      }
    };

    getRanks();
  }, []);

  // Extract rank names for the filter options
  const rankOptions = ranks.map((rank) => ({
    value: rank?.name,
    label: rank?.name,
  }));

  return (
    <div className="flex items-start gap-4 justify-between">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 lg:w-fit"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}

        {table.getColumn("teacherRank_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("teacherRank_name")}
            title="Rank"
            options={rankOptions}
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
        className="mr-2 h-8"
        // onClick={() => router.push("/admin/teachers/addteacher")}
        onClick={() => {
          setaddTeacherModal(true);
        }}
      >
        <Plus size={14} className="mr-1" />
        Add Teacher
      </Button>
      {/* <DataTableViewOptions table={table} /> */}

      {/* Add Teacher Dialog */}
      <AddTeacher open={addTeacherModal} setOpen={setaddTeacherModal} />
    </div>
  );
}
