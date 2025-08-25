// @ts-nocheck
"use client";

import ModalContent from "@/components/dialogModal/modal-content";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DrawerBody from "@/components/drawerBody/drawer-body";
import LoaderModal from "@/components/loaderModal/loader-modal";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EarningModalBody from "./earning-modal-body";
import EarningSourceTable from "./earning-sources-table";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTableRowActions({ row }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [revenues, setRevenues] = useState([]); // State to store revenues data
  const [title, setTitle] = useState(""); // State to store the dynamic title
  const router = useRouter();

  // Function to fetch revenues data
  const fetchRevenues = async (earningId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/teachers/earnings/${earningId}/revenues`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch revenues");
      }

      const data = await response.json();
      setRevenues(data); // Store the fetched data in state

      // Fetch the earning details to get month and year
      const earningResponse = await fetch(
        `/api/admin/teachers/earnings/${earningId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!earningResponse.ok) {
        throw new Error("Failed to fetch earning details");
      }

      const earningData = await earningResponse.json();
      const { month, year } = earningData;

      // Format the title dynamically
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      });
      setTitle(`${monthName} ${year}`); // Set the title state
    } catch (error) {
      console.error("Error fetching revenues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu
      modal={false}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
    >
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
        {row?.original?.balance_remaining > 0 && (
          <DropdownMenuItem
            onClick={() => {
              setDialogVisible(true);
              setDropdownOpen(false);
            }}
            className="cursor-pointer"
          >
            Add Payment
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={async () => {
            setDrawerOpen(true);
            await fetchRevenues(row.original.id); // Fetch revenues data
            setDropdownOpen(false);
          }}
          className="cursor-pointer"
        >
          Details
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Payment dialog form */}
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

      {/* Details drawer */}
      <Drawer
        direction="right"
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setDropdownOpen(false);
        }}
      >
        <DrawerBody
          title={loading ? <Skeleton className="w-32 h-4" /> : title}
          description={
            loading ? (
              <Skeleton className="w-36 h-4" />
            ) : (
              "All earnings are listed with courses"
            )
          }
        >
          <EarningSourceTable revenues={revenues} loading={loading} />
        </DrawerBody>
      </Drawer>

      {/* Loader Modal */}
      {/* <LoaderModal isOpen={loading} /> */}
    </DropdownMenu>
  );
}
