// // @ts-nocheck
// import {
//   createCategoryByAdmin,
//   createCourseRoadmapByAdmin,
//   updateCategoryByAdmin,
//   updateCourseRoadmapByAdmin,
// } from "@/services/admin";
// import RequiredFieldStar from "@/components/common/requiredFieldStar";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader, ChevronDown, ChevronsUpDown, Check } from "lucide-react";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { format, set } from "date-fns";
// import { cn } from "@/lib/utils";
// import * as z from "zod";
// import { CourseRoadmapStatus, DifficultyLevel } from "@prisma/client";
// import { clientApi } from "@/lib/utils/openai/client";
// import {
//   courseRoadmapSchema,
//   TeacherWithProfileSchema,
// } from "@/lib/utils/openai/types";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { revalidatePage } from "@/actions/revalidatePage";

// type CourseRoadmapFormValues = z.infer<typeof courseRoadmapSchema>;

// type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;

// interface CourseRoadmapDialogProps {
//   initialData?: CourseRoadmapFormValues & { id?: string };
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   teachers: TeacherWithProfile[]; // Add teachers prop
// }

// // Default form values
// const getDefaultValues = (
//   initialData?: CourseRoadmapFormValues & { id?: string }
// ): CourseRoadmapFormValues => ({
//   title: initialData?.title || "",
//   description: initialData?.description || "",
//   status: initialData?.status || CourseRoadmapStatus.PLANNED,
//   category: initialData?.category || "",
//   estimatedDuration: initialData?.estimatedDuration || "",
//   targetDate: initialData?.targetDate
//     ? new Date(initialData.targetDate)
//     : new Date(),
//   difficulty: initialData?.difficulty || DifficultyLevel.BEGINNER,
//   prerequisites: initialData?.prerequisites || "",
//   courseLink: initialData?.courseLink || "",
//   teacherId: initialData?.teacherId || null, // Changed from "" to null
// });

// // Status options for better maintainability
// const STATUS_OPTIONS = [
//   { value: CourseRoadmapStatus.PLANNED, label: "Planned" },
//   { value: CourseRoadmapStatus.IN_PROGRESS, label: "In Progress" },
//   { value: CourseRoadmapStatus.COMPLETED, label: "Completed" },
// ];

// // Difficulty options
// const DIFFICULTY_OPTIONS = [
//   { value: DifficultyLevel.BEGINNER, label: "Beginner" },
//   { value: DifficultyLevel.INTERMEDIATE, label: "Intermediate" },
//   { value: DifficultyLevel.ADVANCED, label: "Advanced" },
// ];

// export function CourseRoadMapDialog({
//   initialData,
//   open,
//   setOpen,
//   teachers,
// }: CourseRoadmapDialogProps) {
//   const [loading, setLoading] = useState(false);
//   const [popoverOpen, setPopoverOpen] = useState(false);

//   const router = useRouter();
//   const isEditing = Boolean(initialData?.id);

//   const form = useForm<CourseRoadmapFormValues>({
//     resolver: zodResolver(courseRoadmapSchema),
//     defaultValues: getDefaultValues(initialData),
//   });

//   // Reset form when initialData changes (for editing)
//   useEffect(() => {
//     if (initialData) {
//       form.reset(getDefaultValues(initialData));
//     }
//   }, [initialData, form]);

//   const watchedStatus = form.watch("status");

//   const handleFormSubmit = async (data: CourseRoadmapFormValues) => {
//     setLoading(true);
//     // console.log({ data });

//     try {
//       const payload = isEditing ? { id: initialData!.id, ...data } : data;

