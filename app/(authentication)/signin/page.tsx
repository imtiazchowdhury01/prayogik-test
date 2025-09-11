// @ts-nocheck
"use client";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CgEye } from "react-icons/cg";
import { HiOutlineEyeOff } from "react-icons/hi";
import { Loader } from "lucide-react";
import PrayogikIntro from "./_components/prayogik-intro";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorFromSearchParams, setErrorFromSearchParams] = useState("");

  useEffect(() => {
    // Get redirect URL and error from URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }

    const error = searchParams.get("error");
    if (error) {
      let errorMessage = decodeURIComponent(error);
      setErrorFromSearchParams(errorMessage);
    }
  }, []);

  useEffect(() => {
    if (errorFromSearchParams) {
      toast.error(errorFromSearchParams);
    }
  }, [errorFromSearchParams]);

  const togglePassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const validateForm = () => {
      try {
        signInSchema.parse({ email, password });
        setIsFormValid(true);
        setErrors({});
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors = err.issues.reduce((acc, issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
          }, {});
          setErrors(fieldErrors);
          setIsFormValid(false);
        }
      }
    };
    validateForm();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      signInSchema.parse({ email, password });
      setErrors({});

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        if (res.error === "data and hash arguments required") {
          setErrors({ form: "Incorrect email or password" });
          toast.error("Incorrect email or password");
        } else {
          setErrors({ form: res.error });
          toast.error(res.error);
        }
        setIsSubmitting(false);
      } else {
        // toast.success("Logged in successfully!");
        router.push(redirectUrl);
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        toast.error("Please correct the errors in the form.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <section className="bg-[#F3F9F9] rounded-lg md:rounded-r-lg w-full md:w-1/2 lg:p-20 p-10 flex justify-center items-center">
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold"> স্বাগতম! লগইন করুন</h2>
          <p className="text-sm text-muted-foreground">
            আপনার শেখার যাত্রা শুরু হোক এখন থেকেই।
          </p>
        </div>
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${redirectUrl}`,
            })
          }
          className="w-full h-12 hover:opacity-70 duration-300font-medium text-fontcolor-description rounded-md shadow-sm border border-brand bg-transparent transition my-3 flex items-center justify-center space-x-2"
          type="button"
        >
          <FcGoogle className="text-xl" /> <span>গুগল দিয়ে লগইন করুন</span>
        </button>
        <div className="flex items-center space-x-2 mt-4">
          <span className="flex-1 border-[1px] border-greyscale-200"></span>
          <span className="text-fontcolor-description">অথবা</span>
          <span className="flex-1 border-[1px] border-greyscale-200"></span>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fontcolor-title">
              ইমেইল দিন
            </label>
            <input
              type="email"
              value={email}
              placeholder="এখানে লিখুন"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-12 focus-visible:ring-0 shadow-sm border border-gray-200 bg-white rounded-md"
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
                className="flex-1 h-full bg-transparent border-none outline-none focus-visible:ring-0"
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
            <Link
              href="/forgot-password"
              className="text-sm block transition-all duration-300  float-end mt-2 mb-6 hover:text-brand"
            >
              পাসওয়ার্ড ভুলে গেছি
            </Link>
          </div>
          {hasSubmitted && errors.form && (
            <div className="space-y-1">
              <p className="text-sm text-red-500">
                {errors.form.includes("prisma.user.findUnique") ||
                errors.form.includes("Server selection timeout")
                  ? "We're having trouble connecting to our servers."
                  : errors.form}
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand shadow-customButton grid place-items-center transition ${
              !isFormValid || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            data-testid="login-btn"
          >
            {isSubmitting ? (
              <Loader
                className="animate-spin"
                size={25}
                color="#ffffff"
                borderWidth="2px"
                height="100%"
                data-testid="loading"
              />
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <div className="flex gap-1 flex-row justify-center">
            {/* <p className="text-muted-foreground">আপনার কোন অ্যাকাউন্ট নেই?</p> */}
            {/* <Link
              className="font-semibold hover:text-brand text-gray-700"
              href="/prime"
            >
              ফ্রি ট্রায়াল নিন
            </Link> */}
          </div>
          <p className="text-muted-foreground mt-4">
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
    </section>
  );
}
