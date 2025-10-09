"use client";
import { addEventAttendee } from "@/lib/event/event-registration";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  CreditCard,
  Loader,
  Clock,
  AlertCircle,
  Info,
  CircleCheckBig,
} from "lucide-react";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { EventType } from "@prisma/client";
import {
  CheckoutStorage,
  UserStorage,
} from "@/lib/utils/storage/checkoutEmailStorage";
import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/common/LeadForm";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import { clientFetchUserDetails } from "@/lib/utils/openai/client/user";
import { clientGetEventRegisterByUser } from "@/lib/utils/openai/client/events";
import EventRegistrationLoading from "./EventRegistrationLoading";
import { Button } from "@/components/ui/button";

const StatusMessage = ({
  type,
  icon: Icon,
  title,
  description,
  note,
}: {
  type: "success" | "warning" | "pending";
  icon: any;
  title: string;
  description: string;
  note?: string;
}) => {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    pending: "bg-orange-50 border-orange-200 text-orange-800",
  };

  const iconStyles = {
    success: "text-emerald-600",
    warning: "text-amber-600",
    info: "text-blue-600",
    pending: "text-orange-600",
  };

  return (
    <div className={`${styles[type]} border rounded-xl p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${iconStyles[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight mb-1">{title}</h4>
          <p className="text-sm leading-relaxed opacity-90">{description}</p>
          {note && (
            <div className="mt-3 pt-3 border-t border-current/10">
              <p className="text-xs leading-relaxed opacity-75">
                <span className="font-medium">বি.দ্র:</span> {note}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const { data, status: sessionStatus }: any = useSession();
  const router = useRouter();
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = !!data?.user?.id;

  // QUERY_USER_DETAILS
  const { data: userInfo, isLoading: userInfoLoading } = useQuery<any>({
    queryKey: [QueryKeys.USER_DETAILS],
    queryFn: clientFetchUserDetails,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  // QUERY_USER_EVENT_REGISTRATION
  const {
    data: eventDetails,
    isLoading: eventRegisterStatusLoading,
    error: eventDetailsError,
  } = useQuery<any>({
    queryKey: [QueryKeys.USER_EVENT_DETAILS, data?.user?.id, eventId],
    queryFn: () => clientGetEventRegisterByUser(eventId),
    enabled: isAuthenticated && !!eventId,
    staleTime: 5 * 60 * 1000,
  });

  // Handle initialization
  useEffect(() => {
    // If session is still loading, keep initializing
    if (sessionStatus === "loading") {
      return;
    }

    // If not authenticated (guest), immediately set as initialized
    if (!isAuthenticated) {
      setIsInitializing(false);
      return;
    }

    // If authenticated but data is still loading, wait
    if (userInfoLoading || eventRegisterStatusLoading) {
      return;
    }

    // All data loaded, set as initialized
    setIsInitializing(false);
  }, [
    sessionStatus,
    isAuthenticated,
    userInfoLoading,
    eventRegisterStatusLoading,
  ]);

  const handlePaymentRedirect = async () => {
    setIsRedirecting(true);
    try {
      await clearServerCart();
      await setServerCart({
        type: "EVENT",
        items: [
          {
            eventId: eventId,
          },
        ],
      });

      // Store user details for checkout
      CheckoutStorage.saveEmail(userInfo?.email);
      UserStorage.saveName(userInfo?.name);
      UserStorage.savePhone(userInfo?.mobile || userInfo?.phone);

      router.push("/checkout");
    } catch (error) {
      setIsRedirecting(false);
      console.error("Payment redirect error:", error);
      toast.error("পেমেন্ট পেজে যেতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    }
  };

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

      // Store user details for checkout
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
          linkedin: formData.linkedin,
        };

        const result = await addEventAttendee(registrationData);

        if (result.success) {
          toast.success(result.message);
          setRegistrationSuccess(true);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Registration submission error:", error);
        toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
      }
    }
  };

  // Show loading only during initialization
  if (isInitializing) {
    return <EventRegistrationLoading />;
  }

  // Get registration data if user is authenticated
  const registrationData = eventDetails?.data;
  const isRegistered = isAuthenticated && registrationData?.isRegistered;
  const isApproved = registrationData?.isApproved;
  const isPaid = registrationData?.isPaid;
  const isPaidEvent = eventType === EventType.PAID;

  // Scenario 1: User is not registered (includes guest users) - Show registration form
  if (!isRegistered) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {eventType === EventType.EOI
                ? "EOI রেজিস্ট্রেশন"
                : eventType === EventType.FREE
                ? "ফ্রি রেজিস্ট্রেশন"
                : "রেজিস্ট্রেশন"}
            </h2>
          </div>

          {registrationSuccess && eventType !== EventType.EOI && (
            <StatusMessage
              type="success"
              icon={CheckCircle}
              title="রেজিস্ট্রেশন সফলভাবে সাবমিট করা হয়েছে!"
              description="বিস্তারিত জানার জন্য আপনার ইমেইল চেক করুন।"
            />
          )}

          {registrationSuccess && eventType === EventType.EOI && (
            <StatusMessage
              type="success"
              icon={CheckCircle}
              title="EOI রেজিস্ট্রেশন সম্পন্ন"
              description="আপনি EOI লিস্টে রেজিস্ট্রেশন করেছেন। ইভেন্টের বিস্তারিত আপনার ইমেইলে পাঠানো হয়েছে।"
              note="ইভেন্টের ফি নির্ধারণ করা হলে ইমেইল নোটিফিকেশনের মাধ্যমে জানানো হবে। এরপর নির্ধারিত ফি প্রদান সম্পন্ন করে ইভেন্ট রেজিস্ট্রেশন নিশ্চিত করতে হবে।"
            />
          )}

          {!registrationSuccess && (
            <LeadForm
              userInfo={userInfo || undefined}
              type={"EVENT"}
              courseId={""}
              eventId={eventId}
              certificationId={""}
              status={"WAITING"}
              isPreviewMode={isPreviewMode}
              submitHandler={onSubmit}
              isUserRegistered={false}
              userInfoLoading={userInfoLoading}
            />
          )}
        </div>
      </div>
    );
  }

  // Scenario 2: User is registered and has paid (Fully completed)
  if (isRegistered && isPaid) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5">
          <StatusMessage
            type="success"
            icon={CheckCircle}
            title="রেজিস্ট্রেশন সম্পন্ন"
            description="আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং পেমেন্ট সম্পন্ন করেছেন। অনুগ্রহ করে ইভেন্টের বিস্তারিত জানার জন্য আপনার ইমেইল চেক করুন।"
          />
        </div>
      </div>
    );
  }

  // Scenario 3: User is registered, approved, but hasn't paid (For paid events)
  if (isRegistered && isApproved === true && isPaidEvent && !isPaid) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              পেমেন্ট সম্পন্ন করুন
            </h2>
          </div>

          <StatusMessage
            type="success"
            icon={CircleCheckBig}
            title="রেজিস্ট্রেশন অনুমোদিত"
            description="আপনার রেজিস্ট্রেশন অনুমোদিত হয়েছে! ইভেন্টে অংশগ্রহণ নিশ্চিত করতে অনুগ্রহ করে পেমেন্ট সম্পন্ন করুন।"
          />

          <Button
            onClick={handlePaymentRedirect}
            variant={"primary"}
            disabled={isPreviewMode || isRedirecting}
            className="w-full h-11 font-medium mt-4"
          >
            {isRedirecting ? (
              <Loader className="animate-spin h-4 w-4" />
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>পেমেন্ট করুন</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Scenario 4: User is registered but not approved (isApproved === false)
  if (isRegistered && isApproved === false && eventType !== EventType.EOI) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              অনুমোদনের অপেক্ষায়
            </h2>
          </div>

          <StatusMessage
            type="warning"
            icon={AlertCircle}
            title="রেজিস্ট্রেশন পর্যালোচনায়"
            description="আপনার নিবন্ধন অনুমোদনের অপেক্ষায় রয়েছে। সহায়তার জন্য সাপোর্ট টিমের সাথে যোগাযোগ করুন।"
          />

          {isPaidEvent && (
            <Button
              variant={"disabled"}
              disabled={true}
              className="w-full h-11 font-medium opacity-50 cursor-not-allowed mt-4"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>পেমেন্ট করুন</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Scenario 5: User is registered, approval is pending (isApproved === null/undefined)
  if (isRegistered && (isApproved === null || isApproved === undefined)) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5">
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                পর্যালোচনার অধীনে
              </h2>
            </div>

            <StatusMessage
              type="pending"
              icon={Clock}
              title="রেজিস্ট্রেশন পর্যালোচনায়"
              description="আপনার নিবন্ধন পর্যালোচনার অধীনে রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।"
            />

            {isPaidEvent && (
              <Button
                disabled={true}
                className="w-full h-11 font-medium bg-gray-300 text-gray-500 cursor-not-allowed mt-4"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>পেমেন্ট করুন</span>
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  // Scenario 6: User is registered for FREE/EOI events and approved
  if (
    isRegistered &&
    (eventType === EventType.FREE || eventType === EventType.EOI)
  ) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5">
          {eventType === EventType.EOI ? (
            <StatusMessage
              type="success"
              icon={CheckCircle}
              title="EOI রেজিস্ট্রেশন সম্পন্ন"
              description="আপনি EOI লিস্টে রেজিস্ট্রেশন করেছেন। ইভেন্টের বিস্তারিত আপনার ইমেইলে পাঠানো হয়েছে।"
              note="ইভেন্টের ফি নির্ধারণ করা হলে ইমেইল নোটিফিকেশনের মাধ্যমে জানানো হবে। এরপর নির্ধারিত ফি প্রদান সম্পন্ন করে ইভেন্ট রেজিস্ট্রেশন নিশ্চিত করতে হবে।"
            />
          ) : (
            <StatusMessage
              type="success"
              icon={CheckCircle}
              title="রেজিস্ট্রেশন সম্পন্ন"
              description="আপনি এই ইভেন্টে রেজিস্ট্রেশন করেছেন। অনুগ্রহ করে ইভেন্টের বিস্তারিত জানার জন্য আপনার ইমেইল চেক করুন।"
            />
          )}
        </div>
      </div>
    );
  }

  // Fallback: Show registration form
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {eventType === EventType.EOI
              ? "EOI রেজিস্ট্রেশন"
              : eventType === EventType.FREE
              ? "ফ্রি রেজিস্ট্রেশন"
              : "রেজিস্ট্রেশন"}
          </h2>
        </div>

        <LeadForm
          userInfo={userInfo || undefined}
          type={"EVENT"}
          courseId={""}
          eventId={eventId}
          certificationId={""}
          status={"WAITING"}
          isPreviewMode={isPreviewMode}
          submitHandler={onSubmit}
          isUserRegistered={false}
          userInfoLoading={userInfoLoading}
        />
      </div>
    </div>
  );
};

export default EventRegisterForm;
