// app/(dashboard)/sales/_components/sales-table-section.tsx
"use client";

import { Suspense, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { TableToolbar } from "./table-toolbar";
import { SalesDataTable } from "./sales-data-table";
import { createColumns, SalesRow } from "./table-columns";
import { TableSkeleton } from "./table-skeleton";

interface SalesTableSectionProps {
  data: SalesRow[];
  onViewDetails: (row: SalesRow) => void;
}

export function SalesTableSection({
  data,
  onViewDetails,
}: SalesTableSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<SalesRow[]>([]);

  // Get unique types
  const types = Array.from(new Set(data.map((item) => item.type)));

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange?.from) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        if (dateRange.from && dateRange.to) {
          return itemDate >= dateRange.from && itemDate <= dateRange.to;
        } else if (dateRange.from) {
          return itemDate >= dateRange.from;
        }
        return true;
      });
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) => selectedTypes.includes(item.type));
    }

    return filtered;
  }, [data, searchTerm, dateRange, selectedTypes]);

  const columns = useMemo(() => createColumns(onViewDetails), [onViewDetails]);

  const handleExport = () => {
    // Use selected rows if any, otherwise export all filtered data
    const dataToExport = selectedRows.length > 0 ? selectedRows : filteredData;

    const csv = [
      ["Date", "User", "Email", "Item", "Type", "Amount"],
      ...dataToExport.map((item) => [
        item.date,
        item.userName,
        item.email,
        item.itemName,
        item.type,
        item.amount,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setDateRange(undefined);
    setSelectedTypes([]);
    setSearchTerm("");
  };

  const handleSelectionChange = (rows: SalesRow[]) => {
    setSelectedRows(rows);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">Sales Details</CardTitle>
          <CardDescription>
            Complete transaction history and customer information
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {selectedRows.length > 0 && (
            <span className="text-sm text-muted-foreground self-center">
              {selectedRows.length} selected
            </span>
          )}
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
          >
            <Download className="h-4 w-4 " />
            {selectedRows.length > 0
              ? `Export Selected (${selectedRows.length})`
              : "Export All"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TableToolbar
          table={{} as any}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          types={types}
          onClearFilters={clearFilters}
        />

        <Suspense fallback={<TableSkeleton />}>
          <SalesDataTable
            columns={columns}
            data={filteredData}
            onSelectionChange={handleSelectionChange}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
