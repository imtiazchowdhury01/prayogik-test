//@ts-nocheck
"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { signIn } from "next-auth/react";
import { CgEye } from "react-icons/cg";
import { HiOutlineEyeOff } from "react-icons/hi";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader } from "lucide-react";

const signUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "অনুগ্রহ করে আপনার নাম লিখুন, এটি কমপক্ষে ৩ অক্ষরের হতে হবে।",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z
      .string()
      .min(3, {
        message: "অনুগ্রহ করে ইউজারনেম দিন, যা কমপক্ষে ৩ অক্ষরের হতে হবে।",
      })
      .max(12, { message: "ইউজারনেম সর্বোচ্চ ১২ অক্ষরের হতে হবে।" }),
    password: z
      .string()
      .min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুইটি একই নয়। দয়া করে সঠিকভাবে মিলিয়ে লিখুন।",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [username, setusername] = useState("");
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const debouncedUsernameText = useDebounce(username, 500);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username.length >= 3 && username.length <= 12) {
        try {
          const response = await fetch(`/api/auth/check-username`, {
            body: JSON.stringify({ username: debouncedUsernameText }),
            method: "POST",
          });
          const data = await response.json();

          if (data.isAvailable) {
            setUsernameAvailability("ইউজারনেমটি ব্যবহারযোগ্য।");
          } else {
            setUsernameAvailability("ইউজারনেমটি ইতিমধ্যে নেওয়া হয়েছে।");
          }
        } catch (error) {
          setUsernameAvailability("Error checking username availability");
        }
      } else {
        setUsernameAvailability(
          "অনুগ্রহ করে ৩ থেকে ১২ অক্ষরের মধ্যে একটি ইউজারনেম দিন"
        );
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsernameText]);

  const handleUsernameChange = (e) => {
    const usernameValue = e.target.value?.replaceAll(" ", "");
    setusername(usernameValue);
  };

  useEffect(() => {
    // Reset username availability status when the username is cleared
    if (username === "") {
      setUsernameAvailability(null);
    }
  }, [username]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const validateForm = () => {
      try {
        signUpSchema.parse({
          name,
          email,
          username,
          password,
          confirmPassword,
        });
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
  }, [name, email, username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSubmitted(true);

    try {
      signUpSchema.parse({ name, email, username, password, confirmPassword });

      setErrors({});

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, username, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        setName("");
        setusername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSubmitting(false);
        setFormSubmitted(false);
        router.push("/signin");
      } else {
        setErrors({ form: data.error });
        toast.error(data.error);
        setIsSubmitting(false);
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

  // if (status === "loading") {
  //   return <Loading />;
  // }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="bg-white my-8 rounded-lg max-w-[540px] w-full p-8">
      <p className="text-2xl font-semibold leading-10 text-center sm:text-3xl">
        সাইন আপ করুন এবং শেখা শুরু করুন
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-fontcolor-title">
            আপনার পূর্ণ নাম
          </label>
          <input
            type="text"
            value={name}
            placeholder="এখানে লিখুন"
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 mt-1 bg-transparent border rounded-md focus-visible:ring-0 border-greyscale-300"
            data-testid="full-name"
          />
          {formSubmitted && errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-fontcolor-title">
            আপনার ইউজারনেম
          </label>
          <input
            type="text"
            value={username}
            placeholder="ইউজারনেম লিখুন"
            onChange={handleUsernameChange}
            className="w-full h-10 mt-1 bg-transparent border rounded-md focus-visible:ring-0 border-greyscale-300"
            data-testid="username"
          />
          {formSubmitted && errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
          {usernameAvailability && (
            <p
              className={`mt-1 text-sm ${
                // usernameAvailability?.includes("available")
                usernameAvailability?.includes("ব্যবহারযোগ্য")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {usernameAvailability}
            </p>
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
            className="w-full h-10 mt-1 bg-transparent border rounded-md focus-visible:ring-0 border-greyscale-300"
            data-testid="email-input"
          />
          {formSubmitted && errors.email && (
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
                  data-testid="toggle-eye-see"
                />
              ) : (
                <HiOutlineEyeOff
                  onClick={togglePassword}
                  className="text-2xl cursor-pointer text-greyscale-500"
                />
              )}
            </div>
          </div>
          {formSubmitted && errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-fontcolor-title">
            কনফার্ম পাসওয়ার্ড
          </label>
          <div className="flex items-center justify-between w-full h-10 mt-1 overflow-hidden bg-transparent border rounded-md border-greyscale-300">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="******"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 h-full bg-transparent border-none outline-none focus-visible:ring-0"
              data-testid="confirm-password-input"
            />
            <div className="px-3">
              {!showConfirmPassword ? (
                <CgEye
                  onClick={toggleConfirmPassword}
                  className="text-2xl cursor-pointer text-greyscale-500"
                  data-testid="confirm-toggle-eye-see"
                />
              ) : (
                <HiOutlineEyeOff
                  onClick={toggleConfirmPassword}
                  className="text-2xl cursor-pointer text-greyscale-500"
                />
              )}
            </div>
          </div>
          {formSubmitted && errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        {formSubmitted && errors.form && (
          <p className="text-sm text-red-500">{errors.form}</p>
        )}
        <button
          type="submit"
          disabled={
            !isFormValid ||
            isSubmitting ||
            // !usernameAvailability?.includes("available")
            !usernameAvailability?.includes("ব্যবহারযোগ্য")
          }
          className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand grid place-items-center transition ${
            !isFormValid || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          name="submit"
          data-testid="submit-btn"
        >
          {isSubmitting ? (
            <Loader
              className="animate-spin"
              size={25}
              color="#ffffff"
              borderWidth="2px"
              height="100%"
              data-testid="loading"
              name="loader"
            />
          ) : (
            "অ্যাকাউন্ট তৈরি করুন"
          )}
        </button>
      </form>
      <p className="mt-4 mb-1 text-center">
        আপনার অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/signin"
          className="font-medium transition-all text-primary-brand hover:opacity-70 "
          data-testid="login-link"
        >
          লগইন করুন
        </Link>
      </p>
      <p className="text-center ">
        সাইন আপ করার মাধ্যমে, আমি আপনাদের{" "}
        <Link
          href={"/terms-conditions"}
          className="font-medium transition-all text-primary-brand hover:opacity-70"
          data-testid="condition-link"
        >
          শর্তাবলী
        </Link>{" "}
        স্বীকার করি।
      </p>
    </div>
  );
}
