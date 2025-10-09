export const CourseSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-16 bg-gray-200 rounded mb-4"></div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border bg-gray-100 rounded-md p-8">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border bg-gray-100 rounded-md p-8">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
