"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RankModal from "./rank-Modal";

export function DataTableToolbar({ table }: any) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by rank title..."
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
        onClick={() => setIsCreateModalOpen(true)}
        className="h-8 px-3 lg:px-4"
      >
        <Plus size={14} className="mr-1" />
        Create
      </Button>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogTitle />
          <DialogDescription />
          <DialogHeader>
            <RankModal
              rank={null}
              onClose={() => {
                setIsCreateModalOpen(false);
              }}
              onSave={() => {
                setIsCreateModalOpen(false);
              }}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
