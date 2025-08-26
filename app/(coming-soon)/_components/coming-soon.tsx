"use client";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import toast from "react-hot-toast";
import { z } from "zod";
import LoadingSpinner from "@/components/LoadingSpinner";

// Email subscription schema
const emailSubscriptionSchema = z.object({
  email: z.string().email("একটি বৈধ ইমেইল ঠিকানা প্রবেশ করুন"),
});

type EmailFormData = z.infer<typeof emailSubscriptionSchema>;

export default function ComingSoon() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSubscriptionSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(
          responseData.message ||
            "ধন্যবাদ! আমরা আপনাকে লঞ্চের সময় জানিয়ে দেব।"
        );
        form.reset();
      } else {
        toast.error(
          responseData.message || "একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন"
        );
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #f0fdfc, #ccfbf7, #99f6ee)",
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#134e49"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 overflow-hidden">
        {/* Header Section */}
        <div
          className="px-8 py-12 text-center relative"
          style={{ backgroundColor: "#115e57" }}
        >
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo-light.svg"
              width={130}
              height={130}
              className="h-16 w-auto mx-auto"
              alt="prayogik logo"
              priority
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            শীঘ্রই আসছে
          </h1>

          {/* Description */}
          <p
            className="text-md sm:text-lg md:text-xl leading-relaxed max-w-lg mx-auto"
            style={{ color: "#ccfbf7" }}
          >
            অনলাইন শিক্ষার নতুন অভিজ্ঞতা নিয়ে আমরা ফিরে আসছি। আরও উন্নত কোর্স
            এবং ইন্টারঅ্যাক্টিভ লার্নিং এর জন্য প্রস্তুত থাকুন।
          </p>
        </div>

        {/* CTA Section */}
        <CardContent
          className="px-8 py-8"
          style={{ backgroundColor: "#14b8a9" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-white text-lg font-medium">
                লঞ্চের আপডেট পেতে চান?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:min-w-[250px] min-w-full">
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="আপনার ইমেইল"
                            {...field}
                            disabled={isLoading}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-white/50 disabled:opacity-50 focus-visible:ring-[#0b7d73]"
                          />
                        </FormControl>
                        <FormMessage className="text-white/90 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isLoading}
                    className="font-semibold px-6 whitespace-nowrap disabled:opacity-50 z-50"
                    style={{
                      backgroundColor: isLoading ? "#f0f0f0" : "white",
                      color: "#0d9488",
                      border: "none",
                    }}
                  >
                    {isLoading ? (
                      <LoadingSpinner
                        size={20}
                        color="#0d9488"
                        borderWidth="2px"
                        height="100%"
                      />
                    ) : (
                      <>
                        সাবস্ক্রাইব করুন
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="fixed bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-max z-50">
        <p className="text-sm text-[#0d9488]">
          © ২০২৫ প্রায়োগিক। সকল অধিকার সংরক্ষিত।
        </p>
      </div>
    </div>
  );
}
