import PrimeBkashManualPayment from "@/components/PrimeBkashManualPayment";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatDateToBangla } from "@/lib/utils/stringUtils";
import { BkashManualPaymentType } from "@prisma/client";
import { useMemo } from "react";

const SubscriptionCard = ({
  subscription,
  userSubscription,
  paymentStatus,
  userId,
}: // shouldShowStaticCard,
any) => {
  // Memoize expensive calculations
  const computedData = useMemo(() => {
    const isSubscribed = userSubscription?.status === "ACTIVE";
    const isExpired = userSubscription?.status === "EXPIRED";
    const isInactive = userSubscription?.status === "INACTIVE";

    const expiredDate = userSubscription?.expiresAt
      ? formatDateToBangla(new Date(userSubscription.expiresAt))
      : "";

    return {
      isSubscribed,
      isExpired,
      isInactive,
      expiredDate,
    };
  }, [subscription, userSubscription]);

  const { isSubscribed, isExpired, isInactive, expiredDate } = computedData;

  // Memoize text elements
  const textElements = useMemo(() => {
    const expiredTextElement = (
      <p className="text-sm text-center mt-3 text-gray-500">
        আপনার সাবস্ক্রিপশনের মেয়াদ শেষ {expiredDate}
      </p>
    );

    const renewTextElement = (
      <p className="text-sm text-center mt-3 text-gray-500">
        আপনার সাবস্ক্রিপশন {expiredDate} তারিখ পর্যন্ত সক্রিয় থাকবে।
      </p>
    );

    const inactiveTextElement = (
      <div>
        <p
          className="text-sm text-center mt-1 rounded text-red-500 border-red-400 border-dashed border-2 p-2"
          style={{ background: "rgb(239 68 68 / 2%)" }}
        >
          সাবস্ক্রিপশন সাময়িকভাবে স্থগিত করা হয়েছে। অনুগ্রহপূর্বক সাপোর্ট এ
          যোগাযোগ করুন।
        </p>
        {expiredTextElement}
      </div>
    );

    return { expiredTextElement, renewTextElement, inactiveTextElement };
  }, [expiredDate]);

  const getButtonSubTextSwitch = () => {
    switch (userSubscription?.status) {
      case "ACTIVE":
        return textElements.renewTextElement;
      case "INACTIVE":
        return textElements.inactiveTextElement;
      case "EXPIRED":
        return textElements.expiredTextElement;
      default:
        return null;
    }
  };

  const isInactiveText = `সাবস্ক্রিপশন ইনএক্টিভ আছে।`;

  return (
    <div
      className={` ${
        userId ? "shadow-lg" : "shadow-custom"
      } rounded-lg relative w-full ml-0 md:ml-0`}
    >
      <PrimeBkashManualPayment
        subscriptionId={subscription?.id!}
        cardTitle={subscription?.name || "সাবস্ক্রিপশন"}
        displayPrice={`${convertNumberToBangla(subscription?.price)} / বছর`}
        price={subscription?.price}
        cardClassName="border-2 border-blue-500 p-10 text-white m-[1.5px] border-none"
        cardHeaderClassName="px-0 py-0"
        cardContentClassName={` ${!userId && "pb-0"} px-0 space-y-4`}
        showRecaptcha={process.env.NODE_ENV === "production"}
        preview={isSubscribed || isInactive}
        labels={{
          clickToEnter: isSubscribed
            ? "সাবস্ক্রাইবড"
            : isExpired
            ? "রিনিউ করুন"
            : isInactive
            ? isInactiveText
            : "সাবস্ক্রাইব করুন",
        }}
        type={BkashManualPaymentType.SUBSCRIPTION}
        buttonSubmitTailwindcss={
          isExpired
            ? "bg-orange-50 text-orange-500 border-orange-500 hover:bg-orange-100 hover:text-orange-600"
            : ""
        }
        buttonSubText={getButtonSubTextSwitch()}
        paymentStatus={isExpired ? "" : paymentStatus}
        title={subscription?.name}
        subscriptionDiscountPercentage={subscription?.discountPercentage}
        userId={userId}
      />
    </div>
  );
};

export default SubscriptionCard;
