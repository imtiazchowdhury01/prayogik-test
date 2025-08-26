// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronsUpDown, Loader } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { capitalizeFirstLetter } from "@/lib/utils/stringUtils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MultiSelect from "@/components/ui/multi-select";
import DualListBox from "@/components/ui/dual-listbox";
import { Role, TeacherExpertiseLevel, UserAccountStatus } from "@prisma/client";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import EducationsInput from "@/app/(dashboard)/(routes)/apply-for-teaching/_components/EducationsInput";
import CertificationsInput from "@/app/(dashboard)/(routes)/apply-for-teaching/_components/CertificationsInput";
import UserAvatar from "@/app/(dashboard)/(routes)/profile/_components/avatar";
import DBUserAvatar from "@/components/user-avatar";
import { revalidatePage } from "@/actions/revalidatePage";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  bio: z.string(),
  yearsOfExperience: z.string().optional(),
  education: z.array(z.string()),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
  nationality: z.string(),
  facebook: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  youtube: z.string(),
  website: z.string(),
  others: z.string(),
  subjectSpecializations: z.array(z.string()),
  expertiseLevel: z.enum(Object.keys(TeacherExpertiseLevel)).optional(),
  certifications: z.array(z.string()),
  teacherRankId: z.string().optional(),
  role: z.enum(Object.values(Role)),
  accountStatus: z.enum(Object.values(UserAccountStatus)),
  isAdmin: z.boolean(),
  isSuperAdmin: z.boolean(),
  teacherStatus: z.string(),
  enrolledCourseIds: z.array(z.string()),
  subscriptionListIds: z.array(z.string()).optional(),
});

