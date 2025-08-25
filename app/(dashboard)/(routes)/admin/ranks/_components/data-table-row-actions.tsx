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
import RankModal from "./rank-Modal";
import { deleteRankByAdmin } from "@/services/admin";

export function DataTableRowActions({ row, onEdit, onDelete }) {
  const router = useRouter();
  const [ranks, setRanks] = useState([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editedPercentage, setEditedPercentage] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingRank, setEditingRank] = useState(null);
  const [deletingRankId, setDeletingRankId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [rankUpdated, setRankUpdated] = useState(false);

  // Fetch ranks from the API
  const [loading, setLoading] = useState(true); // Step 1: Create loading state
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true); // Set loading state to true

    try {
      const response = await deleteRankByAdmin(deletingRankId);

      toast.success("Rank deleted successfully!");
    } catch (error) {
      toast.error("Error deleting rank.");
      console.error("Error deleting rank:", error);
      // Handle error appropriately (maybe set a state to show an error message)
    } finally {
      setIsDeleting(false); // Set loading state back to false
      setIsDeleteModalOpen(false); // Close the modal
    }
  };

  const handleDeleteButtonClick = (id) => {
    setDeletingRankId(id);
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const handleEdit = (rank) => {
    setEditingRank(rank);
    setIsEditModalOpen(true);
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
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </DropdownMenuItem>
          {!row.original?.isDefault && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleDeleteButtonClick(row.original.id)}
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogTitle />
          <DialogDescription />
          <RankModal
            rank={editingRank}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingRank(null);
            }}
            onSave={() => {
              // setIsEditModalOpen(false);
              setRankUpdated(!rankUpdated);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle />
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rank?
            </DialogDescription>
          </DialogHeader>
          <DialogDescription />
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
