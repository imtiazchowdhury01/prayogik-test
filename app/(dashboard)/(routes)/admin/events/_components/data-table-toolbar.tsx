"use client";

import { Table } from "@tanstack/react-table";
import { X, Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/event/event";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import toast from "react-hot-toast";
import { isEnglish } from "@/lib/utils/stringUtils";
export type EventType = "PAID" | "FREE";
export type EventStatus = "DRAFT" | "UPCOMING" | "WAITING" | "CLOSED";
export type EventFormat = "ONLINE" | "OFFLINE";

interface EventFiltersProps<TData> {
  table: Table<TData>;
  eventTypes?: string[];
  eventStatuses?: string[];
  eventFormats?: string[];
}

export function EventFilters<TData>({
  table,
  eventTypes = [],
  eventStatuses = [],
  eventFormats = [],
}: EventFiltersProps<TData>) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateEvent = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      return;
    }
    if (isEnglish(formData.slug) === false) {
      toast.error(
        "Slug can only contain English letters, numbers, and hyphens"
      );
      return;
    }
    setIsCreating(true);

    try {
      const newEvent = await createEvent({
        title: formData.title.trim(),
        slug: formData.slug.trim(),
      });

      if (newEvent.success && newEvent.data) {
        setFormData({ title: "", slug: "" });
        setIsModalOpen(false);
        router.push(`/admin/events/${newEvent.data.id}`);
      } else {
        toast.error(
          newEvent.error || "Failed to create event. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ title: "", slug: "" });
  };

  const handleTitleChange = (value: string) => {
    handleFormChange("title", value);
    const slugFromTitle = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    handleFormChange("slug", slugFromTitle);
  };

  // Transform data for faceted filters
  const typeOptions = eventTypes.map((type) => ({
    value: type,
    label: type === "PAID" ? "Paid" : "Free",
  }));

  const statusOptions = eventStatuses.map((status) => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase(),
  }));

  const formatOptions = eventFormats.map((format) => ({
    value: format,
    label: format === "ONLINE" ? "Online" : "Offline",
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter events..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={typeOptions}
          />
        )}

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusOptions}
          />
        )}

        {table.getColumn("format") && (
          <DataTableFacetedFilter
            column={table.getColumn("format")}
            title="Format"
            options={formatOptions}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-8 px-3 lg:px-4">
              <Plus size={14} className="mr-1" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Enter the event details to create a new event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title..."
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Event Slug</Label>
                <Input
                  id="slug"
                  placeholder="event-slug"
                  value={formData.slug}
                  onChange={(e) => handleFormChange("slug", e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateEvent}
                disabled={!formData.title.trim() || isCreating}
              >
                {isCreating ? (
                  <Loader className="animate-spin" size={14} />
                ) : (
                  "Create Event"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
