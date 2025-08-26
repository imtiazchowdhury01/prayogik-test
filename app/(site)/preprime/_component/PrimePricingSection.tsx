"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import SubscriptionCard from "./SubscriptionCard";
import { useAuthAndSubscription } from "@/hooks/use-subscription-provider";

// Types
interface SubscriptionInfo {
  name: string;
  price: number;
  discountPercentage: number;
}

interface PrimePricingSectionProps {
  subscriptionInfo: SubscriptionInfo;
}

const BenefitsCard = ({
  subscriptionInfo,
  hasActiveSubscription,
  userId,
}: {
  subscriptionInfo: SubscriptionInfo;
  hasActiveSubscription: boolean;
  userId?: string;
}) => {
  const cardClasses = userId
    ? "shadow-none border-0"
    : "[box-shadow:0px_4px_12px_rgba(1,15,14,0.08)] border border-gray-100 rounded-lg overflow-hidden bg-white h-fit align-middle";

  return (
    <Card className={cardClasses}>
      <CardContent className="p-0 px-8">
        <div
          className={`${
            !hasActiveSubscription && userId
              ? "justify-start"
              : "justify-center"
          } mt-4 flex items-center`}
        >
          <Image
            src="/images/prime/prime-icon.webp"
            alt="Prime Icon"
            width={70}
            height={70}
            className="object-contain"
            priority
            sizes="70px"
            quality={75}
          />
        </div>

        <h3 className="text-2xl font-semibold text-[#414B4A] my-2 mt-4">
          প্রাইমের সাথে যা থাকছে
        </h3>

        <ul className="text-base text-left text-gray-900 space-y-1 pb-5 list-disc list-inside">
          <li>সকল {subscriptionInfo.name} কোর্স ফ্রি</li>
          <li>
            সকল স্ট্যান্ডার্ড কোর্সে {subscriptionInfo.discountPercentage}%
            ডিসকাউন্ট।
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

const SectionHeader = () => (
  <header className="text-center mb-8">
    <h1 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-4">
      সাবস্ক্রিপশন নির্বাচন করুন
    </h1>
    <p className="text-gray-600">
      আপনার প্রয়োজন ও বাজেট অনুযায়ী সঠিক সাবস্ক্রিপশন নির্বাচন করুন আজই।
    </p>
  </header>
);

// Main component
const PrimePricingSection = ({
  subscriptionInfo,
}: PrimePricingSectionProps) => {
  // console.log("subscriptionInfo result:", subscriptionInfo);

  const {
    userId,
    isSessionLoading,
    isSubscriptionDataLoading,
    isUserAuthenticated,
    isExpired,
    hasActiveSubscription,
    subscriptionData,
  } = useAuthAndSubscription();

  // Determine which card to render
  const renderSubscriptionCard = () => {
    const shouldShowStaticCard =
      isSessionLoading || !userId || isSubscriptionDataLoading;

    return (
      <SubscriptionCard
        subscription={subscriptionInfo}
        userSubscription={subscriptionData?.userSubscription}
        paymentStatus={subscriptionData?.paymentStatus}
        shouldShowStaticCard={shouldShowStaticCard}
        userId={userId}
      />
    );
  };

  // Dynamic grid classes based on subscription status
  const gridContainerClasses = `${
    isExpired || !hasActiveSubscription ? "max-w-3xl" : "max-w-2xl"
  } grid sm:grid-cols-2 grid-cols-1 gap-8 mx-auto items-center`;

  return (
    <section
      id="subscriptions"
      className="pt-8 pb-16 px-4 relative bg-[url('/images/prime/pricing-bg.webp')] bg-cover bg-center"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader />

        <div className={gridContainerClasses}>
          {renderSubscriptionCard()}

          <BenefitsCard
            subscriptionInfo={subscriptionInfo}
            hasActiveSubscription={hasActiveSubscription}
            userId={userId!}
          />
        </div>
      </div>
    </section>
  );
};

export default PrimePricingSection;
