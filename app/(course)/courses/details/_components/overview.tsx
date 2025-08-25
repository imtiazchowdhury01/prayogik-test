//@ts-nocheck
import { Preview } from "@/components/preview";
import Image from "next/image";

export default function CourseOverview({ course }) {
  return (
    <div className="w-full mt-5 md:mt-7">
      <Image
        src={course.imageUrl || ""}
        alt="Course Thumbnail"
        height={450}
        width={600}
        className="h-auto w-full rounded-lg"
        quality={75}
        priority
      />
      <div className="max-w-4xl mx-auto mt-8 md:mt-16">
        <Preview value={course.description!} />
      </div>
    </div>
  );
}
