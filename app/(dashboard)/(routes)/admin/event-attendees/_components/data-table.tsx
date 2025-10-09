"use client";

import { useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PageTitle from "@/components/pageTitle";
import { EventRegistrationFilters } from "./data-table-toolbar";
import { DataTablePagination } from "./table-pagination";
import { createEventRegistrationColumns } from "./columns";
import { AttendeeProfileModal } from "./AttendeeProfileModal"; // Add this import
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";

export function EventRegistrationTable({ data }: any) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "registeredAt", desc: true }, 
  ]);

  // Add modal state
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle view profile action
  const handleViewProfile = (attendee: any) => {
    setSelectedAttendee({
      user: { ...attendee.user },
      event: { ...attendee.event },
      registeredAt: attendee.registeredAt,
      purchase: attendee.purchase,
      isApproved: attendee.isApproved,
    });
    setIsModalOpen(true);
  };

  // Create columns with the callback - pass the handler
  const columns = createEventRegistrationColumns(handleViewProfile);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableText = [
        row.original.user?.name,
        row.original.user?.email,
        row.original.event?.title,
        formatDateForDisplay(row.original.registeredAt), // Include formatted date in search
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(filterValue.toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 w-full">
      <PageTitle title="Attendees" />

      <div className="space-y-4">
        <EventRegistrationFilters table={table} data={data} />
      </div>

      <div className="rounded-md border relative overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No event registrations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      {/* Add the Profile Modal */}
      <AttendeeProfileModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAttendee(null); // Clear the selected attendee when closing
        }}
        attendee={selectedAttendee}
      />
    </div>
  );
}
