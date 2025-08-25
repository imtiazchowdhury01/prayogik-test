//@ts-nocheck
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";

const PromotionalCardContent = async () => {
  const subscriptions = await getSubscriptionDBCall();

  const premiumSubscription = subscriptions[0];
  return (
    <div className="relative z-10">
      <CardHeader className="pb-2 md:pb-6">
        {/* Card Title */}
        <CardTitle className="text-white text-lg mb-0 ">
          প্রায়োগিক {premiumSubscription?.name || "প্রাইম"}
        </CardTitle>
        {/* Discount Badge */}
        <span className="text-xs bg-teal-600 px-4 py-2 rounded-full inline-block w-fit text-white">
          {premiumSubscription?.name || "প্রাইম"} মেম্বারশিপে{" "}
          {convertNumberToBangla(
            premiumSubscription?.subscriptionDiscount?.discountPercentage
          )}
          % সেভ করুন
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Price */}
        <h3 className="text-4xl font-bold text-[#D1FFA3]">
          ৳{convertNumberToBangla(premiumSubscription?.regularPrice)} / বছর
        </h3>
        {/* Description */}
        <p className="text-sm text-white/80">
          আনলিমিটেড অ্যাক্সেস পাস সব কোর্সে
        </p>
      </CardContent>
    </div>
  );
};

export default PromotionalCardContent;
