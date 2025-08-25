// components/EditTagDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { updateTag } from "../_actions/tags.action";

interface EditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: {
    id: string;
    name: string;
  };
  onSuccess?: () => void;
}

export function EditTagsForm({
  open,
  onOpenChange,
  tag,
  onSuccess,
}: EditTagDialogProps) {
  const [name, setName] = useState(tag.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateTag(tag.id, { name });

      if (result.error) {
        toast.error(result.error);
      } else {
        onSuccess?.(); //
      }
    } catch (error) {
      toast.error("Failed to update tag");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription className="sr-only"></DialogDescription>
          <DialogTitle className="capitalize">
            Edit Tag:
            <span className="border rounded-full px-2 font-light text-sm bg-gray-100 ml-2 capitalize">
              {name}
            </span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tag Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
