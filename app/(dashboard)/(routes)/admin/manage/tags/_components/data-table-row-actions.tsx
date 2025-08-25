// //@ts-nocheck
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal } from "lucide-react";
// import toast from "react-hot-toast";
// import { deleteTag, getLeadsWithData } from "../_actions/tags.action";
// import { EditTagsForm } from "./EditTagsForm";
// import DeleteAlertModal from "@/components/modals/delete-alert-modal";
// import { useRouter } from "next/navigation";
// import ViewLeads from "./ViewLeads";
// import DeleteAlertModalForTag from "./delete-alert-modal-for-tag";

// interface DataTableRowActionsProps {
//   row: {
//     id: string;
//     name: string;
//     leads: number;
//   };
// }

// export function DataTableRowActions({ row }: DataTableRowActionsProps) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [dialogVisible, setDialogVisible] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loadingSubscribers, setLoadingSubscribers] = useState(false);
//   const [leads, setLeads] = useState<
//     Array<{ id: string; email: string; createdAt: string }>
//   >([]);
//   const router = useRouter();

//   const handleDelete = async (tag) => {
//     setLoading(true);
//     try {
//       const result = await deleteTag(row.id);

//       if (result.error) {
//         if (result.subscribersCount) {
//           toast.error(
//             `Cannot delete: ${result.subscribersCount} subscribers exist`
//           );
//         } else {
//           toast.error(result.error);
//         }
//       } else {
//         toast.success("Tag deleted successfully");
//         router.refresh();
//         setDropdownOpen(false);
//       }
//     } catch (error) {
//       toast.error("Failed to delete tag");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSuccess = () => {
//     toast.success("Tag updated successfully");
//     setEditDialogOpen(false);
//     router.refresh();
//   };

//   const handleViewClick = async () => {
//     setDrawerOpen(true);
//     setDropdownOpen(false);
//     setLoadingSubscribers(true);
//     try {
//       const leadsData = await getLeadsWithData(row.id);
//       setLeads(leadsData);
//     } catch (error) {
//       toast.error("Failed to load leads");
//       console.error(error);
//     } finally {
//       setLoadingSubscribers(false);
//     }
//   };

//   return (
//     <>
//       <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
//             aria-label="Open actions menu"
//           >
//             <MoreHorizontal className="h-4 w-4" />
//             <span className="sr-only">Open menu</span>
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-[160px]">
//           {/* view leads */}
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={handleViewClick}
//           >
//             View
//           </DropdownMenuItem>
//           {/* edit tag */}
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={() => {
//               setEditDialogOpen(true);
//               setDropdownOpen(false);
//             }}
//           >
//             Edit
//           </DropdownMenuItem>
//           {/* delete tag */}
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={() => setDialogVisible(true)}
//           >
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       {/* Delete alert modal*/}
//       <DeleteAlertModalForTag
//         dialogVisible={dialogVisible}
//         setDialogVisible={setDialogVisible}
//         onDelete={() => handleDelete(row.original)}
//         loading={loading}
//       />
//       {/* edit form  */}
//       <EditTagsForm
//         open={editDialogOpen}
//         onOpenChange={setEditDialogOpen}
//         tag={row}
//         onSuccess={handleEditSuccess}
//       />
//       {/* Leads drawer */}
//       <ViewLeads
//         row={row}
//         drawerOpen={drawerOpen}
//         setDrawerOpen={setDrawerOpen}
//         loadingSubscribers={loadingSubscribers}
//         leads={leads}
//       />
//     </>
//   );
// }

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
import { deleteTag, getLeadsWithData } from "../_actions/tags.action";
import { EditTagsForm } from "./EditTagsForm";
import { useRouter } from "next/navigation";
import ViewLeads from "./ViewLeads";
import DeleteAlertModalForTag from "./delete-alert-modal-for-tag";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [leads, setLeads] = useState<
    Array<{ id: string; email: string; createdAt: string }>
  >([]);
  const router = useRouter();

  const handleDelete = async (options?: {
    force?: boolean;
    reassignToTagId?: string;
  }) => {
    setLoading(true);
    try {
      const result = await deleteTag(row.id, options);

      if (result.error) {
        if (result.subscribersCount) {
          // This shouldn't happen with the new flow, but keeping as fallback
          setSubscribersCount(result.subscribersCount);
          toast.error(
            `Cannot delete: ${result.subscribersCount} subscribers exist`
          );
        } else {
          toast.error(result.error);
        }
      } else {
        const successMessage = options?.reassignToTagId
          ? "Tag deleted and subscribers reassigned successfully"
          : options?.force
          ? "Tag deleted successfully (subscribers remain untagged)"
          : "Tag deleted successfully";

        toast.success(successMessage);
        router.refresh();
        setDialogVisible(false);
        setDropdownOpen(false);
      }
    } catch (error) {
      toast.error("Failed to delete tag");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setSubscribersCount(row.leads);
    setDialogVisible(true);
    setDropdownOpen(false);
  };

  const handleEditSuccess = () => {
    toast.success("Tag updated successfully");
    setEditDialogOpen(false);
    router.refresh();
  };

  const handleViewClick = async () => {
    setDrawerOpen(true);
    setDropdownOpen(false);
    setLoadingSubscribers(true);
    try {
      const leadsData = await getLeadsWithData(row.id);
      setLeads(leadsData);
    } catch (error) {
      toast.error("Failed to load leads");
      console.error(error);
    } finally {
      setLoadingSubscribers(false);
    }
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
          {/* view leads */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleViewClick}
          >
            View Leads
          </DropdownMenuItem>
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
            onClick={handleDeleteClick}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Enhanced Delete alert modal */}
      <DeleteAlertModalForTag
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onDelete={handleDelete}
        loading={loading}
        tagData={row}
        subscribersCount={subscribersCount}
      />

      {/* edit form  */}
      <EditTagsForm
        key={row.id} // Add this line
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tag={row}
        onSuccess={handleEditSuccess}
      />

      {/* Leads drawer */}
      <ViewLeads
        row={row}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        loadingSubscribers={loadingSubscribers}
        leads={leads}
      />
    </>
  );
}
