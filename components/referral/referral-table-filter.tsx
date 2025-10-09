// components/referral/table-filters.tsx
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";

interface TableFiltersProps {
  table: Table<any>;
}

export function TableFilters({ table }: TableFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <Input
        name="search"
        placeholder="Filter by name..."
        value={(table.getColumn("refereeName")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("refereeName")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <Select
        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) =>
          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {/* <SelectItem value="CLICKED">Clicked</SelectItem> */}
          <SelectItem value="REGISTERED">Registered</SelectItem>
          {/* <SelectItem value="PAID_LITE">Paid Lite</SelectItem> */}
          <SelectItem value="PAID_PRIME">Paid Prime</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}