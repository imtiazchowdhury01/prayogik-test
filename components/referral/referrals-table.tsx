// components/referral/referrals-table.tsx
"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type ColumnFiltersState, type SortingState } from "@tanstack/react-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseHistorySheet } from "./purchase-history-sheet";
import type { Referral } from "@prisma/client";
import { useReferralsTableColumns } from "./referral-table-columns";
import { TableFilters } from "./referral-table-filter";
import { ReferralsTableView } from "./referral-table-view";
import { TablePagination } from "./referral-table-pagination";

interface ReferralsTableProps {
  referrals: Referral[];
}

export function ReferralsTable({ referrals }: ReferralsTableProps) {
  const [selectedReferee, setSelectedReferee] = useState<{
    name: string;
    email: string;
    userId: string;
  } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleViewPurchases = (referral: any) => {
    setSelectedReferee({
      name: referral.referee.name,
      email: referral.referee.email,
      userId: referral.referee.id,
    });
    setSheetOpen(true);
  };

  const columns = useReferralsTableColumns(handleViewPurchases);

  const table = useReactTable({
    data: referrals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Referrals</CardTitle>
          <CardDescription>
            View all your referrals and their purchase history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableFilters table={table} />
          <ReferralsTableView table={table} columns={columns} />
          <TablePagination table={table} totalItems={referrals?.length} />
        </CardContent>
      </Card>

      {selectedReferee && (
        <PurchaseHistorySheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          refereeName={selectedReferee.name}
          refereeEmail={selectedReferee.email}
          refereeUserId={selectedReferee.userId}
        />
      )}
    </>
  );
}