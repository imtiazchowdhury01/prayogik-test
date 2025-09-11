import React, { JSX } from "react";
import { Button } from "@/components/ui/button";
import { formatDateToBangla } from "@/lib/utils/stringUtils";
import { Info, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { Suspense } from "react";
import MessageClose from "./message-close";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

// Main subscription message component
const SubscriptionMessageContent = async (): Promise<JSX.Element | null> => {
  const SubscriptionResponse = await clientApi.getUserSubscriptions({
    extraHeaders: { Cookie: cookies().toString() },
  });

  const subscription = SubscriptionResponse?.body as any;
  // console.log("subscription result:", subscription);

  // Early return for inactive subscriptions or active non-trial
  if (
    !subscription?.status ||
    subscription.status === "INACTIVE" ||
    (subscription.status === "ACTIVE" && !subscription.isTrial)
  ) {
    return null;
  }

  const isExpired: boolean = subscription.status === "EXPIRED";
  const remainingDays: number = subscription.expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.expiresAt).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const getMessage = (): string => {
    if (isExpired) {
      return `আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে ${
        subscription.expiresAt
          ? formatDateToBangla(new Date(subscription.expiresAt))
          : ""
      }। সকল কোর্সের ফ্রি এক্সেস পেতে অনুগ্রহ করে সাবস্ক্রাইব করুন।`;
    }
    return `আপনার ট্রায়াল সাবস্ক্রিপশন চলছে। আপনার সাবস্ক্রিপশন আর ${convertNumberToBangla(
      remainingDays
    )} দিন বাকি রয়েছে।`;
  };

  const getButtonText = (): string => {
    return isExpired && subscription.type === "Trial"
      ? "রিনিউ করুন"
      : "প্ল্যান আপগ্রেড করুন";
  };

  return (
    <div
      id="subscription-message"
      className={` ${
        isExpired
          ? "bg-[#FFF3F3] border-[#FFC4C2]"
          : "bg-[#FFFAF2] border-[#FFCB7F]"
      }   t flex items-center justify-between gap-4 p-4 rounded-lg border text-primary mt-2`}
    >
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          {isExpired ? (
            <Info className={` text-[#FF140C] w-4 h-4 `} />
          ) : (
            <TriangleAlert className={` w-4 h-4 text-secondary-button`} />
          )}

          <span
            className={`${
              isExpired ? "text-[#FF140C]" : " text-secondary-button"
            } mt-1`}
          >
            {getMessage()}
          </span>
        </div>
        <Link href="/prime">
          <Button
            className={`${
              isExpired
                ? "bg-[#FF140C] hover:bg-[#FF140C]"
                : " bg-secondary-button hover:bg-secondary-button"
            }  h-9 text-sm font-medium transition-all duration-300  hover:opacity-85 text-white text-nowrap`}
          >
            {getButtonText()}
          </Button>
        </Link>
      </div>
      <MessageClose />
    </div>
  );
};

// Main component with Suspense wrapper
const DashboardSubscriptionMessage = (): JSX.Element => {
  return (
    <Suspense fallback={null}>
      <SubscriptionMessageContent />
    </Suspense>
  );
};

export default DashboardSubscriptionMessage;
