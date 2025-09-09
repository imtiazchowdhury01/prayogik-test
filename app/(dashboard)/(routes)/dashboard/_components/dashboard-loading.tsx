import { cn } from "@/lib/utils";

export function InfoCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { label: "In Progress", variant: "default" },
        { label: "Completed", variant: "success" },
      ].map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "border rounded-md flex items-center gap-x-2 p-3 bg-white"
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 animate-pulse">
            <div className="h-5 w-5 bg-gray-300 rounded" />
          </div>
          <div>
            <p className="font-medium">{item.label}</p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
              <span>Courses</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CoursesTabSkeleton() {
  return (
    <div className="w-full pt-5">
      {/* Content Area */}
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-4 space-y-3"
              >
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
// Skeleton component for Dashboard Summary
export function DashboardSummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Purchased Courses", icon: "BookOpen" },
          { title: "Prime Courses", icon: "GraduationCap" },
          { title: "Certification Courses", icon: "Users" },
          { title: "Registered Events", icon: "Calendar" },
        ].map((metric, index) => (
          <div
            key={metric.title}
            className="border border-border/50 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </div>
              <div className="p-2 bg-brand-accent rounded-lg">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-foreground">
                  <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="h-3 w-3 bg-gray-300 rounded animate-pulse" />
                  <span className="font-medium">Loading...</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {metric.title === "Purchased Courses" &&
                    "Total courses purchased"}
                  {metric.title === "Prime Courses" && "Active prime courses"}
                  {metric.title === "Certification Courses" &&
                    "Active certification courses"}
                  {metric.title === "Registered Events" &&
                    "Upcoming events registered"}
                </p>
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// Skeleton Components
export function CourseCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

export function TabContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export const InfoCardCountSkeleton = () => (
  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
);
