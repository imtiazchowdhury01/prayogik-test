"use client";
import { formatDateToBangla } from "@/lib/utils/stringUtils";
import PrimeSubscriptionButton from "./PrimeSubscriptionButton";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { memo, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthAndSubscriptionState } from "@/hooks/use-subscription-and-subscription-state";

interface SubscriptionInfo {
  name: string;
  discountPercentage: string;
  price: string;
  rawData?: any;
}

interface PrimeHeroCtaProps {
  subscriptionInfo: SubscriptionInfo;
}

const PrimeHeroCta = memo(({ subscriptionInfo }: PrimeHeroCtaProps) => {
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

  // Memoize computed states to prevent unnecessary recalculations
  const computedStates = useMemo(() => {
    // If subscriptionData is null, return default states
    if (subscriptionData === null) {
      return {
        expiredDate: null,
        isSubscribed: false,
        isExpired: false,
        isInactive: false,
        hasSubscriptionData: false,
      };
    }

    const expiredDate = subscriptionData?.userSubscription?.expiresAt
      ? formatDateToBangla(
          new Date(subscriptionData.userSubscription.expiresAt)
        )
      : null;

    const userStatus = subscriptionData?.userSubscription?.status;

    return {
      expiredDate,
      isSubscribed: userStatus === "ACTIVE",
      isExpired: userStatus === "EXPIRED",
      isInactive: userStatus === "INACTIVE",
      hasSubscriptionData: !!subscriptionData,
    };
  }, [subscriptionData]);

  const { expiredDate, isSubscribed, isInactive, hasSubscriptionData } =
    computedStates;

  return (
    <>
      <div className="flex flex-row justify-between items-center md:justify-start gap-6 lg:gap-14 mt-4 md:mt-4 xl:mt-10 lg:mt-6 bg-teal-500/25 w-full md:w-fit p-4 lg:p-6 rounded-lg">
        <div className="text-white">
          <p className="text-3xl font-semibold text-nowrap">
            ৳{subscriptionInfo.price} / বছর
          </p>

          {/* message section */}
          {(isSubscribed || isInactive) && (
            <p className="lg:text-sm md:text-[.75rem] text-sm text-left mt-3 text-[#D1FFA3] bg-[#d1ffa326] p-[.2rem] lg:p-[.5rem] rounded">
              <span>*</span>
              {isSubscribed && (
                <span>
                  আপনার সাবস্ক্রিপশন {expiredDate} তারিখ পর্যন্ত সক্রিয় থাকবে।
                </span>
              )}
              {isInactive && (
                <span>
                  সাবস্ক্রিপশন সাময়িকভাবে স্থগিত করা হয়েছে। অনুগ্রহপূর্বক
                  সাপোর্ট এ যোগাযোগ করুন।
                </span>
              )}
            </p>
          )}
        </div>

        {/* {(!isSubscribed || isExpired) && ( */}
        <PrimeSubscriptionButton
          variant={isExpired ? "expired" : "default"}
          className=""
        />
        {/* )} */}
      </div>

      {/* renew message section */}
      {isExpired ? (
        <p className="text-sm text-left mt-4 text-[#D1FFA3]">
          <span>*আপনার সাবস্ক্রিপশনের মেয়াদ শেষ {expiredDate}</span>
        </p>
      ) : (
        !isSubscribed && (
          <p className="text-sm text-left mt-4 text-[#D1FFA3]">
            সকল {subscriptionInfo.name} কোর্স ফ্রি | সকল স্ট্যান্ডার্ড কোর্সে{" "}
            {subscriptionInfo.discountPercentage}% ডিসকাউন্ট
          </p>
        )
      )}
    </>
  );
});

export default PrimeHeroCta;
