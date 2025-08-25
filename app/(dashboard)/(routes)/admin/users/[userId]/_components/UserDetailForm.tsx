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
  education: z
    .array(
      z.object({
        degree: z.string().optional(),
        major: z.string().optional(),
        passingYear: z.string().optional(),
      })
    )
    .optional(),
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
  // Parse existing education data if it exists
  let parsedEducation = [
    {
      degree: "",
      major: "",
      passingYear: "",
    },
  ];

  if (initialData?.education && initialData?.education.length > 0) {
    parsedEducation = initialData?.education.map((edu) => {
      // Try to parse the existing education string format "Degree - Major - Year"
      const parts = edu.split(" - ");
      return {
        degree: parts[0] || "",
        major: parts[1] || "",
        passingYear: parts[2] || "",
      };
    });
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      bio: initialData.bio || "",
      role: initialData.role || Role.STUDENT,
      accountStatus: initialData?.accountStatus || UserAccountStatus.ACTIVE,
      yearsOfExperience: initialData?.teacherProfile?.yearsOfExperience || "",
      education: parsedEducation || [],
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
      // Format education data before sending
      const formattedData = {
        ...data,
        education: data.education.map(
          (edu) => `${edu.degree} - ${edu.major} - ${edu.passingYear}`
        ),
      };
      // console.log("formattedData result:", formattedData);
      // --------------------------------------------------------
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
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
                  ব্যক্তিগত
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-2">
                    <DBUserAvatar user={initialData} />
                    {/* Username */}
                    <div className="inline-flex text-sm text-slate-500 text-left mt-2 bg-gray-50 border px-2 py-1 rounded-lg">
                      ইউজার নাম: {initialData?.username}
                    </div>
                  </div>

                  {/* Name */}
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar labelText={"নাম"} />
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <RequiredFieldStar labelText={"ইমেল"} />
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
                        <FormLabel>জন্ম তারিখ</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full text-left border"
                              >
                                {field.value
                                  ? format(field?.value, "PPP")
                                  : "তারিখ নির্বাচন করুন"}
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
                        <FormLabel>লিঙ্গ</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            defaultValue=""
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">পুরুষ</SelectItem>
                              <SelectItem value="FEMALE">মহিলা</SelectItem>
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
                        <FormLabel></FormLabel>
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
                        <FormLabel>জীবনী</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="আপনার সম্পর্কে সংক্ষেপে কিছু বলুন"
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
                  যোগাযোগ
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Phone Number */}
                  <FormField
                    name="+8801"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ফোন নম্বর</FormLabel>
                        <FormControl>
                          <Input placeholder="+880 1XXX-XXXXXX" {...field} />
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
                        <FormLabel>শহর</FormLabel>
                        <FormControl>
                          <Input placeholder="শহরের নাম" {...field} />
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
                        <FormLabel>বিভাগ</FormLabel>
                        <FormControl>
                          <Input placeholder="বিভাগের নাম" {...field} />
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
                        <FormLabel>দেশ</FormLabel>
                        <FormControl>
                          <Input placeholder="বাংলাদেশ" {...field} />
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
                        <FormLabel>পোস্ট কোড</FormLabel>
                        <FormControl>
                          <Input placeholder="1200" {...field} />
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
                        <FormLabel>জাতীয়তা</FormLabel>
                        <FormControl>
                          <Input placeholder="বাংলাদেশি" {...field} />
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
                  সামাজিক যোগাযোগ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Facebook */}
                  <FormField
                    name="facebook"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ফেসবুক</FormLabel>
                        <FormControl>
                          <Input placeholder="ফেসবুক প্রোফাইল URL" {...field} />
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
                        <FormLabel>লিঙ্কডইন</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LinkedIn প্রোফাইল URL"
                            {...field}
                          />
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
                        <FormLabel>টুইটার</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Twitter প্রোফাইল URL"
                            {...field}
                          />
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
                        <FormLabel>ইউটিউব</FormLabel>
                        <FormControl>
                          <Input placeholder="চ্যানেল লিঙ্ক" {...field} />
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
                        <FormLabel>ওয়েবসাইট</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourwebsite.com"
                            {...field}
                          />
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
                        <FormLabel>অন্যান্য</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="অন্য কোনো প্রাসঙ্গিক লিংক"
                            {...field}
                          />
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
                    শিক্ষক প্রোফাইল
                  </h4>
                  <div className="grid grid-cols-1 gap-8">
                    {/* Subject Specializations */}
                    <FormField
                      name="subjectSpecializations"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            বিশেষায়িত ক্ষেত্র{" "}
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
                          <RequiredFieldStar labelText="অভিজ্ঞতার বছর" />
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
                                  ০-১ বছর
                                </SelectItem>
                                <SelectItem value="1-2 years">
                                  ১-২ বছর
                                </SelectItem>
                                <SelectItem value="2-4 years">
                                  ২-৪ বছর
                                </SelectItem>
                                <SelectItem value="4-6 years">
                                  ৪-৬ বছর
                                </SelectItem>
                                <SelectItem value="6-10 years">
                                  ৬-১০ বছর
                                </SelectItem>
                                <SelectItem value="10+ years">
                                  ১০+ বছর
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
                          <FormLabel>সার্টিফিকেশন</FormLabel>
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
                  অ্যাকাউন্ট
                </h4>
                <div className="grid grid-cols-1 gap-8">
                  {/* Role */}
                  <FormField
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar labelText="পদবী" />
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
                        <FormLabel>একাউন্ট স্ট্যাটাস</FormLabel>
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
                        <FormLabel>শিক্ষকতার জন্য আবেদনের অগ্রগতি</FormLabel>
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
                            <FormLabel htmlFor="isAdmin">
                              অ্যাডমিন হিসেবে নিযুক্ত
                            </FormLabel>
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
                              সুপার অ্যাডমিন হিসেবে নিযুক্ত
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
