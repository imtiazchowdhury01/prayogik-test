// app/signup/page.tsx
"use client";

import { z } from "zod";
import React, { JSX } from "react";
import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { CgEye } from "react-icons/cg";
import { HiOutlineEyeOff } from "react-icons/hi";
import { Loader } from "lucide-react";

// Schema definition
const signUpSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  email: z.string().email({ message: "সঠিক ইমেইল ঠিকানা দিন" }),
  password: z
    .string()
    .min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
});

// Type definitions
type SignUpFormData = z.infer<typeof signUpSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
}

interface ReferralValidationResponse {
  valid: boolean;
  message?: string;
}

interface SignUpResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export default function SignUp(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get referral code from URL
    const ref = searchParams.get("ref");
    if (ref) {
      // Validate referral code
      validateReferralCode(ref);
    }
  }, [searchParams]);

  const validateReferralCode = async (code: string): Promise<void> => {
    try {
      const response = await fetch(`/api/referrals/validate?code=${code}`);
      const data: ReferralValidationResponse = await response.json();

      if (!data.valid) {
        toast.error("রেফারেল কোডটি সঠিক নয়। অনুগ্রহ করে আবার দিন।");
        router.push("/");
      } else {
        setReferralCode(code);
      }
    } catch (error) {
      console.error("Referral validation error:", error);
      toast.error("রেফারেল কোড যাচাই করতে সমস্যা হয়েছে");
      router.push("/");
    }
  };

  const togglePassword = (): void => setShowPassword(!showPassword);

  useEffect(() => {
    const validateForm = (): void => {
      try {
        signUpSchema.parse({ name, email, password });
        setIsFormValid(true);
        setErrors({});
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors = err.issues.reduce<FormErrors>((acc, issue) => {
            const field = issue.path[0] as keyof SignUpFormData;
            acc[field] = issue.message;
            return acc;
          }, {});
          setErrors(fieldErrors);
          setIsFormValid(false);
        }
      }
    };
    validateForm();
  }, [name, email, password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      signUpSchema.parse({ name, email, password });
      setErrors({});

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          referralCode,
        }),
      });

      const data: SignUpResponse = await response.json();

      if (!response.ok) {
        setErrors({ form: data.error || "সাইনআপ করতে সমস্যা হয়েছে" });
        toast.error(data.error || "সাইনআপ করতে সমস্যা হয়েছে");
        setIsSubmitting(false);
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/signin");
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.issues.reduce<FormErrors>((acc, issue) => {
          const field = issue.path[0] as keyof SignUpFormData;
          acc[field] = issue.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        toast.error("ফর্মে ত্রুটি সংশোধন করুন।");
      } else {
        console.error("Unexpected error:", err);
        toast.error("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।");
      }
    }
  };

  return (
    <div id="sign-up" className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
        <p className="text-sm text-muted-foreground">
          আপনার শেখার যাত্রা শুরু করুন আজই।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-fontcolor-title">
            আপনার নাম
          </label>
          <input
            type="text"
            value={name}
            placeholder="এখানে লিখুন"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full h-12 focus-visible:ring-0 shadow-sm border border-gray-200 bg-white rounded-md px-3"
            data-testid="name-input"
          />
          {hasSubmitted && errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-fontcolor-title">
            ইমেইল দিন
          </label>
          <input
            type="email"
            value={email}
            placeholder="এখানে লিখুন"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full h-12 focus-visible:ring-0 shadow-sm border border-gray-200 bg-white rounded-md px-3"
            data-testid="email-input"
          />
          {hasSubmitted && errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-fontcolor-title">
            পাসওয়ার্ড
          </label>
          <div className="flex items-center justify-between w-full h-12 mt-1 overflow-hidden bg-transparent rounded-md shadow-sm border border-gray-200 bg-white">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 h-full bg-transparent border-none outline-none focus-visible:ring-0 px-3"
              data-testid="password-input"
            />
            <div className="px-3">
              {!showPassword ? (
                <CgEye
                  onClick={togglePassword}
                  className="text-xl cursor-pointer text-greyscale-500"
                  data-testid="toggle-eye"
                />
              ) : (
                <HiOutlineEyeOff
                  onClick={togglePassword}
                  className="text-xl cursor-pointer text-greyscale-500"
                  data-testid="toggle-eye"
                />
              )}
            </div>
          </div>
          {hasSubmitted && errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {hasSubmitted && errors.form && (
          <div className="space-y-1">
            <p className="text-sm text-red-500">{errors.form}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand shadow-customButton grid place-items-center transition ${
            !isFormValid || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          data-testid="signup-btn"
        >
          {isSubmitting ? (
            <Loader
              className="animate-spin"
              size={25}
              color="#ffffff"
              data-testid="loading"
            />
          ) : (
            "সাইনআপ করুন"
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <p className="text-muted-foreground">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-brand hover:underline"
          >
            লগইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center text-sm">
        <p className="text-muted-foreground text-xs sm:text-sm xl:text-sm">
          উপরে ক্লিক করে, আমি{" "}
          <Link href="/terms-conditions">
            <span className="font-semibold text-gray-700 underline hover:text-brand">
              পরিষেবার শর্তাবলী
            </span>{" "}
          </Link>
          এবং{" "}
          <Link href="/privacy-policy">
            <span className="font-semibold text-gray-700 underline hover:text-brand">
              গোপনীয়তা নীতিতে
            </span>{" "}
          </Link>
          সম্মত।
        </p>
      </div>
    </div>
  );
}
