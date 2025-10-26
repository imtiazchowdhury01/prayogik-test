"use client";

import { QueryKeys } from "@/constants/query-keys";
import { clientSidefetchUserSubscription } from "@/lib/utils/openai/client/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const UserTrialPlan = ({ trialPlan }: any) => {
  const session = useSession();
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

  return (
    <>
      {activeSubscription?.subscriptionPlan?.isTrial ? (
        <div className="bg-gray-100 rounded-lg py-4 px-6 md:p-3.5 md:px-6 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
          {/* Left Section */}
          <div className="flex items-center sm:items-center gap-2 text-left sm:text-center md:text-left">
            <span className="text-gray-700 text-sm md:text-base leading-snug ">
              আপনি বর্তমানে প্রাইম লাইট প্ল্যানে আছেন।
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UserTrialPlan;
