//@ts-nocheck
"use client";
import ExpertCard from "@/components/ExpertCard";
import { Button } from "@/components/ui/button";
import { TeacherWithProfileSchema } from "@/lib/utils/openai/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;

interface TeachersGridProps {
  teachers: TeacherWithProfile[];
  blurDataMap: Record<string, string>;
}

const TeachersGrid = ({ teachers, blurDataMap }: TeachersGridProps) => {
  if (!teachers || teachers.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-fontcolor-subtitle">কোন শিক্ষক পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="px-1 py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
        {teachers.map((teacher, index) => {
          const blurDataURL = teacher?.avatarUrl
            ? blurDataMap[teacher.avatarUrl]
            : null;
          return (
            <div
              key={teacher.id || index}
              className="h-full transition-transform duration-300 ease-in-out hover:-translate-y-1"
            >
              <ExpertCard teacher={teacher} blurDataURL={blurDataURL} />
            </div>
          );
        })}
      </div>
      {/* see more button for both */}
      <div className="flex items-center justify-center mt-6">
        {teachers?.length >= 4 && (
          <Link href="/teachers">
            <Button
              variant={"default"}
               className="bg-secondary-button hover:bg-secondary-button hover:opacity-95 transition-all duration-300 py-4 h-12 md:flex"
              // className="text-gray-700 border-gray-300 transition-all duration-300 py-4 h-12 md:flex bg-transparent"
            >
              আরো দেখুন{" "}
              <ArrowRight className="w-5 h-5 ml-1 font-extralight" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TeachersGrid;
