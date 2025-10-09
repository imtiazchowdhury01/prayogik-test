// components/referral/purchase-history-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function PurchaseHistorySkeleton() {
  return (
    <>
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <div className="max-h-[400px] overflow-hidden">
          <div className="p-4">
            {/* Table Header */}
            <div className="flex gap-4 pb-4 border-b">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 py-4 border-b">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}