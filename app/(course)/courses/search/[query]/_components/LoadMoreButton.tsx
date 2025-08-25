// components/search/LoadMoreButton.tsx
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onClick: () => void;
}

export function LoadMoreButton({ isLoading, hasMore, onClick }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex items-center justify-center pt-5">
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="py-3 text-gray-500 min-w-[106px] relative"
        variant="outline"
      >
        {isLoading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : (
          "আরও দেখুন"
        )}
      </Button>
    </div>
  );
}