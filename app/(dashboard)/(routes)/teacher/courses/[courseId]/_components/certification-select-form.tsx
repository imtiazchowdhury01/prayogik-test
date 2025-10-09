"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Pencil, Loader, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateCourse } from "@/lib/course/updateCourse";
import { Certification } from "@prisma/client";

interface CertificationFormProps {
  initialData: {
    certificationIds?: string[];
  };
  courseId: string;
  certifications: Certification[];
}

interface CertificationOption {
  label: string;
  value: string;
}

const formSchema = z.object({
  certificationIds: z.array(z.string()),
});

export const CertificationSelectForm = ({
  initialData,
  courseId,
  certifications,
}: CertificationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Store initial values for comparison
  const initialCertificationIds = initialData?.certificationIds || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificationIds: initialCertificationIds,
    },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  const selectedCertificationIds = watch("certificationIds");

  // Function to compare arrays (order doesn't matter)
  const arraysEqual = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, idx) => val === sorted2[idx]);
  };

  // Check if current state matches initial state
  const hasChanges = useMemo(() => {
    return !arraysEqual(selectedCertificationIds, initialCertificationIds);
  }, [selectedCertificationIds, initialCertificationIds]);

  // Convert certifications prop to options format
  const certificationOptions: CertificationOption[] = certifications.map(
    (cert) => ({
      label: cert.title || "",
      value: cert.id,
    })
  );

  // Handle certification selection for multiple selection
  const handleCertificationSelect = (value: string) => {
    const currentCertificationIds = selectedCertificationIds || [];
    let newCertificationIds;

    if (currentCertificationIds.includes(value)) {
      // Remove if already selected
      newCertificationIds = currentCertificationIds.filter(
        (id) => id !== value
      );
    } else {
      // Add if not selected
      newCertificationIds = [...currentCertificationIds, value];
    }

    setValue("certificationIds", newCertificationIds, { shouldValidate: true });
  };

  // Remove a selected certification
  const removeCertification = (certificationId: string) => {
    const newCertificationIds = selectedCertificationIds.filter(
      (id) => id !== certificationId
    );
    setValue("certificationIds", newCertificationIds, { shouldValidate: true });
  };

  // Get selected certification labels for display
  const getSelectedCertificationLabels = () => {
    return selectedCertificationIds
      .map(
        (certificationId) =>
          certificationOptions.find((cert) => cert.value === certificationId)
            ?.label
      )
      .filter(Boolean);
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await updateCourse({
        courseId,
        values,
        toggleEdit,
        setLoading,
        router,
      });
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>Certifications</div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-2">
          {selectedCertificationIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getSelectedCertificationLabels().map((label, index) => (
                <Badge key={index} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No certifications selected
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            {/* Selected Certifications Display */}
            {selectedCertificationIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getSelectedCertificationLabels().map((label, index) => (
                  <div
                    key={selectedCertificationIds[index]}
                    className="text-xs bg-blue-100 text-blue-800 rounded-full p-1.5 flex items-center"
                  >
                    <p>{label}</p>
                    <button
                      type="button"
                      onClick={() =>
                        removeCertification(selectedCertificationIds[index])
                      }
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Certification Selector using shadcn Popover and Command */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  type="button"
                >
                  {selectedCertificationIds.length > 0
                    ? `${selectedCertificationIds.length} certification(s) selected`
                    : "Select certifications..."}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="p-2">
                  <CommandInput placeholder="Search certifications..." className="mb-1"/>
                  <CommandEmpty>No certifications found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {certificationOptions.map((option) => {
                      const isSelected = selectedCertificationIds.includes(
                        option.value
                      );
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() =>
                            handleCertificationSelect(option.value)
                          }
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={cn(isSelected && "font-medium")}>
                              {option.label}
                            </span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Show errors if validation fails */}
          {errors.certificationIds && (
            <div className="text-red-500 text-sm mt-2">
              {errors.certificationIds.message}
            </div>
          )}

          <div className="flex items-center gap-x-2">
            <Button 
              disabled={!isValid || loading || !hasChanges} 
              type="submit"
            >
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};