"use client";
import { useForm } from "react-hook-form";
import { addEventAttendee } from "@/lib/event/event-registration";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader, CheckCircle } from "lucide-react";
import { getEventRegisterUserByIdDBCall } from "@/lib/data-access-layer/event-registration";
import { getUserDetails } from "@/actions/get-user-details";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { EventType } from "@prisma/client";
import {
  CheckoutStorage,
  UserStorage,
} from "@/lib/utils/storage/checkoutEmailStorage";
import { useRouter } from "next/navigation";

interface RegistrationFormData {
  name: string;
  email: string;
  mobile: string;
  profession: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profession?: string;
}

const EventRegisterForm = ({
  eventId,
  eventType,
  eventPrice,
}: {
  eventId: string;
  eventType: string;
  eventPrice?: number;
}) => {
  const { data }: any = useSession();
  const router = useRouter();
  const [eventRegisterStatusLoading, setEventRegisterStatusLoading] =
    useState<boolean>(true);
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      profession: "",
    },
  });

  // Function to fetch user details
  const fetchUserDetails = async (userId: string) => {
    setUserInfoLoading(true);
    try {
      const result = await getUserDetails(userId);
      if (result.info && !result.error) {
        setUserInfo(result.info);

        // Set form values with user info
        setValue("name", result.info.name || "");
        setValue("email", result.info.email || "");
        setValue("mobile", result.info.phoneNumber || "");
        setValue("profession", result.info.profession || "");
      } else {
        console.error("Error fetching user details:", result.error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setUserInfoLoading(false);
    }
  };

  // Fetch user details when user is logged in
  useEffect(() => {
    if (data?.user) {
      fetchUserDetails(data.user.id);
    }
  }, [data?.user]);

  // Check registration status for logged-in users
  useEffect(() => {
    console.log("from use effect");
    const checkRegistrationStatus = async () => {
      if (data?.user?.id && eventId) {
        try {
          const registrationStatus = await getEventRegisterUserByIdDBCall(
            data.user.id,
            eventId
          );
          console.log(registrationStatus, "status");
          setIsUserRegistered(!!registrationStatus);
        } catch (error) {
          console.error("Error checking registration status:", error);
        } finally {
          setEventRegisterStatusLoading(false);
        }
      } else {
        setEventRegisterStatusLoading(false);
      }
    };

    checkRegistrationStatus();
  }, [data?.user?.id, eventId]);

  const onSubmit = async (formData: RegistrationFormData) => {
    if (eventType === EventType.PAID) {
      await clearServerCart();
      await setServerCart({
        type: "EVENT",
        items: [
          {
            eventId: eventId,
          },
        ],
      });

      // ✅ Store user details for checkout
      CheckoutStorage.saveEmail(userInfo?.email || formData.email);
      UserStorage.saveName(userInfo?.name || formData.name);
      UserStorage.savePhone(formData.mobile);
      UserStorage.saveProfession(formData.profession);

      router.push("/checkout");
    } else {
      try {
        // Use user info if available, otherwise use form data
        const registrationData = {
          name: userInfo?.name || formData.name,
          email: userInfo?.email || formData.email,
          mobile: formData.mobile,
          profession: formData.profession,
          eventId,
        };

        const result = await addEventAttendee(registrationData);

        if (result.success) {
          toast.success(result.message);
          setRegistrationSuccess(true);
          setIsUserRegistered(true);
          reset();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Registration submission error:", error);
        toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
      }
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

          {/* Success Message */}
          {registrationSuccess && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    ইভেন্ট রেজিস্ট্রেশন সফল হয়েছে!
                  </p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    বিস্তারিত জানার জন্য আপনার ইমেইল চেক করুন
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Only show name field if user is not logged in */}
            {!userInfo?.name && (
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
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Show logged in user's name (read-only) */}
            {userInfo?.name && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  আপনার নাম
                </Label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {userInfo.name}
                </div>
              </div>
            )}

            {/* Only show email field if user is not logged in */}
            {!userInfo?.email && (
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  ইমেইল
                </Label>
                <div className="relative">
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
                    disabled={isSubmitting}
                  />
                  {emailCheckLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader
                        size={16}
                        className="animate-spin text-gray-400"
                      />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* Show logged in user's email (read-only) */}
            {userInfo?.email && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  ইমেইল
                </Label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {userInfo.email}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              {errors.profession && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                eventRegisterStatusLoading ||
                isUserRegistered ||
                emailCheckLoading ||
                userInfoLoading
              }
              className={`w-full font-medium py-3 rounded-md transition-colors disabled:opacity-50 ${
                isUserRegistered
                  ? buttonVariants({
                      variant: "disabled",
                    })
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {eventRegisterStatusLoading ||
              emailCheckLoading ||
              isSubmitting ||
              userInfoLoading ? (
                <Loader size={16} className="animate-spin" />
              ) : isUserRegistered ? (
                "রেজিস্ট্রার্ড"
              ) : (
                "রেজিস্ট্রেশন করুন"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegisterForm;
