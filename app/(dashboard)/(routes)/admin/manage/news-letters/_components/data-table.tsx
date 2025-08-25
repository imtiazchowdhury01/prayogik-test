// @ts-nocheck
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Check,
  ChevronsUpDown,
  Loader,
  Loader2,
  Pencil,
  Tag,
} from "lucide-react";
import PageTitle from "@/components/pageTitle";
import { bulkUpdateNewsletterTags } from "../_actions/newsletters.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tagOptions: alltags,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTag, setSelectedTag] = React.useState<
    string | null | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Create tag options from alltags array and include "Unassigned"
  const tagOptions = React.useMemo(() => {
    const baseOptions = alltags.map((tag) => ({
      label: tag.name,
      value: tag.name,
      icon: Tag,
    }));

    // Add "Unassigned" option
    return [
      ...baseOptions,
      {
        label: "Unassigned",
        value: "Unassigned",
        icon: Tag,
      },
    ];
  }, [alltags]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;
  const router = useRouter();

  const handleBulkTagUpdate = async (newTag: string | null) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    try {
      await bulkUpdateNewsletterTags(selectedIds, newTag);
      toast.success(`Updated ${selectedIds.length} subscribers`);
      setRowSelection({});
      router.refresh();
    } catch (error) {
      console.log("error result:", error);
      toast.error(error.message || "Failed to update tags");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <PageTitle title="All Newsletter Subscribers" />
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search by emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {table.getColumn("tag") && (
            <DataTableFacetedFilter
              column={table.getColumn("tag")}
              title="Tag"
              options={tagOptions}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
          {/* Bulk Operations Section - ADD THIS */}
          {Object.keys(rowSelection).length > 0 && (
            <div className="flex items-center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 w-[200px] justify-between border-dashed focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:border-dashed focus:ring-offset-0"
                  >
                    <span className="flex flex-row items-center">
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      {selectedTag !== undefined
                        ? tagOptions.find(
                            (option) => option.value === selectedTag
                          )?.label || "Select tag..."
                        : "Edit Tag"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      className="focus:ring-0 focus:border-gray-500"
                      placeholder="Search tags..."
                    />
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {tagOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setSelectedTag(
                              currentValue === selectedTag
                                ? undefined
                                : currentValue
                            );
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedTag === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-row items-center text-gray-700 justify-start gap-2 w-full">
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {selectedTag !== undefined && (
                      <div className="p-2 border-t">
                        <Button
                          variant="default"
                          className="w-full h-8"
                          disabled={isSubmitting}
                          onClick={async () => {
                            setIsSubmitting(true);
                            try {
                              await handleBulkTagUpdate(
                                selectedTag === "null" ? null : selectedTag
                              );
                              setSelectedTag(undefined);
                              setOpen(false);
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <Loader className="h-4 w-4 animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        {/* <DataTableViewOptions table={table} /> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
