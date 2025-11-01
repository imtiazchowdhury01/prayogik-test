"use client";

import { useState, useMemo } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookOpen, Award, Zap, Gift } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./date-range-filter";
import { SummarySection } from "./summary-section";
import { ChartsSection } from "./charts-section";
import { SalesTableSection } from "./sales-table-section";
import { ViewDetailsDrawer } from "./view-details";
import { SalesRow } from "./table-columns";

export function SalesReportDashboard({ salesData }: { salesData: any[] }) {
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [globalDateRange, setGlobalDateRange] = useState<
    DateRange | undefined
  >();

  // Apply global date filter
  const globalFilteredData = useMemo(() => {
    if (!globalDateRange?.from) return salesData;

    return salesData.filter((item) => {
      const itemDate = new Date(item.date);
      if (globalDateRange.from && globalDateRange.to) {
        return (
          itemDate >= globalDateRange.from && itemDate <= globalDateRange.to
        );
      } else if (globalDateRange.from) {
        return itemDate >= globalDateRange.from;
      }
      return true;
    });
  }, [salesData, globalDateRange]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const courseSales = globalFilteredData.filter(
      (item) => item.type === "SINGLE_COURSE"
    );
    const subscriptionSales = globalFilteredData.filter(
      (item) => item.type === "SUBSCRIPTION" || item.type === "TRIAL"
    );
    const eventSales = globalFilteredData.filter(
      (item) => item.type === "EVENT"
    );
    const certificationSales = globalFilteredData.filter(
      (item) => item.type === "CERTIFICATION"
    );

    return {
      courses: {
        count: courseSales.length,
        revenue: courseSales.reduce((sum, item) => sum + item.amount, 0),
      },
      subscriptions: {
        count: subscriptionSales.length,
        revenue: subscriptionSales.reduce((sum, item) => sum + item.amount, 0),
      },
      events: {
        count: eventSales.length,
        revenue: eventSales.reduce((sum, item) => sum + item.amount, 0),
      },
      certifications: {
        count: certificationSales.length,
        revenue: certificationSales.reduce((sum, item) => sum + item.amount, 0),
      },
    };
  }, [globalFilteredData]);


  const topProducts = useMemo(() => {
    const productMap: Record<
      string,
      {
        name: string;
        type: string;
        sales: number;
        revenue: number;
        icon: React.ReactNode;
      }
    > = {};

    globalFilteredData.forEach((item) => {
      if (!productMap[item.itemName]) {
        const iconMap: Record<string, React.ReactNode> = {
          SINGLE_COURSE: <BookOpen className="h-5 w-5 text-blue-600" />,
          SUBSCRIPTION: <Gift className="h-5 w-5 text-purple-600" />,
          EVENT: <Zap className="h-5 w-5 text-orange-600" />,
          CERTIFICATION: <Award className="h-5 w-5 text-green-600" />,
        };

        productMap[item.itemName] = {
          name: item.itemName,
          type: item.type,
          sales: 0,
          revenue: 0,
          icon: iconMap[item.type] || <BookOpen className="h-5 w-5" />,
        };
      }
      productMap[item.itemName].sales += 1;
      productMap[item.itemName].revenue += item.amount;
    });

    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }, [globalFilteredData]);

  const handleViewDetails = (row: SalesRow) => {
    setSelectedSale(row);
    setViewDetailsOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 py-3">
        {/* Header with Global Date Filter */}
        <div className="flex lg:flex-row flex-col items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Report</h1>
            <p className="text-muted-foreground sm:text-sm md:text-base text-sm">
             Monitor sales performance across all products over the last 30 days.
            </p>
          </div>
          <DateRangeFilter
            dateRange={globalDateRange}
            onDateRangeChange={setGlobalDateRange}
          />
        </div>

        <SummarySection summary={summary} />

        <ChartsSection data={globalFilteredData} topProducts={topProducts} />

        <SalesTableSection
          data={globalFilteredData}
          onViewDetails={handleViewDetails}
        />

        <ViewDetailsDrawer
          open={viewDetailsOpen}
          onOpenChange={setViewDetailsOpen}
          data={selectedSale}
        />
      </div>
    </TooltipProvider>
  );
}
