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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { labels } from "../data/data";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteAlertModal from "@/components/modals/delete-alert-modal";

export function DataTableRowActions({ row }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  const handleEdit = (application) => {
    router.push(`/admin/courses/${application?.id}`);
  };

  // const handleDelete = async (teacherId) => {
  //   setLoading(true); // Set loading to true
  //   const response = await fetch(`/api/teacher/${teacherId}`, {
  //     method: "DELETE",
  //   });
  //   setLoading(false); // Reset loading after response

  //   if (response.ok) {
  //     toast.success("Teacher deleted successfully");
  //     router.refresh();
  //     setDialogVisible(false);
  //   } else {
  //     // Manage error
  //   }
  // };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem onClick={() => setDialogVisible(true)}>
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>

      <DeleteAlertModal
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onDelete={() => handleDelete(row.original.id)}
        loading={loading}
      />
    </DropdownMenu>
  );
}
