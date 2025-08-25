// import React from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Loader } from "lucide-react";

// const DelegrayertModalForTag = ({
//   dialogVisible,
//   setDialogVisible,
//   onDelete,
//   loading,
// }: {
//   dialogVisible: boolean;
//   setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
//   onDelete: () => void;
//   loading: boolean;
// }) => {
//   return (
//     <AlertDialog open={dialogVisible}>
//       <AlertDialogContent className="p-6 bg-white rounded-lg shadow-lg">
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <AlertDialogFooter>
//           <AlertDialogCancel onClick={() => setDialogVisible(false)}>
//             Cancel
//           </AlertDialogCancel>
//           <AlertDialogAction onClick={onDelete}>
//             {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Continue"}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default DelegrayertModalForTag;

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllTagsExceptCurrent } from "../_actions/tags.action";
import { AlertDialogOverlay } from "@radix-ui/react-alert-dialog";

interface Tag {
  id: string;
  name: string;
  leads: number;
}

const DelegrayertModalForTag = ({
  dialogVisible,
  setDialogVisible,
  onDelete,
  loading,
  tagData,
  subscribersCount = 0,
}: {
  dialogVisible: boolean;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (options?: { force?: boolean; reassignToTagId?: string }) => void;
  loading: boolean;
  tagData: { id: string; name: string; leads: number };
  subscribersCount?: number;
}) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [loadingTags, setLoadingTags] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"normal" | "reassign" | "force">(
    "normal"
  );

  const hasSubscribers = subscribersCount > 0;

  // Load available tags when dialog opens and has subscribers
  useEffect(() => {
    if (dialogVisible && hasSubscribers) {
      loadAvailableTags();
    }
  }, [dialogVisible, hasSubscribers, tagData.id]);

  const loadAvailableTags = async () => {
    setLoadingTags(true);
    try {
      const tags = await getAllTagsExceptCurrent(tagData.id);
      setAvailableTags(tags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleCancel = () => {
    setDialogVisible(false);
    setDeleteMode("normal");
    setSelectedTagId("");
  };

  const handleDelete = () => {
    if (deleteMode === "reassign" && selectedTagId) {
      onDelete({ reassignToTagId: selectedTagId });
    } else if (deleteMode === "force") {
      onDelete({ force: true });
    } else {
      onDelete();
    }
  };

  const canProceed = () => {
    if (!hasSubscribers) return true;
    if (deleteMode === "force") return true;
    if (deleteMode === "reassign" && selectedTagId) return true;
    return false;
  };

  return (
    <AlertDialog open={dialogVisible}>
      <AlertDialogContent className="p-0 overflow-hidden bg-white rounded-lg shadow-xl max-w-md">
        <AlertDialogHeader className="px-6 pt-4 pb-4 border-b">
          <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Delete Tag "{tagData.name}"
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="sr-only"></AlertDialogDescription>
        <div className="px-6 py-4 text-gray-700">
          {!hasSubscribers ? (
            <div className="text-gray-600">
              <span>
                This action cannot be undone. Are you sure you want to delete
                this tag?
              </span>
            </div>
          ) : (
            <>
              <div className="p-3 mb-4 bg-amber-50 border font-medium text-amber-800 border-amber-200 rounded-lg">
                ⚠️ This tag has {subscribersCount} lead
                {subscribersCount !== 1 ? "s" : ""}
              </div>

              <div className="mb-4 text-gray-600">
                <span>Choose how to delete the tags:</span>
              </div>

              <div className="space-y-4">
                {/* Reassign Option */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="radio"
                      id="reassign"
                      name="deleteMode"
                      value="reassign"
                      checked={deleteMode === "reassign"}
                      onChange={(e) =>
                        setDeleteMode(e.target.value as "reassign")
                      }
                      className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="reassign"
                      className="block font-medium text-gray-700 cursor-pointer"
                    >
                      Reassign Leads to another tag
                    </label>
                    {deleteMode === "reassign" && (
                      <div className="mt-3">
                        {loadingTags ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader className="w-4 h-4 animate-spin" />
                            Loading tags...
                          </div>
                        ) : availableTags.length > 0 ? (
                          <Select
                            value={selectedTagId}
                            onValueChange={setSelectedTagId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTags.map((tag) => (
                                <SelectItem key={tag.id} value={tag.id}>
                                  <span className="capitalize">{tag.name}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm italic text-gray-500">
                            No other tags available for reassignment
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Force Delete Option */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="radio"
                      id="force"
                      name="deleteMode"
                      value="force"
                      checked={deleteMode === "force"}
                      onChange={(e) => setDeleteMode(e.target.value as "force")}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="force"
                      className="block font-medium text-red-600 cursor-pointer"
                    >
                      Delete forcefully
                    </label>
                    <div className="mt-1 text-xs text-red-500">
                      ⚠️ This will remove the tag association from all{" "}
                      {subscribersCount} lead
                      {subscribersCount !== 1 ? "s" : ""} (leads will remain but
                      become untagged)
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <AlertDialogFooter className="px-6 py-4 bg-gray-50">
          <div className="flex justify-end items-center gap-3">
            <AlertDialogCancel
              onClick={handleCancel}
              className="px-4 mt-0 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={!canProceed() || loading}
              variant={deleteMode === "force" ? "destructive" : "default"}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                deleteMode === "force"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-gray-600 hover:bg-gray-700 hover:opacity-85 focus:ring-primary-brand"
              }`}
            >
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {deleteMode === "force"
                ? "Delete Forcefully"
                : deleteMode === "reassign"
                ? "Reassign & Delete"
                : "Delete"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DelegrayertModalForTag;
