// @ts-nocheck
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { contactFormSchema } from "@/app/(site)/contact/_schema/contactFormSchema";
import LoadingSpinner from "@/components/LoadingSpinner";
import Script from "next/script";
import { GraduationCap, Plus, Shield, Trash2 } from "lucide-react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import MultiSelect from "@/components/ui/multi-select";
import { clientApi } from "@/lib/utils/openai/client";
import { Separator } from "@/components/ui/separator";

const bangladeshPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
// Course proposal schema
const courseProposalSchema = z.object({
  // category: z.array(z.string()).min(1, "ক্যাটেগরি নির্বাচন করুন"), // Specify it's an array of strings
  category: z.string().min(1, "ক্যাটেগরি নির্বাচন করুন"),
  courseTitle: z.string().min(1, "কোর্স টাইটেল লিখুন"),
  courseDetails: z.string().min(1, "কোর্স বিস্তারিত লিখুন"),
});

// Update the contact form schema to include the recaptcha token and teaching fields
const createExtendedContactFormSchema = (formType: "contact" | "teaching") => {
  const baseSchema = {
    name: z
      .string()
      .trim()
      .min(3, { message: "নাম অন্তত ৩ অক্ষরের হতে হবে।" })
      .max(50, { message: "নাম সর্বোচ্চ ৫০ অক্ষরের হতে পারবে।" }),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "সঠিক ইমেইল লিখুন।" })
      .max(100, { message: "ইমেইল সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।" }),
    recaptchaToken: z.string().min(1, "রিক্যাপচা যাচাই করুন"),

    phone: z
      .string()
      .min(11, "ফোন নম্বর অবশ্যই পূর্ণ হতে হবে")
      .regex(bangladeshPhoneRegex, "সঠিক বাংলাদেশের ফোন নম্বর দিন"),

    facebookUrl: z
      .string()
      .url("সঠিক ফেসবুক URL দিন")
      .optional()
      .or(z.literal("")),
    linkedinUrl: z
      .string()
      .url("সঠিক লিংকডইন URL দিন")
      .min(1, "লিংকডইন URL আবশ্যক"),
    youtubeUrl: z
      .string()
      .url("সঠিক ইউটিউব URL দিন")
      .optional()
      .or(z.literal("")),
    websiteUrl: z
      .string()
      .url("সঠিক ওয়েবসাইট URL দিন")
      .optional()
      .or(z.literal("")),
    courseProposals: z.array(courseProposalSchema).optional(),
  };

  if (formType === "contact") {
    return z.object({
      ...baseSchema,
      linkedinUrl: z.string().optional(),
      phone: z.string().optional(),
      subject: z
        .string()
        .trim()
        .min(2, { message: "বিষয় অন্তত ২ অক্ষরের হতে হবে।" })
        .max(100, { message: "বিষয় সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।" }),
      message: z
        .string()
        .trim()
        .min(2, { message: "অন্তত ২ অক্ষরের হতে হবে।" })
        .max(500, { message: "সর্বোচ্চ ৫০০ অক্ষরের হতে পারবে।" }),
    });
  } else {
    return z.object({
      ...baseSchema,
      subject: z.string().optional().or(z.literal("")),
      message: z.string().optional().or(z.literal("")),
    });
  }
};
// Declare global type for reCAPTCHA
declare global {
  interface Window {
    handleRecaptchaChange: (token: string) => void;
    grecaptcha: {
      reset: () => void;
    };
  }
}

interface ContactFormClientProps {
  formType: "contact" | "teaching";
  categories?: any;
}

