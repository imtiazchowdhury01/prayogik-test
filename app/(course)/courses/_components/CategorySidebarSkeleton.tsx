import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for sidebar loading state
const CategorySidebarSkeleton = () => {
  return (
    <aside className="w-full bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow-custom p-4 lg:sticky lg:top-[10%] lg:max-w-sm">
      <div className="flex flex-col w-full my-5 space-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    </aside>
  );
};

export default CategorySidebarSkeleton