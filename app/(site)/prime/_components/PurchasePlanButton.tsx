"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { useSession } from "next-auth/react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

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
  disabled:
    "bg-gray-400 hover:bg-gray-400 text-white opacity-60 cursor-not-allowed px-6 py-1.5 text-base",
  loading: "bg-gray-300 text-gray-600 cursor-wait px-6 py-1.5 text-base",
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
    if (loading) return "loading";
    if (isDisabled) return "disabled";
    return variant;
  };

  // Handle button click
  const handlePlanAction = useCallback(async () => {
    if (!plan || isDisabled) return;

    try {
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

      router.push("/checkout");
    } catch (error) {
      console.error("Error handling plan action:", error);
    }
  }, [plan, isDisabled, activeSubscription, hasUsedTrial, router]);

  // Render loading spinner
  const LoadingSpinner = () => (
    <div className="flex items-center gap-2">
      {/* <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> */}
      <span>{getButtonText()}</span>
    </div>
  );

  const baseClasses = "font-medium transition-colors duration-300";
  const buttonClasses = `${baseClasses} ${
    BUTTON_VARIANTS[getVariantClass()]
  } ${className}`;

  return (
    <Button
      onClick={handlePlanAction}
      disabled={isDisabled || loading}
      className={buttonClasses}
    >
      {loading ? <LoadingSpinner /> : children || getButtonText()}
    </Button>
  );
};

export default PurchasePlanButton;
