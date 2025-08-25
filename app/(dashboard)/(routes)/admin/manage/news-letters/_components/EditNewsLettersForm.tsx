// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { updateNewsLetterSubscriber } from "../_actions/newsletters.action";
import { getTags } from "../../tags/_actions/tags.action";

interface Tag {
  id: string;
  name: string;
  leads: number;
  _count: {
    newsletterSubscribers: number;
  };
}

interface EditNewsletterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsLetterSubscriber: {
    id: string;
    email: string;
    tagId?: string | null;
    tag?: {
      id: string;
      name: string;
    };
  };
  onSuccess?: () => void;
}

export function EditNewsLettersForm({
  open,
  onOpenChange,
  newsLetterSubscriber,
  onSuccess,
}: EditNewsletterDialogProps) {
  const [email, setEmail] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  // Load available tags when dialog opens
  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open]);

  // Update form state when newsLetterSubscriber changes
  useEffect(() => {
    if (newsLetterSubscriber) {
      setEmail(newsLetterSubscriber.email);
      setSelectedTagId(newsLetterSubscriber.tagId || null);
    }
  }, [newsLetterSubscriber]);

  const loadTags = async () => {
    setLoadingTags(true);
    try {
      const tags = await getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error("Failed to load tags:", error);
      toast.error("Failed to load tags");
    } finally {
      setLoadingTags(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateNewsLetterSubscriber(newsLetterSubscriber.id, {
        email,
        tagId: selectedTagId, // Already null if no tag selected
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        onSuccess?.();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Failed to update subscriber");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (newsLetterSubscriber) {
      setEmail(newsLetterSubscriber.email);
      setSelectedTagId(newsLetterSubscriber.tagId || null);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogDescription className="sr-only"></DialogDescription>
        <DialogHeader>
          <DialogTitle>Edit Newsletter Subscriber</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Tag Assignment Field */}
          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            {loadingTags ? (
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading tags...</span>
              </div>
            ) : (
              <Select
                value={selectedTagId || undefined} // Convert null to undefined for the Select component
                onValueChange={(value) => setSelectedTagId(value || null)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {/* Available Tags - no explicit "No Tag" option needed */}
                  {availableTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="capitalize">{tag.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({tag._count.newsletterSubscribers} subscribers)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !email.trim() || loadingTags}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
