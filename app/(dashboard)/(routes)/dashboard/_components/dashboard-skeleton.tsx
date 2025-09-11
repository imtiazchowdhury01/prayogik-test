export function InfoCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="border rounded-md flex items-center gap-x-2 p-3 py-6 bg-white"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>
      ))}
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
            className="border border-border/50 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer bg-white"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export const SubscriptionMessageSkeleton = () => (
  <div className="flex items-center justify-between gap-4 p-4 rounded-lg shadow-sm bg-white border-gray-200 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-64"></div>
    </div>
    <div className="h-9 bg-gray-300 rounded w-32"></div>
  </div>
);
