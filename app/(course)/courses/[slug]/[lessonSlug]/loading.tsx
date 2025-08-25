import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import React from "react";

const LessonSkeleton = () => {
  return (
    <>
      {/* Video Section Skeleton */}
      <div className="mb-8">
        <div>
          <div className="relative aspect-w-16 aspect-h-9">
            <Skeleton
              className="w-full h-full rounded-md flex justify-center items-center bg-brand-accent animate-none"
              style={{
                outline: "1.5px solid #E5E7EB",
                borderRadius: "8px",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            </Skeleton>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonSkeleton;
