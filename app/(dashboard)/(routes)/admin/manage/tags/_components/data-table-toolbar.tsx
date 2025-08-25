import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TagsForm from "./TagsForm";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search by tag name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[250px]"
        />
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
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="h-8 px-3 lg:px-4"
      >
        <Plus size={14} className="mr-1" />
        Create
      </Button>

      {/* Create Subscription Discount Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogHeader className="sr-only hidden">
          <DialogTitle className="sr-only hidden"></DialogTitle>
          <DialogDescription className="sr-only hidden"></DialogDescription>
        </DialogHeader>
        <DialogContent>
          <TagsForm
            onClose={() => {
              setIsCreateModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
