"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react"; // Import the loader icon

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  type: "MONTHLY" | "YEARLY";
  durationInMonths: number;
  durationInYears: number;
  isTrial: boolean;
}

interface ActiveSubscription {
  id: string;
  subscriptionPlanId: string;
  expiresAt: string;
  status: string;
  isTrial: boolean;
  trialStartedAt?: string | null;
  trialEndsAt?: string | null;
  subscriptionPlan: SubscriptionPlan;
}

interface PurchasePlanButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  plan: SubscriptionPlan;
  children?: React.ReactNode;
}

// Constants
const BUTTON_VARIANTS = {
  primary: "hover:bg-primary-700 bg-brand text-white py-3",
  secondary:
    "bg-secondary-button hover:bg-secondary-button hover:opacity-85 text-white px-6 py-1.5 text-base",
  disable:
    "bg-gray-400 text-white opacity-60 cursor-not-allowed px-6 py-1.5 text-base disabled:hover:bg-gray-300",
  loading:
    "bg-gray-300 text-gray-600 cursor-wait px-6 py-1.5 text-base disabled:hover:bg-gray-300",
} as const;

const LOADING_TEXT = "অপেক্ষা করুন...";

// Main Component
const PurchasePlanButton: React.FC<PurchasePlanButtonProps> = ({
  className = "",
  variant = "primary",
  plan,
  children,
}) => {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // New state for button action loading
  const [activeSubscription, setActiveSubscription] =
    useState<ActiveSubscription | null>(null);

  // Fetch subscription data
  const fetchSubscriptionData = useCallback(async () => {
    if (status === "loading") return;

    try {
      setLoading(true);

      if (status === "authenticated") {
        const response = await fetch("/api/user/subscription");
        const data = response.ok ? await response.json() : null;

        // console.log("subscriptionData result:", data);
        setActiveSubscription(data);
      } else {
        setActiveSubscription(null);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  // Computed values
  const isActivePlan = activeSubscription?.subscriptionPlanId === plan?.id;
  const currentDate = new Date();

  const isExpired = activeSubscription
    ? new Date(activeSubscription.expiresAt) < currentDate
    : false;

  const isCurrentlyOnTrial =
    activeSubscription?.isTrial &&
    activeSubscription?.trialEndsAt &&
    new Date(activeSubscription.trialEndsAt) > currentDate;

  const isTrialExpired =
    activeSubscription?.isTrial &&
    activeSubscription?.trialEndsAt &&
    new Date(activeSubscription.trialEndsAt) < currentDate;

  const hasUsedTrial = !!activeSubscription;

  // Button text logic
  const getButtonText = useCallback(() => {
    if (loading || status === "loading") return LOADING_TEXT;

    // Unauthenticated or no subscription
    if (status === "unauthenticated" || !activeSubscription) {
      return plan?.isTrial ? "ফ্রি ট্রায়াল" : "এখনই কিনুন";
    }

    // Active plan scenarios
    if (isActivePlan) {
      if (isCurrentlyOnTrial) return "ফ্রি ট্রায়াল চলছে";
      if (isExpired || isTrialExpired) return "রিনিউ করুন";
      return "আপনার বর্তমান প্ল্যান";
    }

    // Non-active plan scenarios
    const planDuration = plan?.durationInYears || plan?.durationInMonths;
    const planType = plan?.type === "YEARLY" ? "বছরের" : "মাসের";
    const actionText =
      isExpired || isTrialExpired ? "প্ল্যান পরিবর্তন করুন" : "এখনই কিনুন";

    return `${actionText}`;
  }, [
    loading,
    status,
    activeSubscription,
    plan,
    isActivePlan,
    isCurrentlyOnTrial,
    isExpired,
    isTrialExpired,
  ]);

  // Button state logic
  const isDisabled =
    loading ||
    (isActivePlan && !isExpired && !isTrialExpired) ||
    (plan?.isTrial && hasUsedTrial);

  const getVariantClass = (): keyof typeof BUTTON_VARIANTS => {
    if (loading || actionLoading) return "loading";
    if (isDisabled) return "disable";
    return variant;
  };

  // Handle button click
  const handlePlanAction = useCallback(async () => {
  if (!plan || isDisabled) return;

  try {
    setActionLoading(true); // Show loader immediately

    // Perform API actions sequentially
    await clearServerCart();
    await setServerCart({
      type: "SUBSCRIPTION",
      items: [
        {
          planId: plan.id,
          activeSubscription,
          hasUsedTrial,
        },
      ],
    } as any);

    // Once done, navigate to checkout
    router.push("/checkout");
  } catch (error) {
    console.error("Error handling plan action:", error);
  } finally {
    setActionLoading(false); // Hide loader after navigation attempt
  }
}, [plan, isDisabled, activeSubscription, hasUsedTrial, router]);


  // Render loading spinner
  const LoadingSpinner = ({ text }: { text?: string }) => (
    <div className="flex items-center gap-2 justify-center">
      <Loader className="w-4 h-4 animate-spin" />
      {/* <span>{text || LOADING_TEXT}</span> */}
    </div>
  );

  const baseClasses = "font-medium transition-colors duration-300";
  const buttonClasses = `${baseClasses} ${
    BUTTON_VARIANTS[getVariantClass()]
  } ${className}`;

  return (
    <Button
      onClick={handlePlanAction}
      disabled={isDisabled || loading || actionLoading}
      className={`${buttonClasses} transition-all duration-300 ease-linear`}
      aria-label={getButtonText()}
    >
      {loading || actionLoading ? (
        <LoadingSpinner />
      ) : (
        children || getButtonText()
      )}
    </Button>
  );
};

export default PurchasePlanButton;
