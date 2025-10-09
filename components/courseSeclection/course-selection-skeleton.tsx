// @ts-nocheck
"use client";

import { Card } from "@/components/ui/card";

export function CourseSelectionSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-15 bg-muted rounded flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded flex-shrink-0" />
        </div>
      </div>
    </Card>
  );
}