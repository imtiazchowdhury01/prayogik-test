// @ts-nocheck
"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { contactFormSchema } from "@/app/(site)/contact/_schema/contactFormSchema";
import LoadingSpinner from "@/components/LoadingSpinner";
import Script from "next/script";

// Update the contact form schema to include the recaptcha token
const extendedContactFormSchema = contactFormSchema.extend({
  recaptchaToken: z.string().min(1, "রিক্যাপচা যাচাই করুন"),
});

// Declare global type for reCAPTCHA
declare global {
  interface Window {
    handleRecaptchaChange: (token: string) => void;
    grecaptcha: {
      reset: () => void;
    };
  }
}

export default function ContactFormClient() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof extendedContactFormSchema>>({
    resolver: zodResolver(extendedContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      recaptchaToken: "",
    },
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
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reset form
        form.reset();
        resetRecaptcha();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
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

      <Card className="w-full p-8 bg-white md:w-1/2">
        <CardHeader className="p-0">
          <CardTitle className="mb-2 text-3xl font-bold text-fontcolor-title">
            যোগাযোগ
          </CardTitle>
          <CardDescription className="text-sm text-fontcolor-description">
            আপনার কোনো প্রশ্ন আছে? নীচের তথ্যগুলো দিয়ে আপনার প্রশ্নটি জমা দিন।
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-fontcolor-title">
                      আপনার পূর্ণ নাম
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-fontcolor-title">
                      ইমেইল
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
                name="subject"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-fontcolor-title">
                      বিষয়
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
                      বিস্তারিত
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

              {/* reCAPTCHA v2 container */}
              <div className="mt-4">
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

              {/* Google reCAPTCHA v2 privacy note */}
              <div className="mt-2 text-xs text-gray-500">
                {/* এই ফর্মটি Google reCAPTCHA দ্বারা সুরক্ষিত। */}
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
                  "জমা দিন"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
