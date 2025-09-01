// @ts-nocheck
"use client";
import { useForm } from "react-hook-form";
import { addEventAttendee } from "@/lib/event/event-registration";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RegistrationFormData {
  name: string;
  email: string;
  mobile: string;
  profession: string;
}

const EventRegisterForm = ({ eventId }: { eventId: string }) => {
  const { data } = useSession();
  const isLoggedIn = !!data?.user?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      name: data?.user?.name || "",
      email: data?.user?.email || "",
      mobile: "",
      profession: "",
    },
  });

  const onSubmit = async (formData: RegistrationFormData) => {
    if (!isLoggedIn) {
      toast.error("ইভেন্টে যোগদানের জন্য লগইন করুন।");
      return;
    }

    try {
      // Use session data if available, otherwise use form data
      const registrationData = {
        name: data?.user?.name || formData.name,
        email: data?.user?.email || formData.email,
        mobile: formData.mobile,
        profession: formData.profession,
        eventId,
        userId: data?.user?.id,
      };

      const result = await addEventAttendee(registrationData);

      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Registration submission error:", error);
      toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              ইভেন্ট রেজিস্ট্রেশন
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Only show name field if user is not logged in */}
            {!data?.user?.name && (
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  আপনার নাম
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  {...register("name", { required: "নাম প্রয়োজন" })}
                  className="w-full"
                  disabled={isSubmitting || !isLoggedIn}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Show logged in user's name (read-only) */}
            {data?.user?.name && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  আপনার নাম
                </Label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {data.user.name}
                </div>
              </div>
            )}

            {/* Only show email field if user is not logged in */}
            {!data?.user?.email && (
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  ইমেইল
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ইমেইল লিখুন"
                  {...register("email", {
                    required: "ইমেইল প্রয়োজন",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "সঠিক ইমেইল ঠিকানা লিখুন",
                    },
                  })}
                  className="w-full"
                  disabled={isSubmitting || !isLoggedIn}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* Show logged in user's email (read-only) */}
            {data?.user?.email && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  ইমেইল
                </Label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {data.user.email}
                </div>
              </div>
            )}

            <div>
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                মোবাইল নাম্বার
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="নাম্বার লিখুন"
                {...register("mobile", {
                  required: "মোবাইল নাম্বার প্রয়োজন",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "১১ সংখ্যার মোবাইল নাম্বার লিখুন",
                  },
                })}
                className="w-full"
                disabled={isSubmitting || !isLoggedIn}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="profession"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                আপনার পেশা
              </Label>
              <Input
                id="profession"
                type="text"
                placeholder="পেশা লিখুন"
                {...register("profession", { required: "পেশা প্রয়োজন" })}
                className="w-full"
                disabled={isSubmitting || !isLoggedIn}
              />
              {errors.profession && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isLoggedIn}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন করুন"}
            </Button>

            {/* Login message for non-logged in users */}
            {!isLoggedIn && (
              <div className="bg-brand-primary-lighter border border-brand-light rounded-lg p-4 text-center">
                <p className="text-sm">
                  ইভেন্টে যোগদান করার জন্য{" "}
                  <Link
                    href="/prime"
                    className="text-brand font-medium underline"
                  >
                    লগইন করুন
                  </Link>
                  । আমাদের{" "}
                  <Link
                    href={"/prime"}
                    className="text-brand font-medium underline"
                  >
                    সাবস্ক্রিপশন প্ল্যান
                  </Link>{" "}
                  ট্রাই করুন।
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegisterForm;
