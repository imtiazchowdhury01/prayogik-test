//@ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import DeleteAlertModal from "@/components/modals/delete-alert-modal";
import { useRouter } from "next/navigation";
import { deleteNewsLetterSubscriber } from "../_actions/newsletters.action";
import { EditNewsLettersForm } from "./EditNewsLettersForm";

interface DataTableRowActionsProps {
  row: {
    id: string;
    name: string;
    leads: number;
  };
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteNewsLetterSubscriber(row.original.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("NewsLetter deleted successfully");
        setDialogVisible(false); // Close the modal on success
        router.refresh();
      }
    } catch (error) {
      // console.log('error result:', error);
      toast.error("Failed to delete Newsletter subscriber");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    toast.success("NewsLetter Subscriber updated successfully");
    setEditDialogOpen(false);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          {/* edit tag */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setEditDialogOpen(true);
              setDropdownOpen(false);
            }}
          >
            Edit
          </DropdownMenuItem>
          {/* delete tag */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setDialogVisible(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Delete alert modal*/}
      <DeleteAlertModal
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onDelete={handleDelete} // Pass the function directly
        loading={loading}
      />
      {/* edit form  */}
      <EditNewsLettersForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        newsLetterSubscriber={row.original}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
