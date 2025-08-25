import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CreativeCourseCardSkeleton = () => {
  return (
    <div className="w-full h-[260px] rounded-md overflow-hidden">
      <Skeleton className="w-full h-full bg-gray-400 rounded-md" />
    </div>
  );
};

export default CreativeCourseCardSkeleton;
