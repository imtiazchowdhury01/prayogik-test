// @ts-nocheck
"use client";

import { useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  totalDuration?: number;
  courseType: string;
  courseMode: string;
  category?: {
    name: string;
    slug: string;
  };
  teacherProfile: {
    user: {
      name: string;
      email: string;
    };
  };
  prices: Array<{
    regularAmount: number;
    discountedAmount?: number;
    isFree: boolean;
  }>;
  _count: {
    lessons: number;
    enrolledStudents: number;
  };
  isPurchased?: boolean;
  isPreviouslySelected?: boolean;
}

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  isPreviouslySelected?: boolean;
  onAdd: () => void;
  onRemove: () => void;
  canAddMore: boolean;
  variant?: "available" | "selected";
  allowRemovePrevious?: boolean;
}

export function CourseSelectionCard({
  course,
  isSelected,
  isPreviouslySelected = false,
  onAdd,
  onRemove,
  canAddMore,
  variant = "available",
  allowRemovePrevious = false,
}: CourseCardProps) {
  const actionButton = useMemo(() => {
    if (variant === "selected") {
      // If it's a previously selected course
      if (isPreviouslySelected) {
        if (allowRemovePrevious) {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Remove previously selected course"
            >
              <Minus className="h-4 w-4" />
            </Button>
          );
        }
        
        // Otherwise, show check mark (non-removable)
        return (
          <div
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "text-xs px-2 h-8 cursor-default"
            )}
          >
            <Check className="h-3 w-3 mr-1" />
            পূর্বে নির্বাচিত
          </div>
        );
      }

      // For newly selected courses, always show remove button
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label="Remove course"
        >
          <Minus className="h-4 w-4" />
        </Button>
      );
    }

    // For available courses
    if (isPreviouslySelected) {
      return (
        <div
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "text-xs px-2 h-8 cursor-default"
          )}
        >
          <Check className="h-3 w-3 mr-1" />
          নির্বাচিত
        </div>
      );
    }

    if (isSelected) {
      return (
        <div
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "text-xs px-2 h-8"
          )}
        >
          নির্বাচিত
        </div>
      );
    }

    return (
      <Button
        onClick={onAdd}
        disabled={!canAddMore}
        variant="primary"
        size="sm"
        className="h-8 w-8 p-0"
        aria-label="Add course"
      >
        <Plus className="h-3 w-3" />
      </Button>
    );
  }, [variant, isSelected, isPreviouslySelected, onAdd, onRemove, canAddMore, allowRemovePrevious]);

  return (
    <Card
      className={cn(
        "group transition-all duration-200",
        variant === "selected"
          ? "border-primary/20 bg-primary/5"
          : "hover:shadow-md",
        isPreviouslySelected && !allowRemovePrevious && "border-muted bg-muted/30"
      )}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {course?.imageUrl && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                <Image
                  src={course.imageUrl}
                  alt={course?.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2 break-words">
                {course?.title}
              </h3>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-2">
                <span className="truncate">
                  {course?.teacherProfile?.user.name}
                </span>
                <div className="flex items-center gap-2">
                  {course?._count?.lessons ? (
                    <span>
                      {convertNumberToBangla(course?._count?.lessons)}টি লেসন
                    </span>
                  ) : null}
                  {course?._count?.enrolledStudents > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {convertNumberToBangla(
                          course?._count?.enrolledStudents
                        )}{" "}
                        শিক্ষার্থী
                      </span>
                    </>
                  )}
                </div>
              </div>
              {variant === "available" && course.slug && (
                <Link
                  href={`/courses/${course?.slug}`}
                  className="text-brand hover:underline text-xs inline-block"
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                >
                  বিস্তারিত
                </Link>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">{actionButton}</div>
        </div>
      </div>
    </Card>
  );
}