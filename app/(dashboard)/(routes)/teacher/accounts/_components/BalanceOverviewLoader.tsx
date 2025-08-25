// components/BalanceOverviewSkeleton.js
export default function BalanceOverviewLoader() {
  return (
    <div className="flex flex-col space-y-4 animate-pulse">
      {/* Available Balance Skeleton */}
      <div className="flex gap-x-2 max-lg:justify-between">
        <span className="font-normal text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </span>
        <span className="text-primary-500 font-bold text-base">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </span>
      </div>

      {/* Total Earned Skeleton */}
      <div className="flex gap-x-2 max-lg:justify-between">
        <span className="font-normal text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </span>
        <span className="text-primary-500 font-normal">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </span>
      </div>

      {/* Total Paid Skeleton */}
      <div className="flex gap-x-2 max-lg:justify-between">
        <span className="font-normal text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </span>
        <span className="text-primary-500 font-normal">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </span>
      </div>

      {/* Last Payment On Skeleton */}
      <div className="flex text-sm gap-x-2 max-lg:justify-between">
        <span className="font-normal text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </span>
        <span className="text-primary-500">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </span>
      </div>
    </div>
  );
}
