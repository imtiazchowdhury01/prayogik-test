"use client"

import { useState, useMemo, useCallback } from "react"
import {
  ColumnDef,
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
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { createColumns, type Event } from "./columns"
import { revalidatePage } from "@/actions/revalidatePage"
import toast from "react-hot-toast"
import PageTitle from "@/components/pageTitle"
import { EventFilters } from "./data-table-toolbar"
import { DataTablePagination } from "./table-pagination"


interface EventTableProps {
  data: Event[]
}

export function EventTable({ data }: EventTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!selectedEvent) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/event/${selectedEvent.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete event")
      }

      toast.success("Event deleted successfully")
      await revalidatePage("/(dashboard)/(route)/admin/events")

      setIsDeleteDialogOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete event. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }, [selectedEvent])

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => createColumns({ onDelete: handleDelete }), [handleDelete])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Extract unique values for filter options - Fixed the format extraction
  const eventTypes = useMemo(() => 
    Array.from(new Set(data.map(event => event.type))).filter(Boolean)
  , [data])

  const eventStatuses = useMemo(() => 
    Array.from(new Set(data.map(event => event.status))).filter(Boolean)
  , [data])

  // Fixed: Extract format values correctly based on your column definition
  const eventFormats = useMemo(() => {
    const formats = data.map(event => event.isOnline ? "ONLINE" : "OFFLINE")
    return Array.from(new Set(formats))
  }, [data])

  return (
    <div className="space-y-4 w-full">
      <PageTitle title="Events" />

      <EventFilters
        table={table}
        eventTypes={eventTypes}
        eventStatuses={eventStatuses}
        eventFormats={eventFormats}
      />

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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event "{selectedEvent?.title}".
              {selectedEvent?.attendees && selectedEvent.attendees.length > 0 && (
                <span className="block mt-2 text-amber-600">
                  Warning: This event has {selectedEvent.attendees.length} registered attendees.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>No</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting} 
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}