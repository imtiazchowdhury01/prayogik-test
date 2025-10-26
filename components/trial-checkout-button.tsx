"use client";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import React from "react";
import { Button } from "./ui/button";
import { trialPlanStaticData } from "@/constants/trial-plan";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import { clientSidefetchUserSubscription } from "@/lib/utils/openai/client/user";

type TrialCheckoutButtonProps = {
  variant?:
    | "default"
    | "primary"
    | "primaryOutline"
    | "transparent"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success"
    | "disabled"
    | null
    | undefined;
  size: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
  children: React.ReactNode;
  trialPlan: any;
  subTextNode?: React.ReactNode;
};

const TrialCheckoutButton = ({
  trialPlan,
  variant,
  size,
  className,
  children,
  subTextNode,
}: TrialCheckoutButtonProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const plan = trialPlan || trialPlanStaticData;

  const {
    data: activeSubscription,
    error,
    isLoading: loading,
  } = useQuery<any>({
    queryKey: [QueryKeys.USER_SUBSCRIPTION],
    queryFn: clientSidefetchUserSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes — don't refetch unless stale
    enabled: !!session,
  });

  // Computed values
  const isActivePlan = activeSubscription?.subscriptionPlanId === plan?.id;
  const currentDate = new Date();

  const isExpired = activeSubscription
    ? new Date(activeSubscription.expiresAt) < currentDate
    : false;

  const isCurrentlyOnTrial =
    activeSubscription?.subscriptionPlan?.isTrial &&
    activeSubscription?.trialEndsAt &&
    new Date(activeSubscription.trialEndsAt) > currentDate;

  const isTrialExpired =
    activeSubscription?.subscriptionPlan?.isTrial &&
    activeSubscription?.trialEndsAt &&
    new Date(activeSubscription.trialEndsAt) < currentDate;

  const hasUsedTrial = !!activeSubscription?.id;

  const isDisabled =
    loading ||
    (isActivePlan && !isExpired && !isTrialExpired) ||
    (plan?.isTrial && hasUsedTrial);

  const handleTrialCheckout = async (): Promise<void> => {
    // Clear existing cart
    await clearServerCart();

    // Set trial plan in cart
    await setServerCart({
      type: "SUBSCRIPTION",
      items: [
        {
          planId: plan?.id,
        },
      ],
    } as any);

    // Navigate to checkout
    router.push("/checkout");
  };

  // if (isCurrentlyOnTrial) return null;
  // if (isDisabled) return null;

  return (
    <>
      <Button
        variant={variant}
        disabled={isCurrentlyOnTrial || isDisabled}
        size={size}
        className={className}
        onClick={handleTrialCheckout}
      >
        {children}
      </Button>

      {subTextNode ? subTextNode : null}
    </>
  );
};

export default TrialCheckoutButton;
