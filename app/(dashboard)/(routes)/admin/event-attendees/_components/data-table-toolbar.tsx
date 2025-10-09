// @ts-nocheck
"use client";
import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X, Download, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { SendAttendeeMailButton } from "@/components/common/send-attendee-mail-button";
import { sendMailToAttendees } from "@/lib/utils/sendMailToAttendees";
import toast from "react-hot-toast";

interface EventRegistrationFiltersProps<TData> {
  table: Table<TData>;
  data: TData[];
}

export function EventRegistrationFilters<TData>({
  table,
  data,
}: EventRegistrationFiltersProps<TData>) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [attendeesToSend, setAttendeesToSend] = React.useState<any[]>([]);

  const rowSelection = table.getState().rowSelection;
  const selectedRowsCount = Object.keys(rowSelection).length;

  const typeOptions = [
    { label: "Free", value: "FREE" },
    { label: "Paid", value: "PAID" },
    { label: "EOI", value: "EOI" },
  ];

  const paymentOptions = [
    { label: "Paid", value: "true" },
    { label: "Unpaid", value: "false" },
  ];

  const isFiltered =
    table.getState().columnFilters.length > 0 || dateRange || globalFilter;

  React.useEffect(() => {
    if (globalFilter) {
      table.setGlobalFilter(globalFilter);
    } else {
      table.setGlobalFilter(undefined);
    }
  }, [globalFilter, table]);

  React.useEffect(() => {
    if (dateRange?.from || dateRange?.to) {
      const isSingleDay =
        dateRange?.from &&
        dateRange?.to &&
        dateRange.from.toDateString() === dateRange.to.toDateString();

      if (isSingleDay) {
        table
          .getColumn("registeredAt")
          ?.setFilterValue([dateRange.from, undefined]);
      } else {
        table
          .getColumn("registeredAt")
          ?.setFilterValue([dateRange?.from, dateRange?.to]);
      }
    } else {
      table.getColumn("registeredAt")?.setFilterValue(undefined);
    }
  }, [dateRange, table]);

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const hasAnySelectedRowPaid = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    return selectedRows.some((row) => {
      const original = row.original as any;
      return !!original.purchase;
    });
  };

  const hasAnyRejectedAttendeeSelectedRow = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    return selectedRows.some((row) => {
      const original = row.original as any;
      return !original.isApproved;
    });
  };

  // Check if all selected events are FREE
  const areAllSelectedEventsFree = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return false;
    
    return selectedRows.every((row) => {
      const original = row.original as any;
      return original.event?.type === "FREE";
    });
  };

  // Handle send mail button click - show confirmation
  const handleSendMailClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const hasSelectedRows = selectedRows.length > 0;
    const rowsToProcess = hasSelectedRows
      ? selectedRows
      : table.getFilteredRowModel().rows;

    // Check if all events are FREE
    const allFreeEvents = rowsToProcess.every((row) => {
      const original = row.original as any;
      return original.event?.type === "FREE";
    });

    // Only check payment and approval status for PAID events
    if (!allFreeEvents) {
      if (hasAnySelectedRowPaid()) {
        toast.error("Please uncheck paid rows before sending notifications.");
        return;
      }

      if (hasAnyRejectedAttendeeSelectedRow()) {
        toast.error("Please uncheck rejected rows before sending notifications.");
        return;
      }
    } else {
      // For FREE events, still check rejection status
      if (hasAnyRejectedAttendeeSelectedRow()) {
        toast.error("Please uncheck rejected rows before sending notifications.");
        return;
      }
    }

    const attendees = rowsToProcess.map((row) => row.original);
    setAttendeesToSend(attendees);
    setShowConfirmation(true);
  };

  // Confirm and send emails
  const handleConfirmSend = async () => {
    setShowConfirmation(false);
    
    try {
      const result = await sendMailToAttendees(attendeesToSend);
    } catch (error) {
      console.error("Error sending emails:", error);
    }
    
    setAttendeesToSend([]);
  };

  // Cancel sending
  const handleCancelSend = () => {
    setShowConfirmation(false);
    setAttendeesToSend([]);
  };

  const exportToCSV = () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      const hasSelectedRows = selectedRows.length > 0;
      const rowsToExport = hasSelectedRows
        ? selectedRows
        : table.getFilteredRowModel().rows;

      const exportData = rowsToExport.map((row) => {
        const original = row.original as any;
        const paymentStatus = original.purchase ? "Paid" : "Unpaid";

        return {
          Name: original.user?.name || "N/A",
          Email: original.user?.email || "N/A",
          Phone: original.user?.phoneNumber || "N/A",
          "Event Type": original.event?.type || "N/A",
          "Event Title": original.event?.title || "N/A",
          "Payment Status": paymentStatus,
          "Registered At": original.registeredAt
            ? new Date(original.registeredAt).toLocaleDateString()
            : "N/A",
          Facebook: original.user?.facebook || "N/A",
          LinkedIn: original.user?.linkedin || "N/A",
        };
      });

      if (exportData.length === 0) {
        console.warn("No data to export");
        alert("No data to export. Please select rows or adjust filters.");
        return;
      }

      const formatCellValue = (value: any, header: string) => {
        if (value === null || value === undefined) return "N/A";
        let stringValue = String(value);

        if (header === "Phone" && stringValue !== "N/A") {
          stringValue = `\t${stringValue}`;
        }

        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n") ||
          stringValue.includes("\t")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      };

      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => formatCellValue(row[header], header))
            .join(",")
        ),
      ].join("\n");

      const BOM = "\uFEFF";
      const csvWithBOM = BOM + csvContent;
      const blob = new Blob([csvWithBOM], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);

        const filePrefix = hasSelectedRows
          ? "selected_registrations"
          : "event_registrations";
        link.setAttribute(
          "download",
          `${filePrefix}_${format(new Date(), "yyyy-MM-dd")}.csv`
        );

        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      alert("Error exporting CSV file. Please try again.");
    }
  };

  const resetFilters = () => {
    table.resetColumnFilters();
    setDateRange(undefined);
    setGlobalFilter("");
  };

  const totalFilteredCount = table.getFilteredRowModel().rows.length;

  const shouldDisableMailButton = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const rowsToCheck =
      selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

    // Check if all events are FREE
    const allFreeEvents = rowsToCheck.every((row) => {
      const original = row.original as any;
      return original.event?.type === "FREE";
    });

    // If all events are FREE, don't disable based on payment
    if (allFreeEvents) {
      return false;
    }

    // For PAID events, check payment status
    return rowsToCheck.some((row) => {
      const original = row.original as any;
      const { purchase, event } = original;

      if (purchase) return true;
      if (event?.type !== "PAID") return true;
      if (!event?.price || event.price <= 0) return true;

      return false;
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search by email or event name..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-8 w-[200px] lg:w-[300px]"
          />

          {table.getColumn("eventType") && (
            <DataTableFacetedFilter
              column={table.getColumn("eventType")}
              title="Type"
              options={typeOptions}
            />
          )}

          {table.getColumn("purchase") && (
            <DataTableFacetedFilter
              column={table.getColumn("purchase")}
              title="Payment"
              options={paymentOptions}
            />
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 w-fit justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to &&
                  dateRange.from.toDateString() !==
                    dateRange.to.toDateString() ? (
                    <>
                      {format(dateRange.from, "MMM dd, y")} -{" "}
                      {format(dateRange.to, "MMM dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, y")
                  )
                ) : (
                  "Pick date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <SendAttendeeMailButton
            onClick={handleSendMailClick}
            count={selectedRowsCount}
            disabled={selectedRowsCount === 0 || shouldDisableMailButton()}
            selectedRowsCount={selectedRowsCount}
            hasPaidRows={hasAnySelectedRowPaid()}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="h-8"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV {selectedRowsCount > 0 && `(${selectedRowsCount})`}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Send Email</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send emails to {attendeesToSend.length} attendee{attendeesToSend.length !== 1 ? 's' : ''}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSend}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend}>
              Yes, Send Emails
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}