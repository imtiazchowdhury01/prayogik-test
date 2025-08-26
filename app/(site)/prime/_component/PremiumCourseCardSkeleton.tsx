// components/PremiumCourseCardSkeleton.jsx
import React from "react";

const PremiumCourseCardSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4 rounded-lg bg-gray-200 p-4">
      {/* Image Skeleton */}
      <div className="aspect-video w-full rounded-lg bg-gray-300"></div>

      {/* Title Skeleton */}
      <div className="h-6 w-3/4 rounded bg-gray-300"></div>

      {/* Description Skeleton */}
      <div className="h-4 w-full rounded bg-gray-300"></div>
      <div className="h-4 w-2/3 rounded bg-gray-300"></div>

      {/* Price Skeleton */}
      <div className="h-6 w-1/2 rounded bg-gray-300"></div>

      {/* Button Skeleton */}
      <div className="h-10 w-full rounded-lg bg-gray-300"></div>
    </div>
  );
};

export default PremiumCourseCardSkeleton;
