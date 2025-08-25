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
import { ResetUserPass } from "./reset-user-pass";

export function DataTableRowActions({ row }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [resetPassIdDialogOpen, setresetPassIdDialogOpen] = useState();
  const [resetPassUserId, setresetPassUserId] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [resetPassLoading, setresetPassLoading] = useState(false);
  const router = useRouter();

  const handleEdit = (user) => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/users/${user.id}`);
  };

  // const handleDelete = async (userId) => {
  //   setLoading(true); // Set loading to true
  //   const response = await fetch(`/api/admin/users/${userId}`, {
  //     method: "DELETE",
  //   });
  //   setLoading(false); // Reset loading after response

  //   if (response.ok) {
  //     toast.success("User deleted successfully");
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

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setresetPassUserId(row.original.id);
            setresetPassIdDialogOpen(row.original);
          }}
        >
          Reset password
        </DropdownMenuItem>

        {/* <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setDialogVisible(true)}
        >
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>

      {/* Delete */}
      <DeleteAlertModal
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onDelete={() => handleDelete(row.original.id)}
        loading={loading}
      />

      {resetPassUserId && (
        <ResetUserPass
          dialogOpen={resetPassIdDialogOpen}
          setDialogOpen={setresetPassIdDialogOpen}
          userId={resetPassUserId}
        />
      )}
    </DropdownMenu>
  );
}
