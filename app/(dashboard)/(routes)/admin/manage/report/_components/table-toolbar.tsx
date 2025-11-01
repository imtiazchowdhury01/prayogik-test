// app/(dashboard)/sales/_components/table-toolbar.tsx
"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, CalendarIcon, Filter, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  types: string[];
  onClearFilters: () => void;
}

export function TableToolbar<TData>({
  table,
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  selectedTypes,
  onTypesChange,
  types,
  onClearFilters,
}: TableToolbarProps<TData>) {
  const hasActiveFilters = dateRange || selectedTypes.length > 0 || searchTerm;

  return (
    <div className="flex flex-wrap justify-between gap-2">
      {/* Search */}
      <div className="relative md:w-80 w-full">
        <div className="absolute z-10 left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          placeholder="Search by name, email, or item..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              className=""
              classNames={{}}
            />
          </PopoverContent>
        </Popover>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {types.map((type) => {
              // Define readable labels for each type
              const displayNameMap: Record<string, string> = {
                SINGLE_COURSE: "Course",
                CERTIFICATION: "Certification",
                EVENT: "Event",
                SUBSCRIPTION: "Subscription",
                TRIAL: "Trial",
                MEMBERSHIP: "Membership",
                OFFER: "Special Offer",
              };

              const label = displayNameMap[type] || type; // fallback if type not in map

              return (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onTypesChange([...selectedTypes, type]);
                    } else {
                      onTypesChange(selectedTypes.filter((t) => t !== type));
                    }
                  }}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="w-4 h-4 text-red-500" />
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
}
