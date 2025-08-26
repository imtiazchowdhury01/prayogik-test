//@ts-nocheck
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import PurchasePlanButton from "./PurchasePlanButton";


interface SubscriptionPlan {
  id: string;
  name: string;
  regularPrice: number;
  offerPrice?: number;
  durationInYears: number;
  isDefault: boolean;
  isTrial: boolean;
  trialDurationInDays?: number;
  type?: "YEARLY" | "MONTHLY";
  durationInMonths?: number;
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  features: string[];
  index: number;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  features,
  index
}) => {
  return (
    <div className="relative">
      {plan.isDefault && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-brand text-white px-2.5 py-0.5 rounded text-xs font-semibold">
            জনপ্রিয়
          </span>
        </div>
      )}
      <Card
        className={`h-full ${
          plan.isDefault
            ? "border border-brand shadow-lg"
            : "border border-gray-200"
        }`}
      >
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="text-xs mb-2 font-medium">
              <span>প্রাইম</span>
              {plan?.offerPrice > 0 && (
                <span className="ml-2 text-[#FF6709] text-xs bg-[#FFF5E6] rounded w-fit px-1.5 py-0.5">
                  অফার চলছে
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              {plan?.offerPrice > 0 ? (
                <>
                  <span className="text-2xl sm:text-[2rem] font-bold text-gray-900">
                    ৳{convertNumberToBangla(plan.offerPrice)}
                  </span>
                  <span className="text-md sm:text-lg font-normal text-gray-400 line-through">
                    ৳{convertNumberToBangla(plan.regularPrice)}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-[2rem] font-bold text-gray-900">
                  ৳{convertNumberToBangla(plan.regularPrice)}
                </span>
              )}
            </div>
            <div className="text-gray-600 text-base font-normal">
              {convertNumberToBangla(plan.durationInYears)} বছরের প্ল্যান
            </div>
          </div>

          {/* Client component handles all data fetching and logic */}
          <PurchasePlanButton className="w-full mb-6" plan={plan} />

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">ফীচার</h3>
              <p className="text-sm text-gray-700">
                আমাদের {convertNumberToBangla(plan?.durationInYears)} বছর
                প্ল্যানের কোর্স গুলো পান
              </p>
            </div>
            {/* feature list */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 border border-brand bg-transparent rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-primary-brand" />
                </div>
                <span className="text-sm text-gray-700">সময়কাল {convertNumberToBangla(plan?.durationInYears)} বছর</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 border border-brand bg-transparent rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-primary-brand" />
                </div>
                <span className="text-sm text-gray-700">
                  সব স্ট্যান্ডার্ড কোর্সে ৭০% ডিসকাউন্ট
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 border border-brand bg-transparent rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-primary-brand" />
                </div>
                <span className="text-sm text-gray-700">
                  সব প্রাইম কোর্স ফ্রি
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlanCard;
