// @ts-nocheck

"use client";

import { CoursesList } from "@/components/courses-list";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryPaginationProps {
  items: any[];
  searchParams: { page?: string; categoryId?: string };
  url: string;
}

export function CategoryPagination({
  items,
  searchParams,
  courses,
  pagination,
  userId,
  url,
}: CategoryPaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.page || "1")
  );

  useEffect(() => {
    setCurrentPage(Number(searchParams.page || 1));
  }, [searchParams.page]);

  const router = useRouter();

  const handlePageChange = (item: number) => {
    if (item >= 1) {
      setCurrentPage(item);
      if (searchParams.categoryId) {
        router.push(
          `${url}?categoryId=${searchParams.categoryId}&page=${item}`
        );
      } else {
        router.push(`${url}?page=${item}`);
      }
    }
  };

  return (
    <div>
      {/* Pass updated items to CoursesList */}
      <CoursesList items={courses} userId={userId} />

      {/* Pagination */}
      {pagination?.totalPages !== 1 && (
        <div className="">
          <Pagination className="flex justify-end mt-6">
            <PaginationContent>
              <PaginationItem>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination?.hasPrevPage}
                  className="relative inline-flex items-center px-3 py-1 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                >
                  Previous
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination?.hasNextPage}
                  className="relative inline-flex items-center px-3 py-1 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
