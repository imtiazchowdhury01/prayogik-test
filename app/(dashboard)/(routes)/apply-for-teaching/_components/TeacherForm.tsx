// @ts-nocheck
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Award,
  CalendarIcon,
  Globe,
  GraduationCap,
  Loader2,
  User,
} from "lucide-react";
import { format, set } from "date-fns";
import { TeacherExpertiseLevel } from "@prisma/client";
import { applyForTeacher } from "./action";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Loader from "../../teacher/accounts/_components/Loader";
import MultiSelect from "@/components/ui/multi-select";
import CertificationsInput from "./CertificationsInput";
import EducationsInput from "./EducationsInput";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { getUserDetails } from "@/actions/get-user-details";
import Loading from "@/app/(dashboard)/stoploading";
import { Separator } from "@/components/ui/separator";

const yearOfExperienceValues = [
  "০-১ বছর",
  "১-২ বছর",
  "২-৪ বছর",
  "৪-৬ বছর",
  "৬-১০ বছর",
  "১০+ বছর",
];

const formSchema = z.object({
  subjectSpecializations: z
    .array(z.string())
    .min(1, "Subject specializations cannot be empty"),
  expertiseLevel: z.enum(Object.keys(TeacherExpertiseLevel), {
    message: "You need to select skill level.",
  }),
  facebook: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  linkedin: z.string().url({ message: "Invalid linkedin url" }),
  twitter: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  youtube: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  website: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  others: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  bio: z.string().min(50, { message: "Bio is must be at least 50 characters" }),
  phoneNumber: z.string().min(11, { message: "Phone number is required" }),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  gender: z
    .enum(["MALE", "FEMALE", "OTHERS"], {
      message: "Gender is required.",
    })
    .optional(),
  nationality: z.string().min(2, { message: "Nationality is required" }),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  education: z
    .array(
      z.object({
        degree: z.string().optional(),
        major: z.string().optional(),
        passingYear: z.string().optional(),
      })
    )
    .optional(),
  certifications: z.array(z.string()).optional(),
  yearsOfExperience: z.enum(yearOfExperienceValues),
});