//       const response = isEditing
//         ? await clientApi.updateCourseRoadmap({
//             body: payload,
//             params: { id: initialData!.id! },
//           })
//         : await clientApi.createCourseRoadmap({
//             body: payload,
//           });
//       await revalidatePage("/course-roadmap");
//       handleSuccess();
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuccess = () => {
//     setOpen(false);
//     form.reset();
//     router.refresh();
//     toast.success(
//       `Course Roadmap ${isEditing ? "updated" : "created"} successfully`
//     );
//   };

//   const handleError = (error: any) => {
//     const errorMessage = error?.message || "An unexpected error occurred";
//     toast.error(errorMessage);
//     console.error("Error:", error);
//   };

//   const handleCancel = () => {
//     setOpen(false);
//     form.reset();
//   };

//   const renderFormField = (
//     name: keyof CourseRoadmapFormValues,
//     label: string,
//     required: boolean = false,
//     component: React.ReactElement
//   ) => (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>
//             {required ? <RequiredFieldStar labelText={label} /> : label}
//           </FormLabel>
//           <FormControl>{React.cloneElement(component, field)}</FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );

//   const renderSelectField = (
//     name: keyof CourseRoadmapFormValues,
//     label: string,
//     placeholder: string,
//     options: Array<{ value: string; label: string }>,
//     required: boolean = false,
//     disabled: boolean = false
//   ) => (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>
//             {required ? <RequiredFieldStar labelText={label} /> : label}
//           </FormLabel>
//           <Select
//             onValueChange={field.onChange}
//             value={field.value} // Changed from defaultValue to value
//             disabled={disabled}
//           >
//             <FormControl>
//               <SelectTrigger>
//                 <SelectValue placeholder={placeholder} />
//               </SelectTrigger>
//             </FormControl>
//             <SelectContent>
//               {options.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:min-w-[800px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? "Edit Course Roadmap" : "Add Course Roadmap"}
//           </DialogTitle>
//           <DialogDescription>
//             {isEditing
//               ? "Update the course roadmap details below"
//               : "Fill in the details below to create a new course roadmap"}
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleFormSubmit)}
//             className="space-y-6 mt-3"
//           >
//             {/* Title Field */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     <RequiredFieldStar labelText="Course Title" />
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="e.g., Advanced React Patterns"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Description Field */}
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     <RequiredFieldStar labelText="Description" />
//                   </FormLabel>
//                   <FormControl>
//                     <Textarea
//                       {...field}
//                       placeholder="Provide a detailed description of the course..."
//                       className="min-h-[100px] resize-none"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Teacher Selection Field */}
//             {/* <FormField
//               control={form.control}
//               name="teacherId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     <RequiredFieldStar labelText="Assign Teacher" />
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value || ""} // Changed from defaultValue to value, handle null
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder={"Select a teacher"} />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {teachers && teachers.length > 0 ? (
//                         teachers.map((option) => (
//                           <SelectItem
//                             key={option.teacherProfile?.id}
//                             value={option.teacherProfile?.id}
//                           >
//                             {option.email}
//                           </SelectItem>
//                         ))
//                       ) : (
//                         <SelectItem value="" disabled>
//                           No teachers available
//                         </SelectItem>
//                       )}
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>
//                     Select the teacher who will be responsible for this course
//                     roadmap
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             /> */}
//             {/* Teacher Selection Field */}
//             <FormField
//               control={form.control}
//               name="teacherId"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>
//                     <RequiredFieldStar labelText="Assign Teacher" />
//                   </FormLabel>
//                   <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           aria-expanded={popoverOpen}
//                           className={cn(
//                             "w-full justify-between",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value
//                             ? teachers?.find(
//                                 (teacher) =>
//                                   teacher.teacherProfile?.id === field.value
//                               )?.name
//                             : "Select a teacher"}
//                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
//                       <Command>
//                         <CommandInput
//                           placeholder="Search teacher..."
//                           className="border-none outline-none focus:ring-0 my-1"
//                         />
//                         <CommandList>
//                           <CommandEmpty>No teacher found.</CommandEmpty>
//                           <CommandGroup>
//                             {teachers && teachers.length > 0 ? (
//                               teachers.map((teacher) => (
//                                 <CommandItem
//                                   value={teacher.email}
//                                   key={teacher.teacherProfile?.id}
//                                   onSelect={() => {
//                                     field.onChange(teacher.teacherProfile?.id);
//                                     setPopoverOpen(false);
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       teacher.teacherProfile?.id === field.value
//                                         ? "opacity-100"
//                                         : "opacity-0"
//                                     )}
//                                   />
//                                   <div>
//                                     <p>{teacher?.name}</p>
//                                     <p className="text-muted-foreground text-xs">
//                                       {teacher.email}
//                                     </p>
//                                   </div>
//                                 </CommandItem>
//                               ))
//                             ) : (
//                               <CommandItem disabled>
//                                 No teachers available
//                               </CommandItem>
//                             )}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>
//                     Select the teacher who will be responsible for this course
//                     roadmap
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Course Link Field */}
//             <FormField
//               control={form.control}
//               name="courseLink"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Course Link</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="https://example.com/course"
//                       type="url"
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Optional: Provide a link to the course material
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Status and Category Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {renderSelectField(
//                 "status",
//                 "Status",
//                 "Select status",
//                 STATUS_OPTIONS,
//                 true
//               )}

//               {renderFormField(
//                 "category",
//                 "Category",
//                 true,
//                 <Input placeholder="e.g., Web Development" />
//               )}
//             </div>

//             {/* Duration and Target Date Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {renderFormField(
//                 "estimatedDuration",
//                 "Estimated Duration",
//                 true,
//                 <Input placeholder="e.g., 6 weeks" />
//               )}

//               <FormField
//                 control={form.control}
//                 name="targetDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Target Release Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full pl-3 text-left font-normal",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             {field.value ? (
//                               format(field.value, "PPP")
//                             ) : (
//                               <span>Pick a date</span>
//                             )}
//                             <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           defaultMonth={field.value || new Date()}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Difficulty and Prerequisites Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {renderSelectField(
//                 "difficulty",
//                 "Difficulty Level",
//                 "Select difficulty",
//                 DIFFICULTY_OPTIONS,
//                 true
//               )}

//               <FormField
//                 control={form.control}
//                 name="prerequisites"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Prerequisites</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="e.g., Basic JavaScript knowledge"
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Leave empty if none required
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <DialogFooter className="gap-2 sm:gap-0">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={!form.formState.isDirty || loading}
//               >
//                 {loading ? (
//                   <Loader className="w-4 h-4 animate-spin mr-2" />
//                 ) : null}
//                 {loading
//                   ? "Saving..."
//                   : isEditing
//                   ? "Save Changes"
//                   : "Create Roadmap"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

//  ========== v2 ===============

// @ts-nocheck
import {
  createCategoryByAdmin,
  createCourseRoadmapByAdmin,
  updateCategoryByAdmin,
  updateCourseRoadmapByAdmin,
} from "@/services/admin";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, ChevronDown, ChevronsUpDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { CourseRoadmapStatus, DifficultyLevel } from "@prisma/client";
import { clientApi } from "@/lib/utils/openai/client";
import {
  courseRoadmapSchema,
  TeacherWithProfileSchema,
} from "@/lib/utils/openai/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { revalidatePage } from "@/actions/revalidatePage";

type CourseRoadmapFormValues = z.infer<typeof courseRoadmapSchema>;

type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;

interface CourseRoadmapDialogProps {
  initialData?: CourseRoadmapFormValues & { id?: string };
  open: boolean;
  setOpen: (open: boolean) => void;
  teachers: TeacherWithProfile[]; // Add teachers prop
}

// Default form values
const getDefaultValues = (
  initialData?: CourseRoadmapFormValues & { id?: string }
): CourseRoadmapFormValues => ({
  title: initialData?.title || "",
  description: initialData?.description || "",
  status: initialData?.status || CourseRoadmapStatus.PLANNED,
  category: initialData?.category || "",
  estimatedDuration: initialData?.estimatedDuration || "",
  targetDate: initialData?.targetDate
    ? new Date(initialData.targetDate)
    : new Date(),
  difficulty: initialData?.difficulty || DifficultyLevel.BEGINNER,
  prerequisites: initialData?.prerequisites || "",
  courseLink: initialData?.courseLink || "",
  teacherId: initialData?.teacherId || null, // Changed from "" to null
});

// Status options for better maintainability
const STATUS_OPTIONS = [
  { value: CourseRoadmapStatus.PLANNED, label: "Planned" },
  { value: CourseRoadmapStatus.IN_PROGRESS, label: "In Progress" },
  { value: CourseRoadmapStatus.COMPLETED, label: "Completed" },
];

// Difficulty options
const DIFFICULTY_OPTIONS = [
  { value: DifficultyLevel.BEGINNER, label: "Beginner" },
  { value: DifficultyLevel.INTERMEDIATE, label: "Intermediate" },
  { value: DifficultyLevel.ADVANCED, label: "Advanced" },
];

export function CourseRoadMapDialog({
  initialData,
  open,
  setOpen,
  teachers,
}: CourseRoadmapDialogProps) {
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const form = useForm<CourseRoadmapFormValues>({
    resolver: zodResolver(courseRoadmapSchema),
    defaultValues: getDefaultValues(initialData),
  });

  // Reset form when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      form.reset(getDefaultValues(initialData));
    }
  }, [initialData, form]);

  const watchedStatus = form.watch("status");

  const handleFormSubmit = async (data: CourseRoadmapFormValues) => {
    setLoading(true);
    // console.log({ data });

    try {
      const payload = isEditing ? { id: initialData!.id, ...data } : data;

      const response = isEditing
        ? await clientApi.updateCourseRoadmap({
            body: payload,
            params: { id: initialData!.id! },
          })
        : await clientApi.createCourseRoadmap({
            body: payload,
          });
      await revalidatePage("/course-roadmap");
      handleSuccess();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    form.reset();
    router.refresh();
    toast.success(
      `Course Roadmap ${isEditing ? "updated" : "created"} successfully`
    );
  };

  const handleError = (error: any) => {
    const errorMessage = error?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    console.error("Error:", error);
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const renderFormField = (
    name: keyof CourseRoadmapFormValues,
    label: string,
    required: boolean = false,
    component: React.ReactElement
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {required ? <RequiredFieldStar labelText={label} /> : label}
          </FormLabel>
          <FormControl>{React.cloneElement(component, field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSelectField = (
    name: keyof CourseRoadmapFormValues,
    label: string,
    placeholder: string,
    options: Array<{ value: string; label: string }>,
    required: boolean = false,
    disabled: boolean = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {required ? <RequiredFieldStar labelText={label} /> : label}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value} // Changed from defaultValue to value
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:min-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Course Roadmap" : "Add Course Roadmap"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the course roadmap details below"
              : "Fill in the details below to create a new course roadmap"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 mt-3"
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Course Title" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Advanced React Patterns"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Description" />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Provide a detailed description of the course..."
                      className="min-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teacher Selection Field - Now Optional */}
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign Teacher</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={popoverOpen}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? teachers?.find(
                                (teacher) =>
                                  teacher.teacherProfile?.id === field.value
                              )?.name
                            : "Select a teacher"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search teacher..."
                          className="border-none outline-none focus:ring-0 my-1"
                        />
                        <CommandList>
                          <CommandEmpty>No teacher found.</CommandEmpty>
                          <CommandGroup>
                            {/* Clear Selection Option */}
                            <CommandItem
                              value="clear-selection"
                              onSelect={() => {
                                field.onChange(null);
                                setPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div>
                                <p className="text-muted-foreground">
                                  No teacher assigned
                                </p>
                              </div>
                            </CommandItem>
                            {teachers && teachers.length > 0 ? (
                              teachers.map((teacher) => (
                                <CommandItem
                                  value={teacher.email}
                                  key={teacher.teacherProfile?.id}
                                  onSelect={() => {
                                    field.onChange(teacher.teacherProfile?.id);
                                    setPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      teacher.teacherProfile?.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p>{teacher?.name}</p>
                                    <p className="text-muted-foreground text-xs">
                                      {teacher.email}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))
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
                  <FormDescription>
                    Optionally select a teacher to be responsible for this
                    course roadmap
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Link Field */}
            <FormField
              control={form.control}
              name="courseLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/course"
                      type="url"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide a link to the course material
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelectField(
                "status",
                "Status",
                "Select status",
                STATUS_OPTIONS,
                true
              )}

              {renderFormField(
                "category",
                "Category",
                true,
                <Input placeholder="e.g., Web Development" />
              )}
            </div>

            {/* Duration and Target Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField(
                "estimatedDuration",
                "Estimated Duration",
                true,
                <Input placeholder="e.g., 6 weeks" />
              )}

              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Release Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={field.value || new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Difficulty and Prerequisites Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelectField(
                "difficulty",
                "Difficulty Level",
                "Select difficulty",
                DIFFICULTY_OPTIONS,
                true
              )}

              <FormField
                control={form.control}
                name="prerequisites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prerequisites</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Basic JavaScript knowledge"
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty if none required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || loading}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Create Roadmap"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
