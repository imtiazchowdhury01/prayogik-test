import { Skeleton } from "@/components/ui/skeleton"

// Skeleton component for courses grid that matches CourseCard structure
const CoursesGridSkeleton = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 mt-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`flex flex-col h-full min-h-[500px] relative overflow-hidden rounded-lg border-[1px] border-[#E6E7E7] ${
            variant === "light" ? "bg-white shadow-custom" : "bg-[#133b37] shadow-custom"
          }`}
        >
          {/* Course image skeleton */}
          <div className="relative w-full overflow-hidden rounded-t-lg" style={{ aspectRatio: "16 / 9" }}>
            <Skeleton className="w-full h-full rounded-t-lg" />
          </div>

          <div className="flex flex-col justify-between px-4 py-3">
            {/* Text content skeleton */}
            <div className="space-y-2 mt-[9px]">
              {/* Course title skeleton */}
              <Skeleton className="h-6 w-full" />

              {/* Instructor name skeleton */}
              <Skeleton className="h-4 w-2/3" />

              {/* Description skeleton - 2 lines */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Student count and duration skeleton */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom part skeleton */}
          <div className="px-4 pb-4 space-y-2 pt-5 mt-auto">
            {/* Badge skeleton */}
            <Skeleton className="h-6 w-32 rounded-full" />

            {/* Price skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Action button skeleton */}
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CoursesGridSkeleton
