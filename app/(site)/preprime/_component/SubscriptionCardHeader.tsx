import { CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

interface SubscriptionHeaderProps {
  title?: string;
  displayPrice?: string | number;
  subscriptionInfo?: {
    name?: string;
    price?: string | number;
  };
  showSubscribeButton?: boolean;
  className?: string;
  cardHeaderClassName?: string;
  isSubscriptionDataLoading?: boolean;
  isUserAuthenticated?: boolean; // Add this prop to know if user is authenticated
}

export function SubscriptionCardHeader({
  title,
  displayPrice,
  subscriptionInfo,
  showSubscribeButton = false,
  className,
  cardHeaderClassName,
  isSubscriptionDataLoading = false,
  isUserAuthenticated = false,
}: SubscriptionHeaderProps) {
  // Safely get the price value with fallback to 0 if undefined
  const getPriceValue = () => {
    const price = displayPrice ?? subscriptionInfo?.price;
    return price !== undefined ? price.toString() : "0";
  };

  // Show loading only if user is authenticated AND subscription data is loading
  const shouldShowLoading = isUserAuthenticated && isSubscriptionDataLoading;

  const renderContent = () => (
    <>
      {title || subscriptionInfo?.name ? (
        <h3
          className={cn(
            "text-xl bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text text-transparent font-medium mb-2",
            !showSubscribeButton && "text-lg"
          )}
        >
          {title || subscriptionInfo?.name}
        </h3>
      ) : null}

      <p className="text-gray-600 text-base">বার্ষিক সাবস্ক্রিপশন</p>

      {(displayPrice || subscriptionInfo?.price) && (
        <div
          className={cn(
            "flex justify-center items-center gap-1 text-[32px] font-semibold text-[#414B4A]",
            showSubscribeButton && "mb-2"
          )}
        >
          <span>৳{convertNumberToBangla(getPriceValue())} / বছর</span>
        </div>
      )}

      {showSubscribeButton && (
        <Link
          href={shouldShowLoading ? "#" : "/signin"}
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-12 w-full rounded-md transition-opacity text-base font-semibold flex items-center justify-center",
            shouldShowLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
              : "bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] hover:from-[#FF3A4D] hover:to-[#FF8538] text-white hover:opacity-90"
          )}
          aria-disabled={shouldShowLoading}
          onClick={(e) => shouldShowLoading && e.preventDefault()}
        >
          {shouldShowLoading ? (
            <span className="flex items-center">সাবস্ক্রাইব করুন</span>
          ) : (
            "সাবস্ক্রাইব করুন"
          )}
        </Link>
      )}
    </>
  );

  return showSubscribeButton ? (
    <CardContent className={cn("p-6 text-center", className)}>
      {renderContent()}
    </CardContent>
  ) : (
    <CardHeader
      className={cn(cardHeaderClassName, "p-0 space-y-0 text-center")}
    >
      {renderContent()}
    </CardHeader>
  );
}
