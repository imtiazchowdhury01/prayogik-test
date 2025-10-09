import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LessonSkeleton = () => {
  return (
    <div className="app-container mx-auto py-24 mt-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Main Content */}
        <div className="flex-[.65]">
          {/* Course Header */}
          <div className="space-y-4 mb-6">
            <Skeleton className="h-6 w-2/3" /> {/* Course title */}
            <Skeleton className="h-6 w-1/3" /> {/* Instructor */}
            <Skeleton className="h-6 w-1/4" /> {/* Meta */}
          </div>

          {/* Video Player */}
          <div className="aspect-video rounded-lg overflow-hidden mb-8">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Tabs (Lesson Content, Attachment) */}
          <div className="flex gap-4 border-b border-gray-200 mb-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Placeholder for lesson description */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>

        {/* Right: Sidebar Lessons */}
        <div className="w-full lg:w-96 flex-[.35] bg-gray-50 p-4 rounded-md">
          {/* Sidebar header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-12" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
              >
                <Skeleton className="h-5 w-5 rounded-full" /> {/* play icon */}
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" /> {/* lesson title */}
                  <Skeleton className="h-3 w-16" /> {/* duration */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonSkeleton;

// import React from 'react'

// const loading = () => {
//   return (
//     <div>loading...</div>
//   )
// }

// export default loading;