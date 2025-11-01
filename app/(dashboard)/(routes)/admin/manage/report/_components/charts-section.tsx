import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesChart } from "./sales-chart";
import { TopProducts } from "./top-products";
import { ChartsSkeleton } from "./charts-skeleton";

interface ChartsSectionProps {
  data: any[];
  topProducts: Array<{
    name: string;
    type: string;
    sales: number;
    revenue: number;
    icon: React.ReactNode;
  }>;
}

export function ChartsSection({ data, topProducts }: ChartsSectionProps) {
  return (
    <Suspense fallback={<ChartsSkeleton />}>
      <div className="flex gap-4 xl:flex-row flex-col">
        <Card className="border-border/50 w-full xl:w-8/12">
          <CardHeader>
            <CardTitle className="text-lg">Daily Overview</CardTitle>
            <CardDescription>
              Overview of sales and earnings from the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={data} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm w-full xl:w-4/12">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts data={topProducts} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