export default function ContactFormClient({
  formType,
}: // categories,
ContactFormClientProps) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await clientApi.getCategories();
        const data = res.body;
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = React.useState<boolean>(false);

  // Use the conditional schema
  const extendedContactFormSchema = React.useMemo(
    () => createExtendedContactFormSchema(formType),
    [formType]
  );

  const form = useForm<z.infer<typeof extendedContactFormSchema>>({
    resolver: zodResolver(extendedContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      recaptchaToken: "",
      phone: "",
      facebookUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      websiteUrl: "",
      courseProposals:
        formType === "teaching"
          ? [{ category: "", courseTitle: "", courseDetails: "" }] // Changed from [] to ""
          : [],
    },
    //   courseProposals:
    //     formType === "teaching"
    //       ? [{ category: [], courseTitle: "", courseDetails: "" }] // Fix: category as array
    //       : [],
    // },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courseProposals",
  });

  // Function to handle reCAPTCHA response
  const handleRecaptchaChange = (token: string) => {
    if (token) {
      form.setValue("recaptchaToken", token);
      // Trigger validation to clear any error
      form.trigger("recaptchaToken");
    } else {
      form.setValue("recaptchaToken", "");
    }
  };

  // Set up the global handler function that will call our React handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.handleRecaptchaChange = handleRecaptchaChange;
    }

    return () => {
      // Cleanup
      if (typeof window !== "undefined") {
        window.handleRecaptchaChange = () => {};
      }
    };
  }, []);

  // Function to reset reCAPTCHA
  const resetRecaptcha = () => {
    if (window.grecaptcha && recaptchaLoaded) {
      window.grecaptcha.reset();
      form.setValue("recaptchaToken", "");
    }
  };

  // Initialize reCAPTCHA when script loads
  const handleRecaptchaLoad = () => {
    setRecaptchaLoaded(true);
  };

  // Add new course proposal for multiple
  // const addCourseProposal = () => {
  //   append({ category: [], courseTitle: "", courseDetails: "" });
  // };

  const addCourseProposal = () => {
    append({ category: "", courseTitle: "", courseDetails: "" }); // Changed from [] to ""
  };
  // Remove course proposal
  const removeCourseProposal = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  console.log("form result:", form.formState.errors);
  async function onSubmit(values: z.infer<typeof extendedContactFormSchema>) {
    try {
      setIsLoading(true);

      // Check if reCAPTCHA token exists
      if (!values.recaptchaToken) {
        toast.error("দয়া করে রিক্যাপচা যাচাই করুন");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          recaptchaToken: values.recaptchaToken,
          phone: values.phone,
          facebookUrl: values.facebookUrl,
          linkedinUrl: values.linkedinUrl,
          youtubeUrl: values.youtubeUrl,
          websiteUrl: values.websiteUrl,
          courseProposals: values.courseProposals,
          formType: formType,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reset form
        form.reset();
        resetRecaptcha();
        // Reset course proposals for teaching form
        if (formType === "teaching") {
          form.setValue("courseProposals", [
            { category: "", courseTitle: "", courseDetails: "" }, // Changed from [] to ""
          ]);
        }
        //  for multiple
        // if (formType === "teaching") {
        //   form.setValue("courseProposals", [
        //     { category: [], courseTitle: "", courseDetails: "" },
        //   ]);
        // }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      // console.log(err);
      toast.error("একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Load Google reCAPTCHA v2 script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?hl=bn`}
        onLoad={handleRecaptchaLoad}
      />
      <div
        className={` ${
          formType === "teaching" && "flex flex-col w-full items-center"
        } `}
      >
        {formType === "teaching" && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand text-white rounded-full mb-4">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              কোর্স আইডিয়া ফর্ম
            </h1>
            <p className="text-gray-600 text-base">
              আপনার কোর্সের প্রস্তাবনা পাঠান। আমরা দ্রুতই আপনার সাথে যোগাযোগ
              করব।
            </p>
          </div>
        )}
        <Card
          className={`w-full p-8 bg-white ${
            formType === "teaching" ? "md:w-7/12" : "md:w-full"
          } `}
        >
          {formType === "contact" && (
            <CardHeader className="p-0">
              <CardTitle className="mb-2 text-3xl font-bold text-fontcolor-title">
                যোগাযোগ
              </CardTitle>

              <CardDescription
                className={`text-base text-fontcolor-description`}
              >
                যোগাযোগ করতে ফরমটি ব্যবহার করুন। আমরা সর্বোচ্চ চেষ্টা করি দ্রুত
                উত্তর দিতে—সাধারণত ৪৮ ঘণ্টার মধ্যে।
              </CardDescription>
            </CardHeader>
          )}

          <CardContent className="p-0 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <section>
                  {formType === "teaching" && (
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      ব্যক্তিগত তথ্য
                    </h3>
                  )}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium text-fontcolor-title">
                          আপনার পূর্ণ নাম{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="এখানে লিখুন"
                            {...field}
                            className="border-[1px] border-greyscale-300 h-10 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage className="font-secondary" />
                      </FormItem>
                    )}
                  />
                  <div
                    className={`mt-4 ${
                      formType === "teaching"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-4 "
                        : ""
                    }   `}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-fontcolor-title">
                            ইমেইল <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="এখানে লিখুন"
                              {...field}
                              className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage className="font-secondary" />
                        </FormItem>
                      )}
                    />
                    {/* Phone field for teaching form */}
                    {formType === "teaching" && (
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium text-fontcolor-title">
                              <RequiredFieldStar labelText="ফোন নম্বর" />
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="এখানে লিখুন"
                                {...field}
                                className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage className="font-secondary" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </section>

                {formType === "teaching" && (
                  <div className="py-4">
                    <Separator />
                  </div>
                )}

                <section>
                  {formType === "teaching" && (
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      সামাজিক যোগাযোগ
                    </h3>
                  )}

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {/* linkedinUrl url for teaching form */}
                    {formType === "teaching" && (
                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>
                              <RequiredFieldStar labelText="লিংকডইন" />
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/yourprofile"
                                {...field}
                                className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage className="font-secondary" />
                          </FormItem>
                        )}
                      />
                    )}
                    {/* Facebook URL for teaching form */}
                    {formType === "teaching" && (
                      <FormField
                        control={form.control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium text-fontcolor-title">
                              ফেসবুক
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://facebook.com/yourprofile"
                                {...field}
                                className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage className="font-secondary" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* YouTube URL for teaching form */}
                    {formType === "teaching" && (
                      <FormField
                        control={form.control}
                        name="youtubeUrl"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium text-fontcolor-title">
                              ইউটিউব
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://youtube.com/yourchannel"
                                {...field}
                                className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage className="font-secondary" />
                          </FormItem>
                        )}
                      />
                    )}
                    {/* Website URL for teaching form */}
                    {formType === "teaching" && (
                      <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium text-fontcolor-title">
                              ওয়েবসাইট
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://yourwebsite.com"
                                {...field}
                                className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage className="font-secondary" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </section>

                {formType === "teaching" && (
                  <div className="py-4">
                    <Separator />
                  </div>
                )}
                {/* Subject field - only for contact form */}
                {formType === "contact" && (
                  <>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-fontcolor-title">
                            <RequiredFieldStar labelText="বিষয়" />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="এখানে লিখুন"
                              {...field}
                              className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage className="font-secondary" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-fontcolor-title">
                            <RequiredFieldStar labelText="বিস্তারিত" />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="এখানে লিখুন"
                              {...field}
                              className="border-[1px] border-greyscale-300 h-10  outline-none focus-visible:ring-0 focus-visible:ring-offset-0 mt-0 resize-none"
                            />
                          </FormControl>
                          <FormMessage className="font-secondary" />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Course Proposals Section - only for teaching form */}
                {formType === "teaching" && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-fontcolor-title">
                        কোর্স প্রস্তাবনা
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCourseProposal}
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} />
                        কোর্স যোগ করুন
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-4 p-4 border border-greyscale-200 rounded-md mb-4 last:mb-0 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-fontcolor-title">
                            প্রস্তাবনা - {convertNumberToBangla(index + 1)}
                          </h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCourseProposal(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`courseProposals.${index}.courseTitle`}
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-sm font-medium text-fontcolor-title">
                                <RequiredFieldStar labelText="কোর্সের টাইটেল" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="কোর্সের নাম লিখুন"
                                  {...field}
                                  className="border-[1px] border-greyscale-300 h-10 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </FormControl>
                              <FormMessage className="font-secondary" />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-4 mt-4">
                          <div className="w-full">
                            <div className="w-full">
                              <FormField
                                control={form.control}
                                name={`courseProposals.${index}.category`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      <RequiredFieldStar labelText="ক্যাটেগরি" />
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-white border-[1px] border-greyscale-300 h-10 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-blue-700 focus:ring-0 focus:ring-offset-0 focus:bg-[#E8F0FE]">
                                          <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {categories?.map((category) => (
                                          <SelectItem
                                            key={category?.name}
                                            value={category?.name}
                                          >
                                            {category?.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage className="font-secondary" />
                                  </FormItem>
                                )}
                              />
                              {/* <FormField
                                control={form.control}
                                name={`courseProposals.${index}.category`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      <RequiredFieldStar labelText="ক্যাটেগরি" />
                                    </FormLabel>
                                    <FormControl className="bg-white">
                                      <MultiSelect
                                        options={
                                          categories?.map((v) => ({
                                            value: v?.name,
                                            label: v?.name,
                                          })) || []
                                        }
                                        onValueChange={(value) => {
                                          // Use form.setValue instead of field.onChange
                                          form.setValue(
                                            `courseProposals.${index}.category`,
                                            value,
                                            {
                                              shouldValidate: true,
                                              shouldDirty: true,
                                              shouldTouch: true,
                                            }
                                          );
                                        }}
                                        defaultValue={field.value || []}
                                        placeholder="বিষয় নির্বাচন করুন"
                                      />
                                    </FormControl>
                                    <FormMessage className="font-secondary" />
                                  </FormItem>
                                )}
                              /> */}
                            </div>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name={`courseProposals.${index}.courseDetails`}
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-sm font-medium text-fontcolor-title">
                                <RequiredFieldStar labelText="কোর্সের বিস্তারিত" />
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="কোর্সের বিস্তারিত বর্ণনা লিখুন"
                                  {...field}
                                  className="border-[1px] border-greyscale-300 h-20 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                />
                              </FormControl>
                              <FormMessage className="font-secondary" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {/* privacy & policies  */}

                {formType === "contact" && (
                  <Card className="border-gray-200 bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-brand mt-0.5 flex-shrink-0 " />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            গোপনীয়তা এবং নিরাপত্তা
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয় থাকবে। আমরা
                            আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি
                            না। আমাদের
                            <Link
                              href="https://policies.google.com/privacy"
                              target="_blank"
                              className="ml-1 text-blue-500 hover:underline"
                            >
                              গোপনীয়তা নীতি
                            </Link>{" "}
                            এবং
                            <Link
                              href="https://policies.google.com/terms"
                              target="_blank"
                              className="ml-1 text-blue-500 hover:underline"
                            >
                              সেবার শর্তাবলী
                            </Link>{" "}
                            দেখুন।
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* reCAPTCHA v2 container */}
                <div className="mt-4 w-full">
                  <div
                    ref={recaptchaRef}
                    className="g-recaptcha"
                    data-sitekey={
                      process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
                    }
                    data-callback="handleRecaptchaChange"
                  ></div>
                  {form.formState.errors.recaptchaToken && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.recaptchaToken.message}
                    </p>
                  )}
                </div>

                {/* Add a hidden field for the reCAPTCHA token */}
                <FormField
                  control={form.control}
                  name="recaptchaToken"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* submit button  */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-3 text-base font-medium text-white transition-all duration-300 hover:bg-primary-700 bg-primary-brand"
                >
                  {isLoading ? (
                    <LoadingSpinner
                      size={25}
                      color="#ffffff"
                      borderWidth="2px"
                      height="100%"
                    />
                  ) : (
                    "সাবমিট করুন"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
