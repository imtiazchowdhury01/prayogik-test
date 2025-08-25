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
    <div className="bg-white my-8 rounded-lg max-w-[540px] w-full p-8">
      <p className="text-2xl font-semibold leading-10 text-center sm:text-3xl">
        আপনার শেখার যাত্রা চালিয়ে যেতে লগ ইন করুন
      </p>
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
            className="mt-1 w-full h-10 border-[1px] focus-visible:ring-0 border-greyscale-300 bg-transparent rounded-md"
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
          <div className="flex items-center justify-between w-full h-10 mt-1 overflow-hidden bg-transparent border rounded-md border-greyscale-300">
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
                  className="text-2xl cursor-pointer text-greyscale-500"
                  data-testid="toggle-eye"
                />
              ) : (
                <HiOutlineEyeOff
                  onClick={togglePassword}
                  className="text-2xl cursor-pointer text-greyscale-500"
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
            className="text-sm block text-primary-brand transition-all duration-300 hover:opacity-[.7] float-end mt-1 mb-6"
          >
            পাসওয়ার্ড ভুলে গেছি
          </Link>
        </div>
        {/* {hasSubmitted && errors.form && (
          <p className="text-sm text-red-500">{errors.form}</p>
        )} */}
        {hasSubmitted && errors.form && (
          <div className="space-y-1">
            <p className="text-sm text-red-500">
              {errors.form.includes("prisma.user.findUnique") ||
              errors.form.includes("Server selection timeout")
                ? "We're having trouble connecting to our servers."
                : errors.form}
            </p>
            {/* {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-gray-500">
                {errors.form}
              </p>
            )} */}
          </div>
        )}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand grid place-items-center transition ${
            !isFormValid || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
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
      {/* <p className="mt-4 mb-6 text-center">
        {`আপনার অ্যাকাউন্ট নেই?`}{" "}
        <Link
          href="/signup"
          className="font-medium transition-all text-primary-brand hover:opacity-70 "
          data-testid="create-new-btn"
        >
          অ্যাকাউন্ট তৈরি করুন
        </Link>
      </p> */}
      <div className="flex items-center space-x-2 mt-4">
        <span className="flex-1 border-[1px] border-greyscale-200"></span>
        <span className="text-fontcolor-description">অথবা</span>
        <span className="flex-1 border-[1px] border-greyscale-200"></span>
      </div>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${redirectUrl}`,
          })
        }
        className="w-full h-12 hover:opacity-70 duration-300font-medium text-fontcolor-description rounded-md border-[1px] border-greyscale-200 transition my-3 flex items-center justify-center space-x-2"
        type="button"
      >
        <FcGoogle className="text-xl" /> <span>গুগল দিয়ে লগইন করুন</span>
      </button>
    </div>
  );
}
