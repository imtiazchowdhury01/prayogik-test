import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

// Skeleton component for courses grid
const CoursesGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 mt-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};


export default CoursesGridSkeleton;