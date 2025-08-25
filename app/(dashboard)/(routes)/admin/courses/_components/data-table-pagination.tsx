import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useEffect, useState } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination: any;
}

export function DataTablePagination<TData>({
  table,
  pagination,
}: DataTablePaginationProps<TData>) {
  const [limit, setLimit] = useState<number>(pagination?.limit || 9);
  const [page, setPage] = useState<number>(pagination?.page || 1);
  const path = usePathname();
  const searchParams = useSearchParams();
  const updateQueryParam = useUpdateQueryParam();

  const handleLimitChange = (value: number) => {
    setLimit(value);
    updateQueryParam("limit", value.toString());
  };

  const handleNextPageClick = () => {
    setPage((prev) => {
      // Check for boundary - don't go beyond total pages
      if (prev >= pagination?.totalPages) {
        return prev; // Stay at current page
      }

      const nextPage = prev + 1;
      updateQueryParam("page", nextPage.toString()); // Use the new page value
      return nextPage;
    });
  };

  const handlePrevPageClick = () => {
    setPage((prev) => {
      // Check for boundary - don't go below page 1
      if (prev <= 1) {
        return 1; // Stay at page 1
      }

      const prevPage = prev - 1;
      updateQueryParam("page", prevPage.toString()); // Use the new page value
      return prevPage;
    });
  };

  useEffect(() => {
    if (!searchParams.get("limit")) {
      setLimit(10);
    }
  }, [path, searchParams]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="hidden lg:block flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows?.length} of{" "}
        {table.getFilteredRowModel().rows?.length} row(s) selected. */}
      </div>
      <div className="max-lg:flex-1 flex justify-between items-center gap-6 lg:gap-8">
        <div className="hidden lg:flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              handleLimitChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Page {pagination?.page} of {pagination?.totalPages}
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!pagination?.hasPrevPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="w-5 h-5" />
          </Button> */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePrevPageClick}
            disabled={!pagination?.hasPrevPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPageClick}
            disabled={!pagination?.hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="w-5 h-5" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
