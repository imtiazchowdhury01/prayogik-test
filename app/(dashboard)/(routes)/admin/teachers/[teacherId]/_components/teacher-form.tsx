// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader, CalendarIcon } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils/stringUtils";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EducationsInput from "@/app/(dashboard)/(routes)/apply-for-teaching/_components/EducationsInput";
import { z } from "zod";
import { TeacherExpertiseLevel } from "@prisma/client";
import MultiSelect from "@/components/ui/multi-select";
import { updateTeacher } from "@/services/teacher";
import { updateTeacherByAdmin } from "@/services/admin";
import moment from "moment";
import DBUserAvatar from "@/components/user-avatar";
import { revalidatePage } from "@/actions/revalidatePage";

export default function TeacherForm({
  teacherId,
  initialData,
  ranks,
  categories,
}: any) {
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    bio: z.string(),
    yearsOfExperience: z.string(),
    education: z.array(z.string()),
    subjectSpecializations: z.array(z.string()),
    expertiseLevel: z.enum([
      TeacherExpertiseLevel.ENTRY_LEVEL,
      TeacherExpertiseLevel.EXPERT,
      TeacherExpertiseLevel.MID_LEVEL,
    ]),
    dateOfBirth: z.date(),
    gender: z.string(),
    phoneNumber: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
    teacherRankId: z.string(),
    isAdmin: z.boolean(),
    isSuperAdmin: z.boolean(),
    teacherStatus: z.string(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData.email || "",
      name: initialData.name || "",
      bio: initialData.bio || "",
      yearsOfExperience: initialData?.teacherProfile?.yearsOfExperience || "",
      subjectSpecializations:
        initialData?.teacherProfile?.subjectSpecializations || [],
      expertiseLevel:
        initialData?.teacherProfile?.expertiseLevel ||
        TeacherExpertiseLevel.ENTRY_LEVEL,
      education: initialData.education || [],
      dateOfBirth: new Date(initialData?.dateOfBirth),
      gender: initialData?.gender || "",
      phoneNumber: initialData.phoneNumber || "",
      city: initialData.city || "",
      state: initialData.state || "",
      country: initialData.country || "",
      zipCode: initialData.zipCode || "",
      teacherRankId: initialData?.teacherProfile?.teacherRankId || "",
      isAdmin: initialData.isAdmin || false,
      isSuperAdmin: initialData.isSuperAdmin || false,
      teacherStatus: initialData?.teacherProfile?.teacherStatus || "NONE",
    },
  });

  // useEffect(() => {
  //   form.reset({
  //     email: initialData.email || "",
  //     name: initialData.name || "",
  //     bio: initialData.bio || "",
  //     yearsOfExperience: initialData?.teacherProfile?.yearsOfExperience || "",
  //     subjectSpecializations:
  //       initialData?.teacherProfile?.subjectSpecializations || [],
  //     expertiseLevel:
  //       initialData?.teacherProfile?.expertiseLevel ||
  //       TeacherExpertiseLevel.ENTRY_LEVEL,
  //     education: initialData.education || [],
  //     dateOfBirth: new Date(initialData?.dateOfBirth),
  //     gender: initialData?.gender || "",
  //     phoneNumber: initialData.phoneNumber || "",
  //     city: initialData.city || "",
  //     state: initialData.state || "",
  //     country: initialData.country || "",
  //     zipCode: initialData.zipCode || "",
  //     teacherRankId: initialData?.teacherProfile?.teacherRankId || "",
  //     isAdmin: initialData.isAdmin || false,
  //     isSuperAdmin: initialData.isSuperAdmin || false,
  //     teacherStatus: initialData?.teacherProfile?.teacherStatus || "NONE",
  //   });
  // }, [initialData, form]);

  const {
    formState: { isDirty },
  } = form;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const result = await updateTeacherByAdmin(teacherId, data);

      toast.success("Changes saved successfully");
      form.reset(data);
      await revalidatePage([
        {
          route: "/",
          type: "layout",
        },
        {
          route: "/teachers",
          type: "page",
        },
      ]);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <DBUserAvatar user={initialData} />
          {Object.keys(formSchema.shape).map((field) => {
            if (field === "enrolledCourseIds") return null;

            return (
              <FormField
                key={field}
                name={field}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name === "teacherRankId"
                        ? capitalizeFirstLetter(field.name).replace(/Id/g, " ")
                        : capitalizeFirstLetter(field.name).replace(
                            /Ids/g,
                            " "
                          )}

                      {/* Check for required fields */}
                      {(formSchema.shape[field.name]._def.typeName ===
                        "ZodString" &&
                        formSchema.shape[field.name]._def.checks?.some(
                          (check) => check.kind === "min" && check.value === 1
                        )) ||
                      (formSchema.shape[field.name]._def.typeName ===
                        "ZodArray" &&
                        formSchema.shape[field.name]._def.checks?.some(
                          (check) => check.kind === "min" && check.value === 1 // Check for min(1) for array
                        )) ||
                      (formSchema.shape[field.name]._def.typeName ===
                        "ZodDate" &&
                        formSchema.shape[field.name]._def.checks?.some(
                          (check) => check.kind === "required" // Check for required date
                        )) ||
                      (formSchema.shape[field.name]._def.typeName ===
                        "ZodEnum" &&
                        formSchema.shape[field.name]._def.checks?.some(
                          (check) => check.kind === "required" // Check for required enum
                        )) ? (
                        <span className="text-red-500"> *</span>
                      ) : null}
                    </FormLabel>

                    <FormControl>
                      {field.name === "teacherRankId" ? (
                        <Select
                          placeholder={`Select teacher rank`}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            {ranks.map((rank) => (
                              <SelectItem key={rank.id} value={rank.id}>
                                {rank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.name === "email" ? (
                        <Input {...field} disabled />
                      ) : field.name === "expertiseLevel" ? (
                        <RadioGroup
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <div className="flex gap-4 items-center">
                            {Object.keys(TeacherExpertiseLevel).map((level) => {
                              return (
                                <FormItem
                                  key={level}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={level}
                                      label={level}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm capitalize">
                                    {String(level?.split("_")[0])
                                      .charAt(0)
                                      .toUpperCase() +
                                      String(level?.split("_")[0])
                                        .slice(1)
                                        .toLowerCase()}
                                  </FormLabel>
                                </FormItem>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      ) : field.name === "subjectSpecializations" ? (
                        <MultiSelect
                          options={
                            categories?.map((v) => ({
                              value: v?.name,
                              label: v?.name,
                            })) || []
                          }
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select skills"
                          // variant="inverted"
                          animation={0.2}
                          // maxCount={3}
                        />
                      ) : field.name === "education" ? (
                        <EducationsInput
                          initialEducations={field.value || []}
                          onUpdateEducations={(updatedEducations) => {
                            field.onChange(updatedEducations);
                          }}
                        />
                      ) : field.name === "bio" ? (
                        <Textarea placeholder="Enter bio..." {...field} />
                      ) : field.name === "dateOfBirth" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left border"
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ?? null}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown-buttons"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              defaultMonth={field.value || new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : field.name === "gender" ? (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : ["isAdmin", "isSuperAdmin"].includes(field.name) ? (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={
                              field.name === "isAdmin"
                                ? "isAdmin"
                                : "isSuperAdmin"
                            }
                            checked={field.value}
                            onCheckedChange={(e) => field.onChange(e)}
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                          <FormLabel
                            htmlFor={
                              field.name === "isAdmin"
                                ? "isAdmin"
                                : "isSuperAdmin"
                            }
                          >
                            {field.name === "isAdmin"
                              ? "User is Admin"
                              : "User is Super Admin"}
                          </FormLabel>
                        </div>
                      ) : field.name === "teacherStatus" ? (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">None</SelectItem>
                            <SelectItem value="VERIFIED">Verified</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : field.name === "yearsOfExperience" ? (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1 year">0-1 year</SelectItem>
                            <SelectItem value="1-2 years">1-2 years</SelectItem>
                            <SelectItem value="2-4 years">2-4 years</SelectItem>
                            <SelectItem value="4-6 years">4-6 years</SelectItem>
                            <SelectItem value="6-10 years">
                              6-10 years
                            </SelectItem>
                            <SelectItem value="10+ years">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input placeholder={`Enter ${field.name}`} {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          {/* Submit */}
          <Button
            disabled={!isDirty || isSubmitting}
            type="submit"
            className="disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>{" "}
          {isDirty && (
            <Button
              type="button"
              variant={"outline"}
              disabled={!isDirty || isSubmitting}
              onClick={() => {
                form.reset(teacher);
              }}
            >
              Cancel
            </Button>
          )}
        </form>
      </Form>

      <Dialog
        open={dialogVisible}
        onOpenChange={(open) => {
          setDialogVisible(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher's Data Updated Successfully</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            The teacher information has been updated successfully.
          </DialogDescription>
          <Button
            onClick={() => {
              router.push("/admin/teachers");
              setDialogVisible(false);
            }}
            className="mx-auto block"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
