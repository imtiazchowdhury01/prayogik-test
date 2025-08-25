//@ts-nocheck
"use client";

import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
// import Loading from "@/app/(site)/loading";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

const forgotFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPassword() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    // Check cooldown
    const lastRequestTime = localStorage.getItem("lastRequestTime");
    if (lastRequestTime) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(lastRequestTime)) / 1000
      );
      if (elapsed < 60) {
        setCooldown(60 - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    // Countdown effect
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(cooldown - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    const validateForm = () => {
      try {
        forgotFormSchema.parse({ email });
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
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      forgotFormSchema.parse({ email });
      setErrors({});

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.message) {
        toast.success(result.message);
        // form.reset();

        // Update cooldown and request count
        localStorage.setItem("lastRequestTime", Date.now().toString());
        localStorage.setItem(
          "requestCount",
          (parseInt(localStorage.getItem("requestCount") || "0") + 1).toString()
        );
        setCooldown(60);
      } else {
        toast.error(result.error);
      }

      setEmail("");
      setErrors({});
      setHasSubmitted(false);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        toast.error("Please correct the error in the form.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (status === "loading") {
  //   return <Loading />;
  // }

  if (status === "unauthenticated") {
    return (
      <div className="bg-white my-8 rounded-lg max-w-[540px] w-full p-8">
        <p className="text-2xl font-semibold leading-10 text-center sm:text-3xl">
          আপনার পাসওয়ার্ড ভুলে গেছেন?
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fontcolor-title">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              placeholder="এখানে লিখুন"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-10 border-[1px] outline-none focus-visible:ring-0 border-greyscale-300 bg-transparent rounded-md"
            />
            {hasSubmitted && errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || loading || cooldown > 0}
            className={`w-full h-12 hover:bg-primary-700 mt-6 duration-300 text-white p-2 rounded-md bg-primary-brand transition ${
              !isFormValid || isSubmitting || loading || cooldown > 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting
              ? "পাঠানো হচ্ছে..."
              : cooldown > 0
              ? `আবার চেষ্টা করুন - ${convertNumberToBangla(
                  cooldown
                )} সেকেন্ড পর`
              : "রিসেট লিঙ্ক পাঠান"}

            {/* {isSubmitting ? (
                <LoadingSpinner
                  size={25}
                  color="#ffffff"
                  borderWidth="2px"
                  height="100%"
                />
              ) : (
                "এগিয়ে যাই"
              )} */}
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
