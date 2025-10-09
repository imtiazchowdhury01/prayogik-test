// components/referral/use-referrals-table-columns.tsx
// @ts-nocheck
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye } from "lucide-react";
import { formatDate, getStatusBadgeVariant, getStatusLabel } from "@/lib/utils/referral-utils";

export function useReferralsTableColumns(
  onViewPurchases: (referral: any) => void
): ColumnDef<any>[] {
  return [
    {
      id: "refereeName",
      accessorKey: "referee.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original?.referee?.name}</div>
      ),
    },
    {
      id: "refereeEmail",
      accessorKey: "referee.email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.original?.referee?.email}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className="whitespace-nowrap" variant={getStatusBadgeVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "registeredAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("registeredAt") as Date | null;
        return date ? formatDate(date as any) : "-";
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right"></div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewPurchases(row.original)}
            title="View Purchases History"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}