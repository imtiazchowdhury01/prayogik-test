"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
}

export function DateRangeFilter({
  onDateRangeChange,
  dateRange,
}: DateRangeFilterProps) {
  const [quickFilter, setQuickFilter] = useState<string>("all");

  const handleQuickFilter = (value: string) => {
    setQuickFilter(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let range: DateRange | undefined;

    switch (value) {
      case "7days":
        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);
        range = { from: last7Days, to: today };
        break;
      case "10days":
        const last10Days = new Date();
        last10Days.setDate(today.getDate() - 10);
        last10Days.setHours(0, 0, 0, 0);
        range = { from: last10Days, to: today };
        break;
      case "30days":
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);
        range = { from: last30Days, to: today };
        break;
      case "all":
      default:
        range = undefined;
        break;
    }

    onDateRangeChange(range);
  };

  const handleCustomDateRange = (range: DateRange | undefined) => {
    setQuickFilter("custom");
    onDateRangeChange(range);
  };

  const clearFilter = () => {
    setQuickFilter("all");
    onDateRangeChange(undefined);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Custom Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[240px]",
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
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleCustomDateRange}
            numberOfMonths={2}
            className=""
            classNames={{}}
          />
        </PopoverContent>
      </Popover>
      {/* Quick Filter Dropdown */}
      <Select value={quickFilter} onValueChange={handleQuickFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="7days">Last 7 Days</SelectItem>
          <SelectItem value="10days">Last 10 Days</SelectItem>
          <SelectItem value="30days">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filter Button */}
      {dateRange && (
        <Button variant="secondary" onClick={clearFilter} className="gap-2">
          <X className="w-4 h-4 text-red-500" />
          Reset filters
        </Button>
      )}
    </div>
  );
}
