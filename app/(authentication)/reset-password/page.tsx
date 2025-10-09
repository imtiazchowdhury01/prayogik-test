// app/(authentication)/reset-password/page.tsx
// @ts-nocheck
"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { CgEye } from "react-icons/cg";
import { HiOutlineEyeOff } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { TriangleAlert, Loader } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
    confirmPassword: z.string().min(6, { message: "পাসওয়ার্ড নিশ্চিত করুন।" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "দয়া করে পাসওয়ার্ড দুটো মিলিয়ে দিন।",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Extract and verify token on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (!tokenFromUrl) {
      setIsLoading(false);
      setIsTokenValid(false);
      return;
    }

    setToken(tokenFromUrl);
    verifyToken(tokenFromUrl);
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "টোকেন ইনভ্যালিড বা এক্সপায়ার্ড।");
        setIsTokenValid(false);
      } else {
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("টোকেন ভেরিফাই করতে সমস্যা হয়েছে।");
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time form validation
  useEffect(() => {
    const validateForm = () => {
      try {
        resetPasswordSchema.parse({ password, confirmPassword });
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
  }, [password, confirmPassword, hasSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      // Validate form
      resetPasswordSchema.parse({ password, confirmPassword });
      setErrors({});

      // Submit password reset
      const response = await fetch("/api/auth/reset-password-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে।");
      } else {
        toast.success(result.message);
        // Redirect to signin after short delay
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  // Valid token - show reset form
  if (isTokenValid) {
    return (
      <div id="reset-password" className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">নতুন পাসওয়ার্ড দিন</h2>
          <p className="text-sm text-muted-foreground">
            আপনার নিরাপত্তা নিশ্চিত করতে একটি নতুন পাসওয়ার্ড নির্ধারণ করুন।
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fontcolor-title">
              নতুন পাসওয়ার্ড
            </label>
            <div className="flex items-center justify-between w-full h-12 mt-1 overflow-hidden rounded-md shadow-sm border border-gray-200 bg-white">
              <input
                type={showNewPassword ? "text" : "password"}
                value={password}
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 h-full px-3 bg-transparent border-none outline-none focus-visible:ring-0 disabled:opacity-50"
              />
              <div className="px-3">
                {!showNewPassword ? (
                  <CgEye
                    onClick={toggleNewPassword}
                    className="text-xl cursor-pointer text-greyscale-500"
                  />
                ) : (
                  <HiOutlineEyeOff
                    onClick={toggleNewPassword}
                    className="text-xl cursor-pointer text-greyscale-500"
                  />
                )}
              </div>
            </div>
            {hasSubmitted && errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-fontcolor-title">
              কনফার্ম পাসওয়ার্ড
            </label>
            <div className="flex items-center justify-between w-full h-12 mt-1 overflow-hidden rounded-md shadow-sm border border-gray-200 bg-white">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="******"
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 h-full px-3 bg-transparent border-none outline-none focus-visible:ring-0 disabled:opacity-50"
              />
              <div className="px-3">
                {!showConfirmPassword ? (
                  <CgEye
                    onClick={toggleConfirmPassword}
                    className="text-xl cursor-pointer text-greyscale-500"
                  />
                ) : (
                  <HiOutlineEyeOff
                    onClick={toggleConfirmPassword}
                    className="text-xl cursor-pointer text-greyscale-500"
                  />
                )}
              </div>
            </div>
            {hasSubmitted && errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full h-12 hover:bg-primary-700 shadow-customButton mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand transition grid place-items-center ${
              !isFormValid || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <Loader className="animate-spin" size={25} />
            ) : (
              "নিশ্চিত করুন"
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

  // Invalid token - show error
  return (
    <div className="w-full max-w-md p-12 bg-white border border-red-200 rounded-lg shadow-lg flex flex-col items-center my-16">
      <TriangleAlert className="w-12 h-12 mb-6 text-red-300" />
      <h1 className="mb-4 text-xl font-bold text-center">
        ইনভ্যালিড রিকোয়েস্ট!
      </h1>
      <p className="mb-6 text-sm text-center text-muted-foreground">
        টোকেন ইনভ্যালিড বা মেয়াদ শেষ হয়ে গেছে। পাসওয়ার্ড রিসেট করার জন্য আবার
        চেষ্টা করুন।
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => router.replace("/forgot-password")}
          variant="outline"
        >
          পাসওয়ার্ড রিসেট করুন
        </Button>
        <Button onClick={() => router.replace("/signin")}>লগইন করুন</Button>
      </div>
    </div>
  );
}
