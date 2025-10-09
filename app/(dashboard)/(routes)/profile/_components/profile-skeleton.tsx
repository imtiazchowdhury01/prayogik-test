import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto bg-white/50 p-6 rounded-lg space-y-6 mt-8">
  
      {/* Avatar */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full  bg-gray-100" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40 rounded-md bg-gray-100" />
          <Skeleton className="h-5 w-32 rounded-md bg-gray-100" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full rounded-md bg-gray-100" /> {/* নাম */}
        <Skeleton className="h-10 w-full rounded-md bg-gray-100" /> {/* ইমেইল */}
        <Skeleton className="h-10 w-full rounded-md bg-gray-100" /> {/* জন্ম তারিখ */}
        <Skeleton className="h-10 w-full rounded-md bg-gray-100" /> {/* লিঙ্গ */}
      </div>

      {/* Textarea */}
      <Skeleton className="h-24 w-full rounded-md bg-gray-100" />

      {/* Save Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-md bg-gray-100" />
      </div>
    </div>
  );
}
