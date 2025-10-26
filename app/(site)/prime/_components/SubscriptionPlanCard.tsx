// @ts-nocheck
import { Check } from "lucide-react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import PurchasePlanButton from "./PurchasePlanButton";
import HeaderBadge from "./HeaderBadge";
import { SubscriptionPlan } from "@prisma/client";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  features: string[];
  trailFeatures: string[];
  index: number;
  courseLimit: number;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  features,
  trailFeatures,
  index,
  courseLimit,
}) => {
  // const isTrialPlan = plan?.type === "NONE";
  const isTrialPlan = plan?.trialCourseLimit > 0;
  const isPopularPlan = plan.isDefault && !isTrialPlan;
  const hasOffer = plan?.offerPrice > 0;
  const discountPercentage = plan?.subscriptionDiscount?.discountPercentage;
  courseLimit = plan?.trialCourseLimit || courseLimit;

  // Price display component
  const PriceDisplay = () => {
    const textColor = isTrialPlan ? "text-white" : "text-gray-900";

    if (hasOffer) {
      return (
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-[2rem] font-bold ${textColor}`}>
            ৳{convertNumberToBangla(plan.offerPrice)}
          </span>
          <span className="text-md sm:text-lg font-normal text-gray-400 line-through">
            ৳{convertNumberToBangla(plan.regularPrice)}
          </span>
        </div>
      );
    }

    return (
      <span className={`text-2xl sm:text-[2rem] font-bold ${textColor}`}>
        ৳{convertNumberToBangla(plan.regularPrice)}
      </span>
    );
  };

  // Feature item component
  const FeatureItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 border border-brand bg-transparent rounded-full flex items-center justify-center mt-0.5">
        <Check className="w-3 h-3 text-primary-brand" />
      </div>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  );

  const cardBorderClass = isTrialPlan
    ? "border border-brand shadow-lg"
    : "border border-gray-200";

  const headerBgClass = isTrialPlan ? "bg-brand text-white rounded-t-lg" : "";

  const planNameTextColor = isTrialPlan ? "text-white" : "text-gray-600";

  const daysOrYears = isTrialPlan
    ? plan.trialDurationInDays > 1
      ? `${convertNumberToBangla(plan.trialDurationInDays)} দিন`
      : `${convertNumberToBangla(plan.durationInYears)} বছর`
    : `${convertNumberToBangla(plan.durationInYears)} বছর`;

  return (
    <div className="relative">
      <HeaderBadge isTrialPlan={isTrialPlan} isPopularPlan={isPopularPlan} />

      <div className={`h-full rounded-lg shadow-md ${cardBorderClass}`}>
        {/* Header */}
        <div className={`p-6 ${headerBgClass}`}>
          <div className="mb-6">
            <div className="text-xl mb-2 font-medium">
              <span>{plan.name}</span>
              {hasOffer && (
                <span className="ml-2 text-[#FF6709] text-xs bg-[#FFF5E6] rounded w-fit px-1.5 py-0.5">
                  অফার চলছে
                </span>
              )}
            </div>

            <PriceDisplay />

            {/* <div className={`${planNameTextColor} text-base font-normal`}>
              {plan.name}
            </div> */}
          </div>

          <PurchasePlanButton
            className="w-full"
            plan={plan}
            variant={isTrialPlan ? "trial" : "primary"}
          />
        </div>

        <div className="h-[1px] w-full bg-[#E6E8E8]" />

        {/* Features Section */}
        <div className="space-y-4 p-6">
          <div>
            <h3 className="font-semibold text-gray-900">ফীচার</h3>
            <p className="text-sm text-gray-700">
              {isTrialPlan
                ? "কোর্সের মান যাচাই করার সুযোগ নিন"
                : "প্রাইমের অধীন সব কোর্স ফ্রি অ্যাক্সেস"}
            </p>
          </div>

          <div className="space-y-3">
            {courseLimit > 0 && (
              <FeatureItem>
                যে কোন {convertNumberToBangla(courseLimit)}টি কোর্স
              </FeatureItem>
            )}

            <FeatureItem>সময়কাল {daysOrYears}</FeatureItem>

            {!isTrialPlan && discountPercentage > 0 && (
              <FeatureItem>
                সব স্ট্যান্ডার্ড কোর্সে{" "}
                {convertNumberToBangla(discountPercentage)}% ডিসকাউন্ট
              </FeatureItem>
            )}

            {courseLimit <= 0 && (
              <FeatureItem>সব প্রাইম কোর্স ফ্রি</FeatureItem>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;
