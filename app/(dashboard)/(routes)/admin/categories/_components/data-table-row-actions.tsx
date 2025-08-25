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
import { deleteCategoryByAdmin } from "@/services/admin";

export function DataTableRowActions({ row }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [editcatOpen, seteditcatOpen] = useState(false);
  const [editData, seteditData] = useState();

  const router = useRouter();

  const handleEdit = (application) => {
    seteditData(application);
    seteditcatOpen(true);
  };

  const handleDelete = async (category) => {
    if (category.courses > 0) {
      toast.error("Category deletion failed!");
      setDialogVisible(false);
      return;
    }

    try {
      setLoading(true);
      const response = await deleteCategoryByAdmin(category.id);
      toast.success("Category deleted successfully");
      router.refresh();
      setDialogVisible(false);
    } catch (error) {
      toast.error("Error deleting category.");
    } finally {
      setLoading(false);
    }
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
          {row?.original?.courses === 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setDialogVisible(true)}
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete */}
      <DeleteAlertModal
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onDelete={() => handleDelete(row.original)}
        loading={loading}
      />

      {editData && editcatOpen && (
        <CategoryDialog
          initialData={editData}
          open={editcatOpen}
          setOpen={seteditcatOpen}
          categories={row?.original?.categories || []}
        />
      )}
    </div>
  );
}
