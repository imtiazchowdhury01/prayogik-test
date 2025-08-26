"use client";

import { Button } from "@/components/ui/button";
import { useAuthAndSubscription } from "@/hooks/use-subscription-provider";
import { fa } from "@faker-js/faker";
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
    } = useAuthAndSubscription();

    // Move useMemo to the top level - always called
    const buttonConfig = useMemo(() => {
      // If user is not authenticated, return default config
      if (!isUserAuthenticated || !userId) {
        return {
          text: "সাবস্ক্রাইব করুন",
          shouldShow: true,
          renderType: "unauthenticated" as const,
        };
      }

      // If user is authenticated but data is still loading
      if (isSessionLoading || isSubscriptionDataLoading || !subscriptionData) {
        return {
          text: "সাবস্ক্রাইব করুন",
          shouldShow: true,
          renderType: "loading" as const,
        };
      }

      // If no user subscription data, show subscribe button
      if (!subscriptionData?.userSubscription) {
        return {
          text: "সাবস্ক্রাইব করুন",
          shouldShow: true,
          renderType: "normal" as const,
        };
      }

      const status = subscriptionData.userSubscription
        .status as SubscriptionStatus;

      switch (status) {
        case "EXPIRED":
          return {
            text: "রিনিউ করুন",
            shouldShow: variant === "expired" ? false : true,
            renderType: "normal" as const,
          };
        case "ACTIVE":
          return {
            text: "",
            shouldShow: false,
            renderType: "normal" as const,
          };
        case "INACTIVE":
          return {
            text: "",
            shouldShow: false,
            renderType: "normal" as const,
          };
        case "PENDING":
          return {
            text: "সাবস্ক্রাইব করুন",
            shouldShow: true,
            renderType: "normal" as const,
          };
        default:
          return {
            text: "সাবস্ক্রাইব করুন",
            shouldShow: true,
            renderType: "normal" as const,
          };
      }
    }, [
      subscriptionData,
      variant,
      isUserAuthenticated,
      userId,
      isSessionLoading,
      isSubscriptionDataLoading,
    ]);

    const handleSubscriptionClick = () => {
      scroller.scrollTo("subscriptions", {
        duration: 800,
        delay: 0,
        offset: -100,
      });
    };

    // Don't render if button shouldn't be shown
    if (!buttonConfig.shouldShow) {
      return null;
    }

    // Render based on the computed render type
    if (buttonConfig.renderType === "unauthenticated") {
      return (
        <Button
          onClick={handleSubscriptionClick}
          className={`
            bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] 
            text-white p-3 text-wrap lg:p-6 rounded-[6px] 
            hover:opacity-90 text-[16px] font-semibold 
            not-italic transition-opacity duration-200
            ${className}
          `}
        >
          {buttonConfig.text}
        </Button>
      );
    }

    if (buttonConfig.renderType === "loading") {
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
          <span className="flex items-center gap-2">{buttonConfig.text}</span>
        </Button>
      );
    }

    // Normal authenticated state with data loaded
    return (
      <Button
        onClick={handleSubscriptionClick}
        className={`
          bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] 
          text-white p-3 text-wrap lg:p-6 rounded-[6px] 
          hover:opacity-90 text-[16px] font-semibold 
          not-italic transition-opacity duration-200
          ${className}
        `}
      >
        {buttonConfig.text}
      </Button>
    );
  }
);

export default PrimeSubscriptionButton;
