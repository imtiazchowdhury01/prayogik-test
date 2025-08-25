//@ts-nocheck

"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/(dashboard)/stoploading";
import { CgEye } from "react-icons/cg";
import { HiOutlineEyeOff } from "react-icons/hi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
    confirmPassword: z.string().min(6, { message: "পাসওয়ার্ড নিশ্চিত করুন।" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "দয়া করে পাসওয়ার্ড দুটো মিলিয়ে দিন।",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (!tokenFromUrl) {
      router.push("/");
    }

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
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
        // toast.error(result.error || "Invalid token.");
        setIsTokenValid(false);
      } else {
        // toast.success("Token is valid. You can reset your password.");
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("An error occurred while verifying the token.");
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const validateForm = () => {
      try {
        resetPasswordSchema.parse({ password, confirmPassword });
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
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error);
      } else {
        toast.success(result.message);

        router.push("/signin");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isTokenValid) {
    return (
      <div className="bg-white my-8 rounded-lg max-w-[540px] w-full p-8">
        <p className="text-2xl font-semibold leading-10 text-center sm:text-3xl">
          নতুন পাসওয়ার্ড দিন
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fontcolor-title">
              নতুন পাসওয়ার্ড
            </label>
            <div className="flex items-center justify-between w-full h-10 mt-1 overflow-hidden bg-transparent border rounded-md border-greyscale-300">
              <input
                type={showNewPassword ? "text" : "password"}
                value={password}
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 h-full bg-transparent border-none outline-none focus-visible:ring-0"
              />
              <div className="px-3">
                {!showNewPassword ? (
                  <CgEye
                    onClick={toggleNewPassword}
                    className="text-2xl cursor-pointer text-greyscale-500"
                  />
                ) : (
                  <HiOutlineEyeOff
                    onClick={toggleNewPassword}
                    className="text-2xl cursor-pointer text-greyscale-500"
                  />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              কনফার্ম পাসওয়ার্ড
            </label>
            <div className="flex items-center justify-between w-full h-10 mt-1 overflow-hidden bg-transparent border rounded-md border-greyscale-300">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="******"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 h-full bg-transparent border-none outline-none focus-visible:ring-0"
              />
              <div className="px-3">
                {!showConfirmPassword ? (
                  <CgEye
                    onClick={toggleConfirmPassword}
                    className="text-2xl cursor-pointer text-greyscale-500"
                  />
                ) : (
                  <HiOutlineEyeOff
                    onClick={toggleConfirmPassword}
                    className="text-2xl cursor-pointer text-greyscale-500"
                  />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand transition ${
              !isFormValid || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <LoadingSpinner
                size={25}
                color="#ffffff"
                borderWidth="2px"
                height="100%"
              />
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

  return (
    <div className="w-full max-w-md p-12 bg-white border border-red-200 rounded-lg shadow-lg flex flex-col items-center my-16">
      <TriangleAlert className="w-12 h-12 mb-6 text-red-300" />
      <h1 className="mb-4 text-xl font-bold">ইনভ্যালিড রিকোয়েস্ট!</h1>

      <Button onClick={() => router.replace("/")}>ফিরে যান</Button>
    </div>
  );
}
