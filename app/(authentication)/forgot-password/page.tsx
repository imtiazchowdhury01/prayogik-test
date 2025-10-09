// app/(authentication)/forgot-password/page.tsx
// @ts-nocheck
"use client";

import { z } from "zod";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader } from "lucide-react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

const forgotFormSchema = z.object({
  email: z.string().email({ message: "সঠিক ইমেইল অ্যাড্রেস দিন" }),
});

export default function ForgotPassword() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  // Redirect authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Check cooldown on mount
  useEffect(() => {
    const lastRequestTime = localStorage.getItem("lastPasswordResetRequest");
    if (lastRequestTime) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(lastRequestTime)) / 1000
      );
      if (elapsed < 60) {
        setCooldown(60 - elapsed);
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Real-time form validation
  useEffect(() => {
    const validateForm = () => {
      try {
        forgotFormSchema.parse({ email });
        setIsFormValid(true);
        if (hasSubmitted) {
          setErrors({});
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors = err.issues.reduce((acc, issue) => {
            acc[issue.path[0] as string] = issue.message;
            return acc;
          }, {} as Record<string, string>);
          if (hasSubmitted) {
            setErrors(fieldErrors);
          }
          setIsFormValid(false);
        }
      }
    };
    validateForm();
  }, [email, hasSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      // Validate form
      forgotFormSchema.parse({ email });
      setErrors({});

      // Send reset request
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);

        // Set cooldown
        localStorage.setItem("lastPasswordResetRequest", Date.now().toString());
        setCooldown(60);

        // Reset form
        setEmail("");
        setHasSubmitted(false);
      } else {
        toast.error(result.error || "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.issues.reduce((acc, issue) => {
          acc[issue.path[0] as string] = issue.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(fieldErrors);
        toast.error("অনুগ্রহ করে ফর্মের ত্রুটি সংশোধন করুন।");
      } else {
        console.error("Unexpected error:", err);
        toast.error("একটি অপ্রত্যাশিত সমস্যা হয়েছে।");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div id="forget-password" className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">পাসওয়ার্ড রিসেট করুন</h2>
          <p className="text-sm text-muted-foreground">
            আমরা আপনাকে একটি ইমেল পাঠাবো যাতে আপনি আপনার পাসওয়ার্ড রিসেট করতে
            পারেন।
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fontcolor-title">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || cooldown > 0}
              className="mt-1 w-full h-12 px-3 outline-none focus-visible:ring-2 focus-visible:ring-primary-brand shadow-sm border border-gray-200 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {hasSubmitted && errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || cooldown > 0}
            className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand transition shadow-customButton grid place-items-center ${
              !isFormValid || isSubmitting || cooldown > 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <Loader className="animate-spin" size={25} />
            ) : cooldown > 0 ? (
              `আবার চেষ্টা করুন - ${convertNumberToBangla(cooldown)} সেকেন্ড পর`
            ) : (
              "রিসেট লিঙ্ক পাঠান"
            )}
          </button>
        </form>
        <div className="flex items-center justify-center mt-5 text-sm">
          <Link
            href="/signin"
            className="block transition-all duration-300 text-fontcolor-description hover:opacity-70"
          >
            ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
