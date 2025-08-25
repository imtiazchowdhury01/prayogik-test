const CourseDetailSkeleton = () => {
  return (
    <div>
      <div className="bg-[#105650]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-6 py-3 lg:px-8">
          <div className="h-6 w-48 bg-teal-700 animate-pulse rounded-md"></div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content Skeleton */}
          <div className="flex-1">
            <div className="h-[400px] w-full bg-gray-200 rounded-md animate-pulse"></div>

            <div className="mt-4">
              <div className="h-32 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="mt-4 w-full">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-md bg-white animate-pulse"
                  >
                    {/* Left: Image Placeholder */}
                    <div className="h-[80px] w-[120px] bg-gray-200 rounded-md"></div>

                    {/* Right: Details Placeholder */}
                    <div className="flex flex-col flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-200 rounded-md"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
                      <div className="h-4 w-1/3 bg-gray-200 rounded-md"></div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, starIndex) => (
                          <div
                            key={starIndex}
                            className="h-4 w-4 bg-gray-200 rounded-full"
                          ></div>
                        ))}
                        <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="flex-initial w-full relative lg:w-96 z-10">
            <div className="w-full h-full ">
              <div className="sticky bg-white top-4">
                <div className="border border-gray-200 min-h-[80vh] p-4">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-full bg-gray-200 rounded-md animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Courses Skeleton */}
          <div className="block md:hidden">
            <div className="h-32 w-full bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseDetailSkeleton;
