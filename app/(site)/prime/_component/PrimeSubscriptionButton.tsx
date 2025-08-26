"use client";

import { Button } from "@/components/ui/button";
import { useAuthAndSubscriptionState } from "@/hooks/use-subscription-and-subscription-state";
import { memo, useMemo } from "react";
import { scroller } from "react-scroll";

interface PrimeSubscriptionButtonClientProps {
  variant?: "default" | "expired";
  className?: string;
}

type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "INACTIVE" | "PENDING";

const PrimeSubscriptionButton = memo(
  ({
    variant = "default",
    className = "",
  }: PrimeSubscriptionButtonClientProps) => {
    const {
      userId,
      isSessionLoading,
      isSubscriptionDataLoading,
      isUserAuthenticated,
      isExpired,
      hasActiveSubscription,
      subscriptionData,
    } = useAuthAndSubscriptionState();

    const shouldShowStaticCard =
      isSessionLoading || !userId || isSubscriptionDataLoading;

    const buttonConfig = useMemo(() => {
      // If data is still loading or not available, return loading state
      if (shouldShowStaticCard || !subscriptionData) {
        return { text: "", shouldShow: false, isLoading: true };
      }

      // If no user subscription data, show subscribe button
      if (!subscriptionData?.userSubscription) {
        return { text: "সাবস্ক্রাইব করুন", shouldShow: true, isLoading: false };
      }

      const status = subscriptionData.userSubscription
        .status as SubscriptionStatus;

      switch (status) {
        case "EXPIRED":
          return {
            text: variant === "expired" ? "রিনিউ করুন" : "",
            shouldShow: variant === "expired",
            isLoading: false,
          };
        case "ACTIVE":
        case "INACTIVE":
        case "PENDING":
          return {
            text: "সাবস্ক্রাইব করুন",
            shouldShow: true,
            isLoading: false,
          };
        default:
          return {
            text: "সাবস্ক্রাইব করুন",
            shouldShow: true,
            isLoading: false,
          };
      }
    }, [subscriptionData, shouldShowStaticCard, variant]);

    const handleSubscriptionClick = () => {
      scroller.scrollTo("subscriptions", {
        duration: 800,
        delay: 0,
        offset: -100,
      });
    };

    // Show loading state while data is being fetched
    if (buttonConfig.isLoading) {
      return (
        <Button
          disabled={true}
          className={`
          bg-gray-400 text-gray-600 cursor-not-allowed opacity-50
          p-3 text-wrap lg:p-6 rounded-[6px]
          text-[16px] font-semibold not-italic
          ${className}
        `}
        >
          <span className="flex items-center gap-2">সাবস্ক্রাইব করুন</span>
        </Button>
      );
    }

    // Don't render if button shouldn't be shown
    if (!buttonConfig.shouldShow) {
      return null;
    }

    return (
      <Button
        onClick={handleSubscriptionClick}
        disabled={buttonConfig.isLoading}
        className={`
        bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] 
        text-white p-3 text-wrap lg:p-6 rounded-[6px] 
        hover:opacity-90 text-[16px] font-semibold 
        not-italic transition-opacity duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      >
        {buttonConfig.text}
      </Button>
    );
  }
);

export default PrimeSubscriptionButton;
