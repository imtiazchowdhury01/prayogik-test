import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Loader } from "lucide-react";

const DeleteAlertModal = ({
  dialogVisible,
  setDialogVisible,
  onDelete,
  loading,
}: {
  dialogVisible: boolean;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => Promise<void> | void;
  loading: boolean;
}) => {
  return (
    <AlertDialog
      open={dialogVisible}
      onOpenChange={setDialogVisible} // This ensures clicking outside closes it
    >
      <AlertDialogContent className="p-6 bg-white rounded-lg shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onDelete();
            }}
            disabled={loading}
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertModal;
