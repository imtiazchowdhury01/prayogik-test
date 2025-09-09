import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getDefaultSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import React from "react";

const BecomeAProMemberDiscount = async () => {
  const premiumSubscription = await getDefaultSubscriptionDBCall();

  return (
    <span className="text-[#D1FFA3] font-bold">
      {convertNumberToBangla(
        premiumSubscription?.subscriptionDiscount?.discountPercentage || 0
      )}
      % কম খরচে{" "}
    </span>
  );
};

BecomeAProMemberDiscount.Skeleton = () => {
  return (
    <span className="text-[#D1FFA3] font-bold">
      <span className="w-1/3 h-10 bg-gray-400 rounded-md animate-pulse" />% কম
      খরচে{" "}
    </span>
  );
};

export default BecomeAProMemberDiscount;
