//@ts-nocheck
"use client";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKeys } from "@/constants/query-keys";
import { clientSidefetchUserSubscription } from "@/lib/utils/openai/client/user";

interface Subscription {
  id: string;
  subscriptionPlanId?: string;
  expiresAt: string;
  status: string;
  isTrial: boolean;
  trialStartedAt?: string;
  trialEndsAt?: string;
  trialCourseLimit: number;
  trialSelectedCourseIds: string[];
  studentProfileId: string;
  createdAt?: string;
  updatedAt?: string;
}

const HeaderBadge = ({
  isTrialPlan,
  isPopularPlan,
}: {
  isTrialPlan: boolean;
  isPopularPlan: boolean;
}) => {
  const { data: session } = useSession();

  // Fetch user subscription
  const {
    data: subscription,
    error,
    isLoading,
  } = useQuery<Subscription>({
    queryKey: [QueryKeys.USER_SUBSCRIPTION],
    queryFn: clientSidefetchUserSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!session,
  });

  // Determine which badge to show
  const shouldShowBadge = subscription?.isTrial ? isPopularPlan : isTrialPlan;

  if (shouldShowBadge) {
    return (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <span className="bg-secondary-button text-white px-2.5 py-0.5 rounded text-xs font-semibold">
          রেকমেন্ডেড
        </span>
      </div>
    );
  }

  return null;
};

export default HeaderBadge;
