// app/(dashboard)/sales/_components/skeletons/table-skeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-80" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-96" />
        </div>
      </CardContent>
    </Card>
  );
}
