"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubscriptionForm from "./SubscriptionForm";

export function DataTableToolbar({ table }: any) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2">
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
        onClick={() => setIsCreateModalOpen(true)}
        className="h-8 px-3 lg:px-4"
      >
        <Plus size={14} className="mr-1" />
        Create
      </Button>
      {/* <DataTableViewOptions table={table} /> */}

      {/* Create Subscription */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogTitle />
          <DialogDescription />
          <DialogHeader>
            <SubscriptionForm
              subscription={null}
              onClose={() => {
                setIsCreateModalOpen(false);
              }}
              onSave={() => {}}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
