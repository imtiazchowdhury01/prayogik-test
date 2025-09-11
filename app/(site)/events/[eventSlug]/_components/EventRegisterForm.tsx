"use client";
import { addEventAttendee } from "@/lib/event/event-registration";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { getEventRegisterUserByIdDBCall } from "@/lib/data-access-layer/event-registration";
import { getUserDetails } from "@/actions/get-user-details";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { EventStatus, EventType } from "@prisma/client";
import {
  CheckoutStorage,
  UserStorage,
} from "@/lib/utils/storage/checkoutEmailStorage";
import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/common/LeadForm";
import { getEventLeadByEmailDBCall } from "@/lib/data-access-layer/leads";

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
  facebook?: string;
  linkedin?: string;
  profession?: string;
  phoneNumber?: string;
}

const EventRegisterForm = ({
  eventId,
  eventType,
  isPreviewMode = false,
  eventStatus,
}: {
  eventId: string;
  eventType: string;
  eventPrice?: number;
  isPreviewMode?: boolean;
  eventStatus?: string;
}) => {
  const { data }: any = useSession();
  const router = useRouter();
  const [eventRegisterStatusLoading, setEventRegisterStatusLoading] =
    useState<boolean>(true);
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);

  // Function to fetch user details
  const fetchUserDetails = async (userId: string) => {
    setUserInfoLoading(true);
    try {
      const result = await getUserDetails(userId);
      if (result.info && !result.error) {
        setUserInfo(result.info);
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
    const checkRegistrationStatus = async () => {
      // Early return if required data is missing
      if (!data?.user?.id || !eventId || !data?.user?.email) {
        setEventRegisterStatusLoading(false);
        return;
      }

      try {
        let isRegistered = false;

        if (eventStatus === EventStatus.WAITING) {
          // For waiting events, check by email

          const waitingLead = await getEventLeadByEmailDBCall(
            data?.user?.email,
            eventId
          );
          isRegistered = !!waitingLead;
          console.log("From If");
        } else {
          // For other events, check by user ID
          const registrationStatus = await getEventRegisterUserByIdDBCall(
            data.user.id,
            eventId
          );
          isRegistered = !!registrationStatus;
          console.log("from else", isRegistered);
        }

        setIsUserRegistered(isRegistered);
      } catch (error) {
        console.error("Error checking registration status:", error);
        setIsUserRegistered(false); // Set a default state on error
      } finally {
        setEventRegisterStatusLoading(false);
      }
    };

    checkRegistrationStatus();
  }, [data?.user?.id, eventId, userInfo?.email, eventStatus]);

  const onSubmit = async (formData: any) => {
    
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
      UserStorage.savePhone(formData.phone);

      router.push("/checkout");
    } else {
      try {
        // Use user info if available, otherwise use form data
        const registrationData = {
          name: userInfo?.name || formData.name,
          email: userInfo?.email || formData.email,
          mobile: formData.phone,
          eventId,
          facebook: formData.facebookProfile,
          linkedin: formData.linkedin
        };

        const result = await addEventAttendee(registrationData);

        if (result.success) {
          toast.success(result.message);
          setRegistrationSuccess(true);
          setIsUserRegistered(true);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Registration submission error:", error);
        toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
      }
    }
  };

  if (isUserRegistered) {
    return (
      <div className="bg-green-100 border border-green-300 p-4 rounded-[10px] mt-4">
        <p className="text-green-800 font-semibold text-center">
          আপনি ইতিমধ্যেই এই ইভেন্টে রেজিস্ট্রেশন করেছেন। <br /> অনুগ্রহ করে
          ইভেন্টের বিস্তারিত জানার জন্য আপনার ইমেইল চেক করুন।
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {eventStatus === EventStatus.WAITING
                ? "ওয়েটিং লিস্টে রেজিস্ট্রেশন করুন"
                : "ইভেন্ট রেজিস্ট্রেশন"}
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

          <LeadForm
            userInfo={userInfo || undefined}
            type={"EVENT"}
            courseId={""}
            eventId={eventId}
            certificationId={""}
            status={"WAITING"}
            isPreviewMode={isPreviewMode}
            submitHandler={onSubmit}
            isUserRegistered={isUserRegistered}
            userInfoLoading={userInfoLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EventRegisterForm;
