"use client";

import type React from "react";
import { Package } from "lucide-react";

interface TopProduct {
  name: string;
  type: string;
  sales: number;
  revenue: number;
  icon: React.ReactNode;
}

interface TopProductsProps {
  data: TopProduct[];
}

export function TopProducts({ data }: TopProductsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "COURSE":
        return "bg-blue-100 dark:bg-blue-900/40";
      case "SUBSCRIPTION":
        return "bg-purple-100 dark:bg-purple-900/40";
      case "EVENT":
        return "bg-orange-100 dark:bg-orange-900/40";
      case "CERTIFICATION":
        return "bg-green-100 dark:bg-green-900/40";
      default:
        return "bg-gray-100 dark:bg-gray-900/40";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "COURSE":
        return "text-blue-700 dark:text-blue-300";
      case "SUBSCRIPTION":
        return "text-purple-700 dark:text-purple-300";
      case "EVENT":
        return "text-orange-700 dark:text-orange-300";
      case "CERTIFICATION":
        return "text-green-700 dark:text-green-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base mb-1">No Data Found Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Top selling products will appear here once you start making sales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {data.map((product, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`p-2 rounded-lg ${getTypeColor(
                  product.type
                )} flex-shrink-0`}
              >
                {product.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {product.name}
                </p>
                <p className={`text-xs ${getTextColor(product.type)}`}>
                  {product.type}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-sm font-bold text-foreground">
                ৳{product.revenue.toLocaleString("en-US")}
              </p>
              <p className="text-sm text-muted-foreground">
                {product.sales}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
