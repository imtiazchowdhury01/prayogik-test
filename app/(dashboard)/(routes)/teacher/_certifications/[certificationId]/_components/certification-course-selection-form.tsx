"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseSelection } from "@/components/courseSeclection/courses-selection";
import { updateCourse } from "@/lib/course/updateCourse";
import { useRouter } from "next/navigation";
import { Certification } from "@prisma/client";

interface CertificationCourseSelectionFormProps {
  certification: Certification;
  certificateId: string;
  api: string;
  className?: string;
}

export const CertificationCourseSelectionForm = ({
  certification,
  certificateId,
  api,
  className,
}: CertificationCourseSelectionFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get selected courses from certification
  const selectedCourses = certification?.courseIds || [];
  
  const toggleEdit = () => setIsEditing((current) => !current);

  const handleSubmit = useCallback(
    async (finalCourseIds: string[]) => {
      if (!certificateId) {
        throw new Error("Certificate ID is required");
      }

      setIsSubmitting(true);
      try {
        const result = await updateCourse({
          courseId: certificateId,
          values: {
            courseIds: finalCourseIds,
          },
          setLoading: setIsSubmitting,
          router,
          successMessage: "Course selection updated successfully",
          api,
        });

        console.log("Update result:", result);
        
        // Close edit mode after successful update
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        console.error("Failed to update course selection:", error);
        throw error; // Re-throw so the CourseSelection component can handle it
      } finally {
        setIsSubmitting(false);
      }
    },
    [certificateId, router, api]
  );

  return (
    <div className={cn("mt-6 border bg-slate-100 rounded-md p-4", className)}>
      <div className="font-medium flex items-center justify-between">
        <div>
          Selected Courses
          <span className="text-red-500 ml-1">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost" disabled={isSubmitting}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit courses
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            selectedCourses.length === 0 && "text-slate-500 italic"
          )}
        >
          {selectedCourses.length === 0 && "No courses selected"}
          {selectedCourses.length > 0 && (
            <div>
              <p className="text-sm mb-2 text-black">
                {selectedCourses.length} course
                {selectedCourses.length === 1 ? "" : "s"} selected
              </p>
              <p className="text-xs text-slate-600">
                Click "Edit courses" to modify your selection
              </p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="space-y-4 mt-4">
          <CourseSelection
            // No maxSelections prop means unlimited selection for admin
            previouslySelectedIds={selectedCourses}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showHeader={false}
            allowRemovePrevious={true} // Allow admin to remove previously selected courses
            className="mt-5"
            texts={{
              submitButtonText: "Update Course Selection",
              title: "Select Related Courses",
              subtitle: "Selected: {selectedCount} courses",
              emptySelectionMessage: "No courses selected yet",
              emptySelectionSubMessage: "Select as many courses as needed",
            }}
          />
        </div>
      )}
    </div>
  );
};