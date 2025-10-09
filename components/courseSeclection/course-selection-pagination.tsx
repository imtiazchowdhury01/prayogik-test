
"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { useWindowSize } from "@/hooks/use-window-size";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationProps {
  pagination: Pagination;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const MOBILE_BREAKPOINT = 768;

export function CourseSelectionPagination({
  pagination,
  currentPage,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const { width } = useWindowSize();

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages;
    const current = currentPage;
    const pages: number[] = [];

    // For mobile, show fewer pages
    const isMobile = width < MOBILE_BREAKPOINT;
    const maxPages = isMobile ? 3 : 5;
    const start = Math.max(1, current - Math.floor(maxPages / 2));
    const end = Math.min(totalPages, start + maxPages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [pagination.totalPages, currentPage, width]);

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-4 pt-3 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrevPage || isLoading}
        className="h-8 px-2"
      >
        <ChevronLeft className="h-3 w-3" />
        <span className="hidden xs:inline ml-1">পূর্ববর্তী</span>
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className="w-8 h-8 p-0 text-xs"
          >
            {convertNumberToBangla(pageNum)}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage || isLoading}
        className="h-8 px-2"
      >
        <span className="hidden xs:inline mr-1">পরবর্তী</span>
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  );
}