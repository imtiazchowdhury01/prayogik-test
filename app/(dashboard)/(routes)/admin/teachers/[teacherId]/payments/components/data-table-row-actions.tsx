// @ts-nocheck
"use client";

import ModalContent from "@/components/dialogModal/modal-content";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import EarningModalBody from "./earning-modal-body";

export function DataTableRowActions({ row }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const totalPayable = 3000.0;

  // Create zod schema for validation
  const formSchema = z.object({
    payAmount: z
      .number()
      .positive("Amount must be greater than 0")
      .refine((val) => val <= totalPayable, {
        message: `Amount cannot exceed ${totalPayable} TK`,
      }),
    status: z.string().min(1, "Please select a status"),
  });

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payAmount: "",
      status: "",
    },
  });

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => {
            setDialogVisible(true);
            setDropdownOpen(false);
          }}
          className="cursor-pointer"
        >
          Add Payment
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog
        open={dialogVisible}
        onOpenChange={(open) => {
          setDialogVisible(open);
          if (!open) setDropdownOpen(false);
        }}
      >
        <ModalContent title="Add Payment">
          <EarningModalBody
            earningId={row?.original?.id}
            row={row}
            setDialogVisible={setDialogVisible}
          />
        </ModalContent>
      </Dialog>
    </DropdownMenu>
  );
}
