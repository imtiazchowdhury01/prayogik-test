import { Skeleton } from "@/components/ui/skeleton";

// components/Loader.js
export default function Loader() {
  return (
    <div className="rounded-lg">
      <Skeleton className="h-6 w-28 mb-4" />
      {/* <div className="flex justify-between mb-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div> */}

      <div className="border rounded-lg">
        <div className="grid grid-cols-4 gap-6 p-4 border-b">
          {["Name", "Role", "Email", "Gender"].map(
            (header, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            )
          )}
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-6 p-4 border-b">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-6 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
