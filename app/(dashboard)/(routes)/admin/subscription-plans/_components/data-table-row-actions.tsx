// @ts-nocheck
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Loader, MoreHorizontal } from "lucide-react";
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
import SubscriptionForm from "./SubscriptionForm";
import { deleteSubscriptionPlan } from "@/services/admin";

export function DataTableRowActions({ row }) {
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);

  const [editing, setEditing] = useState<string | null>(null);
  const [editedPercentage, setEditedPercentage] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [deletingRankId, setDeletingRankId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteSubscriptionPlan(deletingSubscriptionId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting subscription:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteButtonClick = (id) => {
    setDeletingSubscriptionId(id);
    setIsDeleteModalOpen(true); // Open confirmation modal
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
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
          {!row?.original?.isDefault && (
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

      {/* Delete */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogTitle />
          <DialogDescription />
          <DialogHeader>
            <SubscriptionForm
              onClose={() => {
                setIsCreateModalOpen(false);
              }}
              onSave={() => {
                setSubscriptionUpdated(!subscriptionUpdated);
              }}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogTitle />
          <DialogDescription />
          <SubscriptionForm
            subscription={editingSubscription}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingSubscription(null);
            }}
            onSave={() => {
              setIsEditModalOpen(false);
              setSubscriptionUpdated(!subscriptionUpdated);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription?
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
