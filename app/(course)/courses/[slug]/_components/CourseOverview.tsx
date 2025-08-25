// CourseOverview.tsx (Server Component)
import Image from "next/image";
import React from "react";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import { TextContent } from "@/components/TextContent";
import VideoDialog from "./VideoDialog";

const CourseOverview = ({
  course,
  blurDataURL,
}: {
  course: any;
  blurDataURL: any;
}) => {
  const freeLesson = course?.lessons?.find(
    (lesson: any) => lesson.isFree && lesson.videoUrl
  );
  // Check if image is static or dynamic
  // const isStaticImage = imgSrc.startsWith("/") && !imgSrc.startsWith("http");
  return (
    <section id="overview" className="my-8">
      <VideoDialog course={course} freeLesson={freeLesson}>
        <div
          className={`w-full ${
            !freeLesson && "pointer-events-none"
          } relative aspect-[16/9] overflow-hidden rounded-lg`}
        >
          <Image
            src={course?.imageUrl || "/default-image.jpg"}
            alt="course"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full h-full rounded-lg bg-gray-50"
            placeholder="blur"
            blurDataURL={blurDataURL}
            quality={75}
            priority={false}
          />
          {freeLesson && (
            <button className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/icon/playvideo.svg"
                alt="play-video-icon"
                width={18}
                height={22}
              />
            </button>
          )}
        </div>
      </VideoDialog>

      <div className="space-y-4 mt-8">
        <h4 className="text-xl font-bold text-fontcolor-title">
          কোর্সের বিবরণ
        </h4>
        <div className="text-base font-medium text-gray-600 leading-[1.5]">
          {course?.description ? (
            <TextContent value={course?.description} />
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

export default CourseOverview;
