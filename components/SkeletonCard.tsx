const SkeletonCard = () => {
  return (
    <div className="mx-auto max-w-7xl mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col animate-pulse mb-12"
        >
          <div className="relative border">
            <div className="bg-gray-300 w-full h-52"></div>
            <div className="absolute inset-0 flex items-center justify-center mt-4">
              <div className="bg-gray-400 rounded-full w-24 h-24"></div>
            </div>
          </div>

          <div className="mt-4 p-4">
            <div className="flex items-center gap-x-4 text-xs">
              <div className="bg-gray-200 rounded-full w-24 h-6"></div>
              <div className="bg-gray-200 rounded-full w-16 h-6"></div>
            </div>
            <div className="mb-2 mt-4">
              <div className="bg-gray-200 rounded w-48 h-6"></div>
            </div>
            <div className="text-sm text-gray-700 mb-4 mt-2">
              <div className="bg-gray-200 rounded w-full h-6"></div>
            </div>
          </div>

          <div className="p-4 mt-auto">
            <div className="bg-gray-200 rounded w-full h-10"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
