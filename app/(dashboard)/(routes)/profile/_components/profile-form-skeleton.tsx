import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Name & Email */}
      <div className="flex gap-4 mt-4">
        <div className="w-full">
          <Skeleton className="h-5 w-20 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="w-full">
          <Skeleton className="h-5 w-20 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
      </div>

      {/* Date of Birth & Gender */}
      <div className="flex gap-4 mt-4">
        <div className="w-full">
          <Skeleton className="h-5 w-28 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="w-full">
          <Skeleton className="h-5 w-20 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Select */}
        </div>
      </div>

      {/* Nationality */}
      <div className="w-full mt-4">
        <Skeleton className="h-5 w-28 mb-2" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>

      {/* Bio */}
      <div className="w-full mt-4">
        <Skeleton className="h-5 w-16 mb-2" /> {/* Label */}
        <Skeleton className="h-20 w-full" /> {/* Textarea */}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Skeleton className="h-10 w-24" /> {/* Cancel Button */}
        <Skeleton className="h-10 w-24" /> {/* Save Button */}
      </div>
    </div>
  );
}
