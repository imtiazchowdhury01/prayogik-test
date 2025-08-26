//@ts-nocheck
import FireIcon from "../_utils/FireIcon";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import SubscriptionPlanCard from "./SubscriptionPlanCard";
import { SubscriptionPlan } from "@prisma/client";
import PurchasePlanButton from "./PurchasePlanButton";
import { RefreshCcw } from "lucide-react";

const features: string[] = [
  "সময়কাল ২ বছর",
  "সব স্ট্যান্ডার্ড কোর্সে ৭০% ডিসকাউন্ট",
  "সব প্রাইম কোর্স ফ্রি",
];

export default async function SubscriptionPlans(): Promise<JSX.Element> {
  const plans: SubscriptionPlan[] = await getSubscriptionDBCall();
  // Separate trial plan from regular plans
  const trialPlan: SubscriptionPlan | undefined = plans.find(
    (plan) => plan.isTrial
  );
  const regularPlans: SubscriptionPlan[] = plans.filter(
    (plan) => !plan.isTrial
  );

  return (
    <div className="md:max-w-4xl max-w-7xl px-6 xl:px-0 mx-auto">
      {/* Regular subscription plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {regularPlans.map((plan: SubscriptionPlan, index) => (
          <SubscriptionPlanCard
            key={plan.id}
            index={index}
            plan={plan}
            features={features}
          />
        ))}
      </div>

      {/* Trial plan */}
      {trialPlan && (
        <div className="bg-gray-100 rounded-lg py-4 px-6 md:p-3.5 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-start sm:items-center gap-2 text-left sm:text-center md:text-left">
            <FireIcon className="shrink-0" />
            <span className="text-gray-700 text-sm md:text-base leading-snug ">
              {trialPlan.trialDurationInDays &&
                convertNumberToBangla(trialPlan.trialDurationInDays)}{" "}
              দিনের জন্য ফ্রি। আজকেই আপনার জার্নি শুরু করুন।
            </span>
          </div>

          {/* Right Section */}
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <PurchasePlanButton
              className="md:w-auto w-full"
              variant="secondary"
              plan={trialPlan}
            >
              <span className="text-nowrap text-base">ফ্রি ট্রায়াল</span>
            </PurchasePlanButton>
          </div>
        </div>
      )}
    </div>
  );
}
