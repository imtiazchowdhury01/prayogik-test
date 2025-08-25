// @ts-nocheck
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Loader, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { labels } from "../data/data";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CategoryDialog } from "./category-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DeleteAlertModal from "@/components/modals/delete-alert-modal";
import SubscriptionDiscountForm from "./Subscription-Discount-Form";
import { deleteSubscriptionDiscount } from "@/services/admin";

export function DataTableRowActions({ row }: any) {
  const router = useRouter();
  const [salesData, setSalesData] = useState(null); // State to hold current sales management data
  const [loading, setLoading] = useState(true); // Loading state
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility
  const [salesUpdated, setSalesUpdated] = useState(false);

  const [editingSale, setEditingSale] = useState(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deletingSalesId, setDeletingSalesId] = useState(null);

  const confirmDelete = async () => {
    if (!deletingSalesId) return;

    setIsDeleting(true);

    try {
      const response = await deleteSubscriptionDiscount(deletingSalesId);

      toast.success("Sale deleted successfully!");
      setSalesUpdated(!salesUpdated);
    } catch (error) {
      console.error("Error deleting sales:", error);
      toast.error("Error deleting sale.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingSalesId(null);
    }
  };

  const handleDeleteButtonClick = (rowData) => {
    if (rowData?.isDefault) {
      toast.error("Cannot delete the default subscription discount.");
      return;
    }
    setDeletingSalesId(rowData?.id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setEditingSale(row.original);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          {!row.original?.isDefault && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setDeletingSalesId(row.original?.id);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogDescription />
          <SubscriptionDiscountForm
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingSale(null);
              setSalesUpdated(!salesUpdated); // Refresh the data after closing
            }}
            salesData={editingSale}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sales?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
