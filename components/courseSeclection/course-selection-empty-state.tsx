// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface EmptyStateProps {
  isSearchMode: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

export function CourseSelectionEmptyState({
  isSearchMode,
  searchQuery,
  onClearSearch,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-muted">
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center">
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {isSearchMode
              ? `"${searchQuery}" এর জন্য কোন কোর্স পাওয়া যায়নি`
              : "কোন কোর্স পাওয়া যায়নি"}
          </p>
          {isSearchMode && (
            <Button
              variant="outline"
              onClick={onClearSearch}
              className="mt-3"
              size="sm"
            >
              সব কোর্স দেখুন
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}