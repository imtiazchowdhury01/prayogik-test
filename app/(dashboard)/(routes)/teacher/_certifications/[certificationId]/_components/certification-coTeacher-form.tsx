"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { updateCourse } from "@/lib/course/updateCourse";
import { useRouter } from "next/navigation";

// Schema for the form
const coTeacherSchema = z.object({
  coTeacherIds: z.array(z.string()).optional(),
});

type CoTeacherFormValues = z.infer<typeof coTeacherSchema>;

type TeacherWithProfile = {
  id: string;
  name: string;
  email: string;
  teacherProfile?: {
    id: string;
  };
};

interface CertificationCoTeacherFormProps {
  teachers: TeacherWithProfile[];
  initialCoTeachers?: string[];
  certificationId: string;
  api: string;
}

export function CertificationCoTeacherForm({
  teachers,
  initialCoTeachers = [],
  certificationId,
  api,
}: CertificationCoTeacherFormProps) {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<CoTeacherFormValues>({
    resolver: zodResolver(coTeacherSchema),
    defaultValues: {
      coTeacherIds: initialCoTeachers,
    },
  });

  const { isSubmitting, isDirty } = form.formState;
  const selectedTeacherIds = form.watch("coTeacherIds") || [];

  // Check if there are actual changes by comparing arrays
  const hasActualChanges = () => {
    const current = selectedTeacherIds.sort();
    const initial = [...initialCoTeachers].sort();
    
    if (current.length !== initial.length) return true;
    return current.some((id, index) => id !== initial[index]);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    form.reset({ coTeacherIds: initialCoTeachers });
  };

  const handleFormSubmit = async (values: CoTeacherFormValues) => {
    setLoading(true);
    try {
      // Use the updateCourse pattern you mentioned
      await updateCourse({
        courseId: certificationId, // Using certificationId as courseId
        values: { coTeacherIds: values.coTeacherIds || [] },
        toggleEdit,
        setLoading,
        router,
        successMessage: "Teachers updated successfully",
        api,
      });
    } catch (error) {
      console.error("Error updating teachers:", error);
      setLoading(false);
    }
  };

  const handleTeacherSelect = (teacherId: string) => {
    const currentIds = selectedTeacherIds;
    const isSelected = currentIds.includes(teacherId);

    if (isSelected) {
      // Remove teacher
      form.setValue(
        "coTeacherIds",
        currentIds.filter((id) => id !== teacherId),
        { shouldDirty: true, shouldValidate: true }
      );
    } else {
      // Add teacher
      form.setValue(
        "coTeacherIds", 
        [...currentIds, teacherId],
        { shouldDirty: true, shouldValidate: true }
      );
    }
  };

  const handleRemoveTeacher = (teacherId: string) => {
    const currentIds = selectedTeacherIds;
    form.setValue(
      "coTeacherIds",
      currentIds.filter((id) => id !== teacherId),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const getSelectedTeachers = () => {
    return teachers.filter((teacher) =>
      selectedTeacherIds.includes(teacher.teacherProfile?.id || "")
    );
  };

  if (!isEditing) {
    return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Teachers
          <Button onClick={toggleEdit} variant="ghost">
            <Pencil className="h-4 w-4 mr-2" />
            Edit teachers
          </Button>
        </div>
        <div className="mt-2">
          {initialCoTeachers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getSelectedTeachers().map((teacher) => (
                <div
                  key={teacher.teacherProfile?.id}
                  className="bg-white px-3 py-1 rounded-full text-sm border"
                >
                  {teacher.name} ({teacher.email})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No Teachers</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Teachers
        <Button onClick={toggleEdit} variant="ghost">
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-4"
        >
          <FormField
            control={form.control}
            name="coTeacherIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Teachers</FormLabel>

                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={popoverOpen}
                        className={cn(
                          "w-full justify-between",
                          selectedTeacherIds.length === 0 &&
                            "text-muted-foreground"
                        )}
                      >
                        {selectedTeacherIds.length > 0
                          ? `${selectedTeacherIds.length} teacher(s) selected`
                          : "Select teachers"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search teachers..."
                        className="border-none outline-none focus:ring-0 my-1"
                      />
                      <CommandList>
                        <CommandEmpty>No teachers found.</CommandEmpty>
                        <CommandGroup>
                          {/* Clear All Selection Option */}
                          {selectedTeacherIds.length > 0 && (
                            <CommandItem
                              value="clear-all"
                              onSelect={() => {
                                form.setValue("coTeacherIds", [], { shouldDirty: true, shouldValidate: true });
                                setPopoverOpen(false);
                              }}
                            >
                              <X className="mr-2 h-4 w-4" />
                              <div>
                                <p className="text-muted-foreground">
                                  Clear all selections
                                </p>
                              </div>
                            </CommandItem>
                          )}

                          {teachers && teachers.length > 0 ? (
                            teachers.map((teacher) => {
                              const isSelected = selectedTeacherIds.includes(
                                teacher.teacherProfile?.id || ""
                              );
                              return (
                                <CommandItem
                                  value={teacher.email}
                                  key={teacher.teacherProfile?.id}
                                  onSelect={() => {
                                    handleTeacherSelect(
                                      teacher.teacherProfile?.id || ""
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p>{teacher.name}</p>
                                    <p className="text-muted-foreground text-xs">
                                      {teacher.email}
                                    </p>
                                  </div>
                                </CommandItem>
                              );
                            })
                          ) : (
                            <CommandItem disabled>
                              No teachers available
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Selected Teachers Display */}
                <div className="mt-3">
                  {selectedTeacherIds.length > 0 ? (
                    <>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Selected Teachers ({selectedTeacherIds.length}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getSelectedTeachers().map((teacher) => (
                          <div
                            key={teacher.teacherProfile?.id}
                            className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            <span>
                              {teacher.name} ({teacher.email})
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveTeacher(teacher.teacherProfile?.id || "")
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500 italic bg-gray-50 border border-gray-200 rounded-md p-2">
                      No co-teacher selected
                    </div>
                  )}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            <Button 
              type="submit" 
              disabled={loading || isSubmitting || !hasActualChanges()}
              className="disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}