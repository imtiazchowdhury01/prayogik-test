// @ts-nocheck
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { CalendarIcon, Loader2 } from "lucide-react";
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

const yearOfExperienceValues = [
  "0-1 year",
  "1-2 years",
  "2-4 years",
  "4-6 years",
  "6-10 years",
  "10+ years",
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
  education: z.array(z.string()).min(1, { message: "Education is required" }),
  certifications: z
    .array(z.string().url({ message: "Invalid URL format" }))
    .optional(),
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
    setuserDetails(tempUser);
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
      education: tempUser?.info?.education || [],
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

  const onSubmit = async (data) => {
    try {
      setloading(true);
      // const response = await applyForTeacher(data);
      const response = await fetch("/api/teacher/apply-for-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData?.success) {
        toast.success("Application submitted successfully!");
        router.push("/dashboard");
        setloading(false);
      } else {
        toast.error(responseData?.message);
        setloading(false);
      }
    } catch (error) {
      setloading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mx-auto"
      >
        <Card>
          <CardHeader className="space-y-4">
            <h2 className="text-2xl font-bold">শিক্ষকতার জন্য আবেদন করুন</h2>
            <hr className="border-gray-200 my-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              name="subjectSpecializations"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Specialized Area <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      loading={!isCategories && isCategories.length === 0}
                      options={
                        isCategories?.map((v) => ({
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="expertiseLevel"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <RequiredFieldStar
                    className={"text-sm"}
                    labelText="Expertise Level"
                  />
                  <FormControl>
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
                                <RadioGroupItem value={level} label={level} />
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* yearsOfExperience */}
            <div className="flex gap-4 mt-4">
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFieldStar
                      className={"text-sm"}
                      labelText="Years of Experience"
                    />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearOfExperienceValues?.map((ex) => (
                          <SelectItem value={ex}>{ex}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        {field.name !== "linkedin" &&
                          field.name.charAt(0).toUpperCase() +
                            field.name.slice(1).replace("Url", " URL")}
                        {field.name === "linkedin" && (
                          <RequiredFieldStar
                            className={"text-sm"}
                            labelText="Linkedin"
                          />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`${
                            field.name.charAt(0).toUpperCase() +
                            field.name.slice(1).replace("Url", " URL")
                          } URL`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* certifications */}
            <div className="flex gap-4 mt-4">
              <div className="w-full">
                <FormField
                  name="certifications"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications</FormLabel>
                      <FormControl>
                        <CertificationsInput
                          initialCertifications={field.value || []}
                          onUpdateCertifications={(updatedCertifications) => {
                            field.onChange(updatedCertifications);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* <FormField
                  name="certifications"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Certifications"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            // Update the certifications list by splitting the input value
                            const certifications = value
                              .split(",")
                              .map((item) => item.trim());
                            form.setValue("certifications", certifications); // Update form value dynamically
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Write certifications with "," as separator
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Information */}
        <Card>
          <CardHeader className="space-y-4">
            <h2 className="text-2xl font-bold">আপনার সম্পর্কে</h2>
            <hr className="border-gray-200 my-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              name="bio"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <RequiredFieldStar labelText={"Bio"} className={"text-sm"} />
                  <FormControl>
                    <Textarea {...field} placeholder="Enter your bio" />
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
                  <RequiredFieldStar labelText="Phone Number" />
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
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
                      labelText={"Date of Birth"}
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
                              date > new Date() || date < new Date("1900-01-01")
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
                      labelText={"Gender"}
                      className={"text-sm"}
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHERS">Others</SelectItem>
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
                      labelText={"Nationality"}
                      className={"text-sm"}
                    />
                    <FormControl>
                      <Input {...field} placeholder="Enter nationality" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
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
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter state" />
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
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter country" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="zipCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter zip code" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="education"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <RequiredFieldStar
                    labelText={"Education"}
                    className={"text-sm"}
                  />
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

        <Button disabled={loading} type="submit">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </Form>
  );
}