const UserDetailForm = ({
  initialData,
  categories,
  courses,
  ranks,
  userId,
  subscriptionList,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      bio: initialData.bio || "",
      role: initialData.role || Role.STUDENT,
      accountStatus: initialData?.accountStatus || UserAccountStatus.ACTIVE,
      yearsOfExperience: initialData?.teacherProfile?.yearsOfExperience || "",
      education: initialData?.education || [],
      dateOfBirth: initialData?.dateOfBirth
        ? new Date(initialData.dateOfBirth)
        : undefined,
      gender: initialData?.gender || "",
      phoneNumber: initialData?.phoneNumber || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "",
      zipCode: initialData?.zipCode || "",
      nationality: initialData?.nationality || "",
      facebook: initialData?.facebook || "",
      linkedin: initialData?.linkedin || "",
      twitter: initialData?.twitter || "",
      youtube: initialData?.youtube || "",
      website: initialData?.website || "",
      others: initialData?.others || "",
      subjectSpecializations:
        initialData?.teacherProfile?.subjectSpecializations || [],
      expertiseLevel:
        initialData?.teacherProfile?.expertiseLevel ||
        TeacherExpertiseLevel.ENTRY_LEVEL,
      teacherRankId: initialData?.teacherProfile?.teacherRankId || "",
      certifications: initialData?.teacherProfile?.certifications || [],
      isAdmin: !!initialData?.isAdmin,
      isSuperAdmin: !!initialData?.isSuperAdmin,
      teacherStatus: initialData?.teacherProfile?.teacherStatus || "NONE",
      enrolledCourseIds:
        initialData?.studentProfile?.enrolledCourseIds?.map(
          (ecourse) => ecourse.courseId
        ) || [],
      subscriptionListIds: initialData?.subscriptionList || [],
    },
  });

  // useEffect(() => {
  //   if (initialData) {
  //     // Prepare data carefully to avoid undefined values
  //     const formData = {
  //       name: initialData.name || "",
  //       email: initialData.email || "",
  //       bio: initialData.bio || "",
  //       role: initialData.role || Role.STUDENT,
  //       accountStatus: initialData?.accountStatus || UserAccountStatus.ACTIVE,
  //       yearsOfExperience: initialData?.teacherProfile?.yearsOfExperience || "",
  //       education: initialData?.education || [],
  //       dateOfBirth: initialData?.dateOfBirth
  //         ? new Date(initialData.dateOfBirth)
  //         : undefined,
  //       gender: initialData?.gender || "",
  //       phoneNumber: initialData?.phoneNumber || "",
  //       city: initialData?.city || "",
  //       state: initialData?.state || "",
  //       country: initialData?.country || "",
  //       zipCode: initialData?.zipCode || "",
  //       nationality: initialData?.nationality || "",
  //       facebook: initialData?.facebook || "",
  //       linkedin: initialData?.linkedin || "",
  //       twitter: initialData?.twitter || "",
  //       youtube: initialData?.youtube || "",
  //       website: initialData?.website || "",
  //       others: initialData?.others || "",
  //       subjectSpecializations:
  //         initialData?.teacherProfile?.subjectSpecializations || [],
  //       expertiseLevel:
  //         initialData?.teacherProfile?.expertiseLevel ||
  //         TeacherExpertiseLevel.ENTRY_LEVEL,
  //       teacherRankId: initialData?.teacherProfile?.teacherRankId || "",
  //       certifications: initialData?.teacherProfile?.certifications || [],
  //       isAdmin: !!initialData?.isAdmin,
  //       isSuperAdmin: !!initialData?.isSuperAdmin,
  //       teacherStatus: initialData?.teacherProfile?.teacherStatus || "NONE",
  //       enrolledCourseIds:
  //         initialData?.studentProfile?.enrolledCourseIds?.map(
  //           (ecourse) => ecourse.courseId
  //         ) || [],
  //     };

  //     // Reset form with the prepared data
  //     form.reset(formData);
  //     router.refresh();
  //   }
  // }, [JSON.stringify(initialData), form]);
  // console.log(initialData);

  const {
    formState: { isDirty },
  } = form;

  // Add this helper function to detect course enrollment changes
  const getNewlyEnrolledCourses = (currentCourseIds, previousCourseIds) => {
    return currentCourseIds.filter(
      (courseId) => !previousCourseIds.includes(courseId)
    );
  };

  // Add this helper function to send enrollment email
  const sendEnrollmentEmail = async (userId, newCourseIds) => {
    try {
      const response = await fetch(
        `/api/admin/users/${userId}/send-enrollment-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enrolledCourseIds: newCourseIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send enrollment email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending enrollment email:", error);
      throw error;
    }
  };

  //  submit function
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Get current enrolled course IDs from form initial data
      const previousEnrolledCourseIds =
        initialData?.studentProfile?.enrolledCourseIds?.map(
          (ecourse) => ecourse.courseId
        ) || [];
      // Get new enrolled course IDs from form data
      const currentEnrolledCourseIds = data.enrolledCourseIds || [];
      // Find newly enrolled courses
      const newlyEnrolledCourseIds = getNewlyEnrolledCourses(
        currentEnrolledCourseIds,
        previousEnrolledCourseIds
      );

      // --------------------------------------------------------
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      await response.json();
      // --------------------------------------------------------
      // Send enrollment email if there are new courses
      if (newlyEnrolledCourseIds.length > 0) {
        try {
          await sendEnrollmentEmail(userId, newlyEnrolledCourseIds);
          // toast.success("Changes saved and enrollment email sent successfully");
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          toast.success(
            "Changes saved successfully, but enrollment email failed to send"
          );
        }
      }
      // ------------------------------------------------------
      form.reset(data);
      toast.success("Changes saved successfully");
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
      router.refresh(); // Refresh the page to update server-side data
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Enhance error logging for debugging
  const onError = (err) => {
    console.error("Form Validation Errors:", {
      errors: err,
      formValues: form.getValues(),
    });
    toast.error("Form validation failed. Please check fields.");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="user-details"
        >
          <AccordionItem value="user-details">
            <AccordionTrigger className="font-bold text-lg hover:no-underline">
              <div className="flex gap-2 items-center">
                <ChevronsUpDown className="w-4 h-4" />
                <span>General Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="">
              <RequiredFieldText className={"mb-0"} />

              {/* First Group */}
              <Card className="p-8">
                <h4 className="text-base text-black/50 font-bold mb-8">
                  Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-2">
                    <DBUserAvatar user={initialData} />
                    {/* Username */}
                    <div className="inline-flex text-sm text-slate-500 text-left mt-2 bg-gray-50 border px-2 py-1 rounded-lg">
                      Username: {initialData?.username}
                    </div>
                  </div>

                  {/* Name */}
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar labelText={"Name"} />
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar labelText={"Email"} />
                        <FormControl>
                          <Input
                            placeholder="Enter email"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth */}
                  <FormField
                    name="dateOfBirth"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full text-left border"
                              >
                                {field.value
                                  ? format(field?.value, "PPP")
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    name="gender"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            defaultValue=""
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Education */}
                  <FormField
                    name="education"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <EducationsInput
                            initialEducations={field.value || []}
                            onUpdateEducations={(updatedEducations) => {
                              field.onChange(updatedEducations);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bio */}
                  <FormField
                    name="bio"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter bio..."
                            rows={"8"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Second Group */}
              <Card className="p-8 mt-6">
                <h4 className="text-base text-black/50 font-bold mb-8">
                  Contact
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Phone Number */}
                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Country */}
                  <FormField
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Zip Code */}
                  <FormField
                    name="zipCode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter zip code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nationality */}
                  <FormField
                    name="nationality"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter nationality" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Third Group */}
              <Card className="mt-6 p-8">
                <h4 className="text-base text-black/50 font-bold mb-8">
                  Social
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Facebook */}
                  <FormField
                    name="facebook"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Facebook URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn */}
                  <FormField
                    name="linkedin"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter LinkedIn URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Twitter */}
                  <FormField
                    name="twitter"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Twitter URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* YouTube */}
                  <FormField
                    name="youtube"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter YouTube URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website */}
                  <FormField
                    name="website"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Website URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Others */}
                  <FormField
                    name="others"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Others</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter other links" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Fourth Group */}
              {initialData?.teacherStatus?.toLowerCase() === "verified" && (
                <Card className="mt-6 p-8">
                  <h4 className="text-base text-black/50 font-bold mb-8">
                    Teaching Profile
                  </h4>
                  <div className="grid grid-cols-1 gap-8">
                    {/* Subject Specializations */}
                    <FormField
                      name="subjectSpecializations"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Specialized Area{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <MultiSelect
                              loading={!categories || categories.length === 0}
                              options={
                                categories?.map((v) => ({
                                  value: v?.name,
                                  label: v?.name,
                                })) || []
                              }
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              placeholder="Select skills"
                              animation={0.2}
                              maxCount={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Years of Experience */}
                    <FormField
                      name="yearsOfExperience"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <RequiredFieldStar labelText="Years of Experience" />
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select years of experience" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0-1 year">
                                  0-1 year
                                </SelectItem>
                                <SelectItem value="1-2 years">
                                  1-2 years
                                </SelectItem>
                                <SelectItem value="2-4 years">
                                  2-4 years
                                </SelectItem>
                                <SelectItem value="4-6 years">
                                  4-6 years
                                </SelectItem>
                                <SelectItem value="6-10 years">
                                  6-10 years
                                </SelectItem>
                                <SelectItem value="10+ years">
                                  10+ years
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Certifications */}
                    <FormField
                      name="certifications"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certifications</FormLabel>
                          <FormControl>
                            <CertificationsInput
                              initialCertifications={field.value || []}
                              onUpdateCertifications={(
                                updatedCertifications
                              ) => {
                                field.onChange(updatedCertifications);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              )}

              {/* Fifth Group */}
              <Card className="p-8 mt-6">
                <h4 className="text-base text-black/50 font-bold mb-8">
                  Account
                </h4>
                <div className="grid grid-cols-1 gap-8">
                  {/* Role */}
                  <FormField
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar labelText="Role" />
                        <FormControl>
                          <Select
                            placeholder="Select Role"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(Role).map((role) => (
                                <SelectItem key={role} value={Role[role]}>
                                  {capitalizeFirstLetter(role)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Account Status */}
                  <FormField
                    name="accountStatus"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <FormControl>
                          <Select
                            placeholder="Select Account Status"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Account Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(UserAccountStatus).map((status) => (
                                <SelectItem
                                  key={status}
                                  value={UserAccountStatus[status]}
                                >
                                  {capitalizeFirstLetter(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teacher Status */}
                  <FormField
                    name="teacherStatus"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">NONE</SelectItem>
                              <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                              <SelectItem value="PENDING">PENDING</SelectItem>
                              <SelectItem value="REJECTED">REJECTED</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Is Admin */}
                  <FormField
                    name="isAdmin"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isAdmin"
                              checked={field.value}
                              onCheckedChange={(e) => field.onChange(e)}
                              className="h-4 w-4 border-gray-300 rounded"
                            />
                            <FormLabel htmlFor="isAdmin">Is Admin</FormLabel>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Is Super Admin */}
                  <FormField
                    name="isSuperAdmin"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isSuperAdmin"
                              checked={field.value}
                              onCheckedChange={(e) => field.onChange(e)}
                              className="h-4 w-4 border-gray-300 rounded"
                            />
                            <FormLabel htmlFor="isSuperAdmin">
                              Is Super Admin
                            </FormLabel>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* enroll course */}
          <AccordionItem value="enrolled-courses">
            <AccordionTrigger className="font-bold text-lg hover:no-underline">
              <div className="flex gap-2 items-center text-lg">
                <ChevronsUpDown className="w-4 h-4" />
                <span>Enrolled Courses</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-4 p-4">
              <FormField
                name="enrolledCourseIds"
                control={form.control}
                render={({ field }) => (
                  <DualListBox
                    {...field}
                    options={
                      courses?.map((v) => ({
                        value: v?.id,
                        label: v?.title,
                      })) || []
                    }
                    field={field}
                  />
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Give subscription access */}
          <AccordionItem value="subscription-access">
            <AccordionTrigger className="font-bold text-lg hover:no-underline">
              <div className="flex gap-2 items-center text-lg">
                <ChevronsUpDown className="w-4 h-4" />
                <span>Subscription Access</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-4 p-4">
              <FormField
                name="subscriptionListIds"
                control={form.control}
                render={({ field }) => (
                  <DualListBox
                    {...field}
                    mode="single"
                    options={
                      subscriptionList?.map((v) => ({
                        value: v?.id,
                        label: v?.name,
                      })) || []
                    }
                    field={field}
                  />
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
            <>Save</>
          )}
        </Button>{" "}
        {isDirty && (
          <Button
            type="button"
            variant={"outline"}
            disabled={!isDirty || isSubmitting}
            onClick={() => {
              form.reset(initialData);
            }}
          >
            Cancel
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UserDetailForm;