export default function RegistrationForm() {
  const { data } = useSession();
  const [loading, setloading] = useState(false);
  const [isCategories, setIsCategories] = useState([]);
  const [user, setuserDetails] = useState(null);

  useEffect(() => {
    if (data?.user?.id) {
      getUser(data?.user?.id);
    }
  }, [data?.user?.id]);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function getUser(id) {
    const tempUser = await getUserDetails(id);
    // console.log("tempUser result:", tempUser);

    setuserDetails(tempUser);

    // Parse existing education data if it exists
    let parsedEducation = [
      {
        degree: "",
        major: "",
        passingYear: "",
      },
    ];

    if (tempUser?.info?.education && tempUser.info.education.length > 0) {
      parsedEducation = tempUser.info.education.map((edu) => {
        // Try to parse the existing education string format "Degree - Major - Year"
        const parts = edu.split(" - ");
        return {
          degree: parts[0] || "",
          major: parts[1] || "",
          passingYear: parts[2] || "",
        };
      });
    }

    form.reset({
      website: tempUser?.info?.website || "",
      facebook: tempUser?.info?.facebook || "",
      linkedin: tempUser?.info?.linkedin || "",
      twitter: tempUser?.info?.twitter || "",
      youtube: tempUser?.info?.youtube || "",
      others: tempUser?.info?.others || "",
      bio: tempUser?.info?.bio || "",
      phoneNumber: tempUser?.info?.phoneNumber || "",
      dateOfBirth: tempUser?.info?.dateOfBirth
        ? new Date(tempUser?.info?.dateOfBirth)
        : null,
      subjectSpecializations: tempUser?.info?.subjectSpecializations || [],
      expertiseLevel:
        tempUser?.info?.expertiseLevel || TeacherExpertiseLevel.ENTRY_LEVEL,
      yearsOfExperience:
        tempUser?.info?.yearsOfExperience || yearOfExperienceValues[0],
      gender: tempUser?.info?.gender || "",
      nationality: tempUser?.info?.nationality || "",
      city: tempUser?.info?.city || "",
      state: tempUser?.info?.state || "",
      country: tempUser?.info?.country || "",
      zipCode: tempUser?.info?.zipCode || "",
      education: parsedEducation,
      certifications: tempUser?.info?.certifications || [],
    });
  }

  useEffect(() => {
    fetch(`/api/courses/categories`)
      .then((res) => res.json())
      .then((data) => {
        setIsCategories(data);
      });
  }, []);

  const router = useRouter();
  // console.log(form.watch("certifications"));

  const onSubmit = async (data) => {
    try {
      setloading(true);
      // Format education data before sending
      const formattedData = {
        ...data,
        education: data.education.map(
          (edu) => `${edu.degree} - ${edu.major} - ${edu.passingYear}`
        ),
      };
      // const response = await applyForTeacher(data);
      const response = await fetch("/api/teacher/apply-for-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();

      if (responseData?.success) {
        toast.success("আবেদন সফলভাবে জমা হয়েছে!");
        router.refresh();
        setloading(false);
      } else {
        toast.error(responseData?.message);
        setloading(false);
      }
    } catch (error) {
      setloading(false);
      toast.error("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        {/* form title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand text-white rounded-full mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            শিক্ষকতার জন্য আবেদন করুন
          </h1>
          <p className="text-gray-600 text-sm">
            আমাদের সাথে যোগ দিন এবং শিক্ষার্থীদের ভবিষ্যৎ গড়তে সাহায্য করুন
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mx-auto "
          >
            {/* Professional Information */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  পেশাগত তথ্য
                </CardTitle>
                <CardDescription>
                  আপনার শিক্ষাগত যোগ্যতা এবং অভিজ্ঞতার বিবরণ দিন
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center gap-4">
                  <div className="w-full">
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
                              loading={
                                !isCategories && isCategories.length === 0
                              }
                              options={
                                isCategories?.map((v) => ({
                                  value: v?.name,
                                  label: v?.name,
                                })) || []
                              }
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              placeholder="বিষয় নির্বাচন করুন"
                              // variant="inverted"
                              animation={0.2}
                              // maxCount={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* yearsOfExperience */}
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredFieldStar
                            className={"text-sm"}
                            labelText="অভিজ্ঞতার বছর"
                          />
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="বছর নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOfExperienceValues?.map((ex, i) => (
                                <SelectItem key={i} value={ex}>
                                  {ex}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* experties level */}
                <FormField
                  name="expertiseLevel"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFieldStar
                        className={"text-sm"}
                        labelText="অভিজ্ঞতার স্তর"
                      />
                      <FormControl>
                        <RadioGroup
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <div className="flex gap-4 items-center">
                            {Object.keys(TeacherExpertiseLevel).map((level) => {
                              const banglaLabels = {
                                ENTRY_LEVEL: "নতুন",
                                MID_LEVEL: "মধ্যম",
                                EXPERT: "বিশেষজ্ঞ",
                              };

                              return (
                                <FormItem
                                  key={level}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={level}
                                      label={banglaLabels[level] || level}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {banglaLabels[level] ||
                                      String(level?.split("_")[0])
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* certifications */}
                <div className="flex gap-4 mt-4 p-4 border rounded-lg bg-gray-50">
                  <div className="w-full">
                    <FormField
                      name="certifications"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
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
                </div>
              </CardContent>
            </Card>

            {/* social information */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  সামাজিক যোগাযোগ
                </CardTitle>
                <CardDescription>
                  আপনার অনলাইন উপস্থিতি এবং পোর্টফোলিও লিংক যোগ করুন
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    "website",
                    "linkedin",
                    "facebook",
                    "youtube",
                    "twitter",
                    "others",
                  ].map((field) => (
                    <FormField
                      key={field}
                      name={field}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {field.name === "website" && "ওয়েবসাইট"}
                            {field.name === "linkedin" && (
                              <RequiredFieldStar
                                className={"text-sm"}
                                labelText="লিংকডইন"
                              />
                            )}
                            {field.name === "facebook" && "ফেসবুক"}
                            {field.name === "youtube" && "ইউটিউব"}
                            {field.name === "twitter" && "টুইটার"}
                            {field.name === "others" && "অন্যান্য"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={
                                field.name === "website"
                                  ? "https://yourwebsite.com"
                                  : field.name === "linkedin"
                                  ? "লিংকডইন প্রোফাইল URL"
                                  : field.name === "facebook"
                                  ? "ফেসবুক প্রোফাইল URL"
                                  : field.name === "youtube"
                                  ? "ইউটিউব চ্যানেল URL"
                                  : field.name === "twitter"
                                  ? "টুইটার প্রোফাইল URL"
                                  : "অন্য কোনো প্রাসঙ্গিক লিংক"
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* General Information */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  আপনার সম্পর্কে
                </CardTitle>
                <CardDescription>
                  ব্যক্তিগত তথ্য এবং যোগাযোগের বিবরণ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  name="bio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFieldStar
                        labelText={"জীবনী"}
                        className={"text-sm"}
                      />
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="আপনার শিক্ষাগত পটভূমি, অভিজ্ঞতা এবং শিক্ষাদানের প্রতি আগ্রহের কথা লিখুন..."
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFieldStar labelText="ফোন নম্বর" />
                      <FormControl>
                        <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FormField
                    name="dateOfBirth"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar
                          className={"text-sm"}
                          labelText={"জন্ম তারিখ"}
                        />
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full text-left border"
                              >
                                {field.value
                                  ? format(field.value, "PPP")
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
                                defaultMonth={field.value}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="gender"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar
                          labelText={"লিঙ্গ"}
                          className={"text-sm"}
                        />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">পুরুষ</SelectItem>
                            <SelectItem value="FEMALE">মহিলা</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="nationality"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <RequiredFieldStar
                          labelText={"জাতীয়তা"}
                          className={"text-sm"}
                        />
                        <FormControl>
                          <Input {...field} placeholder="বাংলাদেশী" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <br />
                <Separator />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>শহর</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="শহরের নাম" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>রাজ্য/বিভাগ</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="বিভাগের নাম" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>দেশ</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="বাংলাদেশ" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="zipCode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পোস্ট কোড</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="১২০০" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <br />

                <FormField
                  name="education"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
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
              </CardContent>
            </Card>
            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                disabled={loading}
                type="submit"
                size="lg"
                className="px-12 py-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    জমা দেওয়া হচ্ছে...
                  </>
                ) : (
                  "আবেদন জমা দিন"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
