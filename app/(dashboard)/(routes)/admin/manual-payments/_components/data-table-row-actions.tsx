// @ts-nocheck
"use client";

import DeleteAlertModal from "@/components/modals/delete-alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ManualPaymentDialog } from "./edit-manual-bkash-payment";
import { clientApi } from "@/lib/utils/openai/client";
import { useSession } from "next-auth/react";

export function DataTableRowActions({ row }) {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.info?.isSuperAdmin || false;

  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [editDialogOpen, seteditDialogOpen] = useState(false);
  const [editData, seteditData] = useState();

  const router = useRouter();

  const handleEdit = (application) => {
    seteditData(application);
    seteditDialogOpen(true);
  };

  const handleDelete = async (bkashPayment) => {
    // console.log('bkashPayment result:', bkashPayment.id);
    try {
      setLoading(true);
      const response = await clientApi.deleteBkashPaymentById({
        params: {
          id: bkashPayment.id,
        },
      });
      // console.log("response result:", response);
      toast.success("Payment deleted successfully");
      // toast.success(response.body.message);
      router.refresh(); // Refresh the data
      setDialogVisible(false);
    } catch (error) {
      toast.error("Error deleting payment");
      console.error("Delete error:", error);
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
          {/* delete  */}
          {isSuperAdmin && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setDialogVisible(true)}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {editData && editDialogOpen && (
        <ManualPaymentDialog
          initialData={editData}
          open={editDialogOpen}
          setOpen={seteditDialogOpen}
        />
      )}
      {/* Delete Confirmation Dialog */}
      <DeleteAlertModal
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onDelete={() => handleDelete(row.original)}
        loading={loading}
      />
    </div>
  );
}
