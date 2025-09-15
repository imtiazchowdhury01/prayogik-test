import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24 bg-gray-200" /> {/* "All Users" title */}
        <Skeleton className="h-10 w-24 bg-gray-200" /> {/* "Add User" button */}
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 bg-gray-200" /> {/* Search input */}
        <Skeleton className="h-10 w-20 bg-gray-200" /> {/* Status filter */}
        <Skeleton className="h-10 w-20 bg-gray-200" /> {/* Admin filter */}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="grid grid-cols-7 gap-4">
            <Skeleton className="h-4 w-12 bg-gray-200" /> {/* Name */}
            <Skeleton className="h-4 w-12 bg-gray-200" /> {/* Email */}
            <Skeleton className="h-4 w-16 bg-gray-200" /> {/* Gender */}
            <Skeleton className="h-4 w-24 bg-gray-200" /> {/* Teacher Status */}
            <Skeleton className="h-4 w-28 bg-gray-200" />{" "}
            {/* Created Courses */}
            <Skeleton className="h-4 w-28 bg-gray-200" />{" "}
            {/* Enrolled Courses */}
            <Skeleton className="h-4 w-24 bg-gray-200" /> {/* Subscription */}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="grid grid-cols-7 gap-4 items-center">
                {/* Name column with avatar */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />{" "}
                  {/* Avatar */}
                  <Skeleton className="h-4 w-20 bg-gray-200" /> {/* Name */}
                </div>
                {/* Email column */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 bg-gray-200" /> {/* Email */}
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />{" "}
                  {/* Status dot */}
                </div>
                {/* Gender column */}
                <Skeleton className="h-4 w-12 bg-gray-200" />
                {/* Teacher Status column */}
                <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />{" "}
                {/* Status badge */}
                {/* Created Courses column */}
                <Skeleton className="h-4 w-4 bg-gray-200" />
                {/* Enrolled Courses column */}
                <Skeleton className="h-4 w-4 bg-gray-200" />
                {/* Subscription column */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12 bg-gray-200" />
                  <Skeleton className="h-6 w-6 bg-gray-200" /> {/* Menu dots */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 bg-gray-200" />{" "}
        {/* "0 of 186 row(s) selected" */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 bg-gray-200" />{" "}
            {/* "Rows per page" */}
            <Skeleton className="h-8 w-16 bg-gray-200" /> {/* Dropdown */}
          </div>
          <Skeleton className="h-4 w-20 bg-gray-200" /> {/* "Page 1 of 19" */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 bg-gray-200" /> {/* First page */}
            <Skeleton className="h-8 w-8 bg-gray-200" /> {/* Previous page */}
            <Skeleton className="h-8 w-8 bg-gray-200" /> {/* Next page */}
            <Skeleton className="h-8 w-8 bg-gray-200" /> {/* Last page */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
