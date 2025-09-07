// CourseOverview.tsx (Server Component)
import Image from "next/image";
import React from "react";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import { TextContent } from "@/components/TextContent";

const EventOverview = ({
  event,
  blurDataURL,
}: {
  event: any;
  blurDataURL?: string | null; // Make it optional
}) => {
  return (
    <section id="overview" className="my-8">
      <div
        className={`w-full  
         relative aspect-[16/9] overflow-hidden rounded-lg`}
      >
        <Image
          src={event?.imageUrl || "/default-image.jpg"}
          alt="event"
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover w-full h-full rounded-lg bg-gray-50"
          // placeholder={blurDataURL ? "blur" : "empty"} // Conditionally set placeholder
          // blurDataURL={blurDataURL || ""} // Will be undefined if not provided
          quality={75}
          priority={false}
        />
      </div>

      <div className="space-y-4 mt-10">
        <h4 className="text-2xl font-bold text-fontcolor-title">
          ইভেন্টের বিস্তারিত
        </h4>
        <div className="text-base font-medium text-gray-600 leading-[1.5]">
          {event?.description ? (
            <TextContent value={event?.description} />
          ) : (
            <EmptyState
              title="ডেসক্রিপশন নেই"
              icons={[FileText]}
              description="অনুগ্রহপূর্বক ডেসক্রিপশন যোগ করুন"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default EventOverview;
