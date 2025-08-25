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

export function DataTableRowActions({ row }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  const handleEdit = (selectedRow) => {
    router.push(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/teachers/${selectedRow.id}` //passing user id
    );
  };
  const handleEarningNavigation = (selectedRow) => {
    router.push(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/teachers/${selectedRow.teacherProfileId}/earnings` //passing teacherProfileId
    );
  };
  const handlePaymentNavigation = (selectedRow) => {
    router.push(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/teachers/${selectedRow.teacherProfileId}/payments` //passing teacherProfileId
    );
  };

  const handleDelete = async (teacherId) => {
    setLoading(true); // Set loading to true
    const response = await fetch(`/api/teacher/${teacherId}`, {
      method: "DELETE",
    });
    setLoading(false); // Reset loading after response

    if (response.ok) {
      toast.success("Teacher deleted successfully");
      router.refresh();
      setDialogVisible(false);
    } else {
      // Manage error
    }
  };

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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleEarningNavigation(row.original)}
        >
          Earnings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handlePaymentNavigation(row.original)}
        >
          Payments
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
      <AlertDialog open={dialogVisible}>
        <AlertDialogContent className="p-6 bg-white rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
