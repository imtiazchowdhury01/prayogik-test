"use client";

import { Table } from "@tanstack/react-table";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createEvent } from "@/lib/event/event";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import toast from "react-hot-toast";
import { isEnglish } from "@/lib/utils/stringUtils";
import { CreateEventForm } from "./create-event-form";

export type EventType = "PAID" | "FREE" | "EOI";
export type EventStatus = "DRAFT" | "UPCOMING" | "WAITING" | "CLOSED";
export type EventFormat = "ONLINE" | "OFFLINE";

interface EventFiltersProps<TData> {
  table: Table<TData>;
  eventTypes?: string[];
  eventStatuses?: string[];
  eventFormats?: string[];
}

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Event title is required").trim(),
  slug: z
    .string()
    .min(1, "Event slug is required")
    .refine((val) => isEnglish(val), {
      message: "Slug can only contain English letters, numbers, and hyphens",
    })
    .refine((val) => !val.includes(" "), {
      message: "Slug cannot contain spaces",
    }),
});

type FormData = z.infer<typeof formSchema>;

export function EventFilters<TData>({
  table,
  eventTypes = [],
  eventStatuses = [],
  eventFormats = [],
}: EventFiltersProps<TData>) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleCreateEvent = async (data: FormData) => {
    setIsCreating(true);

    try {
      const newEvent = await createEvent({
        title: data.title,
        slug: data.slug,
      });

      if (newEvent.success && newEvent.data) {
        form.reset();
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
    form.reset();
  };

  // Transform data for faceted filters
  const typeOptions = eventTypes.map((type) => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase(),
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

        {table.getColumn("platform") && (
          <DataTableFacetedFilter
            column={table.getColumn("platform")}
            title="Platform"
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
            <CreateEventForm
              onSubmit={handleCreateEvent}
              onCancel={handleModalClose}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
