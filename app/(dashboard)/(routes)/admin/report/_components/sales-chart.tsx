"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface SalesChartProps {
  data: Array<{
    date: string;
    amount: number;
    type: string;
    status: string;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const chartData = useMemo(() => {
    const salesByDate: Record<string, { count: number; revenue: number }> = {};

    // Group by date with both count and revenue
    data
      .filter((item) => item.status === "COMPLETED")
      .forEach((item) => {
        if (!salesByDate[item.date]) {
          salesByDate[item.date] = { count: 0, revenue: 0 };
        }
        salesByDate[item.date].count += 1;
        salesByDate[item.date].revenue += item.amount;
      });

    // Convert to array and sort by actual date
    return Object.entries(salesByDate)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: date, // Keep for sorting
        sales: data.count,
        revenue: data.revenue,
      }))
      .sort(
        (a, b) =>
          new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
      );
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          stroke="#0D9488"
          label={{
            value: "Sales Count",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12 },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          stroke="#8b5cf6"
          label={{
            value: "Revenue (৳)",
            angle: 90,
            position: "insideRight",
            style: { fontSize: 12 },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
          formatter={(value: number, name: string) => [
            name === "sales" ? `${value} sales` : `৳${value.toLocaleString()}`,
            name === "sales" ? "Sales Count" : "Revenue",
          ]}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="sales"
          stroke="#0D9488"
          strokeWidth={2}
          dot={{ r: 4, fill: "#0D9488" }}
          activeDot={{ r: 6 }}
          name="Sales Count"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 4, fill: "#8b5cf6" }}
          activeDot={{ r: 6 }}
          name="Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
