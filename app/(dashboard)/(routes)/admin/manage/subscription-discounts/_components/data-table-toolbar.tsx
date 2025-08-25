"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubscriptionDiscountForm from "./Subscription-Discount-Form";

export function DataTableToolbar({
  table,
  setSalesUpdated,
  salesUpdated,
}: any) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search by discount title..."
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

      {/* Create Subscription Discount Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <SubscriptionDiscountForm
            onClose={() => {
              setIsCreateModalOpen(false);
            }}
            salesData={null} // Pass null to indicate creating new discount
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
