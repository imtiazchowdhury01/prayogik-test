// //@ts-nocheck
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import BuyNowButton from "./BuyNowButton";

// const SubscriptionCard = ({
//   plan,
//   activeSubscription,
//   hasUsedTrial = false,
// }) => {
//   const isActivePlan = activeSubscription?.subscriptionPlanId === plan.id;
//   const isExpired =
//     activeSubscription && new Date(activeSubscription.expiresAt) < new Date();
//   // console.log("activeSubscription result:", activeSubscription);
//   const isTrial =
//     activeSubscription?.isTrial &&
//     new Date(activeSubscription.trialEndsAt).getTime() ===
//       new Date(activeSubscription.expiresAt).getTime();
//   const isTrialExpired =
//     isTrial && new Date(activeSubscription.trialEndsAt) < new Date();

//   const getButtonText = () => {
//     if (!activeSubscription) return "Buy Now";

//     const isExpired = new Date(activeSubscription.expiresAt) < new Date();

//     if (isActivePlan) {
//       if (isTrial) {
//         // return `Upgrade to ${plan.durationInYears || plan.durationInMonths}-${
//         //   plan.type === "YEARLY" ? "Year" : "Month"
//         // } Plan`;
//         return "Free trial";
//       }
//       if (isExpired) {
//         return "Renew Plan"; // Show renew for expired current plan
//       }
//       return "Your Current Plan";
//     }

//     // For non-active plans when user has a subscription
//     if (isExpired) {
//       return `Switch to ${plan.durationInYears || plan.durationInMonths}-${
//         plan.type === "YEARLY" ? "Year" : "Month"
//       } Plan`;
//     }
//     if (plan?.isTrial && !isTrial) {
//       return "Start Free Trial";
//     }

//     return `Upgrade to ${plan.durationInYears || plan.durationInMonths}-${
//       plan.type === "YEARLY" ? "Year" : "Month"
//     } Plan`;
//   };

//   return (
//     <Card
//       key={plan.id}
//       className={`relative hover:shadow-xl transition-all ${
//         isActivePlan ? "ring-2 ring-green-500" : ""
//       }`}
//     >
//       {isActivePlan && (
//         <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
//           {isTrial ? "Active Trial" : "Current Plan"}
//         </Badge>
//       )}

//       {/* EXPIRED SUBSCRIPTION MESSAGE */}
//       {isActivePlan && (isExpired || isTrialExpired) && (
//         <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500">
//           {isTrial ? "Trial Expired" : "Plan Expired"}
//         </Badge>
//       )}

//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl">{plan.name}</CardTitle>
//         <CardDescription className="text-lg">
//           Duration {plan?.type === "YEARLY" && `${plan?.durationInYears} Year`}
//           {plan?.type === "MONTHLY" && `${plan?.durationInMonths} Month`}
//           {plan?.isTrial &&
//             `${plan?.trialDurationInDays} Day${
//               plan?.trialDurationInDays > 1 && "s"
//             }`}
//         </CardDescription>
//         <div className="mt-4">
//           <div className="flex items-center justify-center gap-2">
//             <span className="text-3xl font-bold text-blue-600">
//               {plan.isTrial ? "Free" : `৳${plan.regularPrice}`}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600 mt-1">One-time payment</p>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* EXPIRED MESSAGE */}
//         {isActivePlan && (isExpired || isTrialExpired) && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
//             <p className="text-red-600 font-medium text-sm">
//               Your {isTrial ? "trial" : "subscription"} has expired!
//             </p>
//             <p className="text-red-500 text-xs mt-1">
//               {isTrial
//                 ? "Upgrade now to continue"
//                 : "Renew now to restore full access"}
//             </p>
//           </div>
//         )}

//         <div className="space-y-3">
//           <BuyNowButton
//             plan={
//               isActivePlan && !isTrial && !isExpired && !isTrialExpired
//                 ? null
//                 : plan
//             }
//             label={getButtonText()}
//             disabled={
//               (isActivePlan && !isTrial && !isExpired && !isTrialExpired) ||
//               (plan?.isTrial && hasUsedTrial)
//             }
//             activeSubscription={activeSubscription}
//             hasUsedTrial={hasUsedTrial}
//           />
//         </div>

//         {/* Show expiration information for active plans */}
//         {isActivePlan && (
//           <div className="text-sm text-center text-gray-500">
//             <p>
//               {isTrial ? "Trial" : "Plan"}{" "}
//               {isExpired || isTrialExpired ? "expired" : "active until"}{" "}
//               {new Date(
//                 isTrial
//                   ? activeSubscription.trialEndsAt
//                   : activeSubscription.expiresAt
//               ).toLocaleDateString()}
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SubscriptionCard;


//@ts-nocheck
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BuyNowButton from "./BuyNowButton";

const SubscriptionCard = ({
  plan,
  activeSubscription,
  hasUsedTrial = false,
}) => {
  const isActivePlan = activeSubscription?.subscriptionPlanId === plan.id;
  const isExpired =
    activeSubscription && new Date(activeSubscription.expiresAt) < new Date();
  // console.log("activeSubscription result:", activeSubscription);
  const isTrial =
    activeSubscription?.isTrial &&
    new Date(activeSubscription.trialEndsAt).getTime() ===
      new Date(activeSubscription.expiresAt).getTime();
  const isTrialExpired =
    isTrial && new Date(activeSubscription.trialEndsAt) < new Date();

  const getButtonText = () => {
    if (!activeSubscription) return "Buy Now";

    const isExpired = new Date(activeSubscription.expiresAt) < new Date();

    if (isActivePlan) {
      if (isTrial) {
        // return `Upgrade to ${plan.durationInYears || plan.durationInMonths}-${
        //   plan.type === "YEARLY" ? "Year" : "Month"
        // } Plan`;
        return "Free trial";
      }
      if (isExpired) {
        return "Renew Plan"; // Show renew for expired current plan
      }
      return "Your Current Plan";
    }

    // For non-active plans when user has a subscription
    if (isExpired) {
      return `Switch to ${plan.durationInYears || plan.durationInMonths}-${
        plan.type === "YEARLY" ? "Year" : "Month"
      } Plan`;
    }
    if (plan?.isTrial && !isTrial) {
      return "Start Free Trial";
    }

    return `Upgrade to ${plan.durationInYears || plan.durationInMonths}-${
      plan.type === "YEARLY" ? "Year" : "Month"
    } Plan`;
  };

  return (
    <Card
      key={plan.id}
      className={`relative hover:shadow-xl transition-all ${
        isActivePlan ? "ring-2 ring-green-500" : ""
      }`}
    >
      {isActivePlan && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
          {isTrial ? "Active Trial" : "Current Plan"}
        </Badge>
      )}

      {/* OFFER BADGE */}
      {plan?.offerPrice !== 0 && !isActivePlan && !plan?.isTrial && (
        <Badge className="absolute -top-3 right-4 bg-orange-500">
          Special Offer!
        </Badge>
      )}

      {/* EXPIRED SUBSCRIPTION MESSAGE */}
      {isActivePlan && (isExpired || isTrialExpired) && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500">
          {isTrial ? "Trial Expired" : "Plan Expired"}
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-lg">
          Duration {plan?.type === "YEARLY" && `${plan?.durationInYears} Year`}
          {plan?.type === "MONTHLY" && `${plan?.durationInMonths} Month`}
          {plan?.isTrial &&
            `${plan?.trialDurationInDays} Day${
              plan?.trialDurationInDays > 1 && "s"
            }`}
        </CardDescription>
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            {plan?.offerPrice ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400 line-through">
                    ৳{plan.regularPrice}
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    ৳{plan.offerPrice}
                  </span>
                </div>
                <span className="text-xs text-blue-600 font-medium">
                  Save ৳{plan.regularPrice - plan.offerPrice}!
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                {plan.isTrial ? "Free" : `৳${plan.regularPrice}`}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">One-time payment</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* EXPIRED MESSAGE */}
        {isActivePlan && (isExpired || isTrialExpired) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-red-600 font-medium text-sm">
              Your {isTrial ? "trial" : "subscription"} has expired!
            </p>
            <p className="text-red-500 text-xs mt-1">
              {isTrial
                ? "Upgrade now to continue"
                : "Renew now to restore full access"}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <BuyNowButton
            plan={
              isActivePlan && !isTrial && !isExpired && !isTrialExpired
                ? null
                : plan
            }
            label={getButtonText()}
            disabled={
              (isActivePlan && !isTrial && !isExpired && !isTrialExpired) ||
              (plan?.isTrial && hasUsedTrial)
            }
            activeSubscription={activeSubscription}
            hasUsedTrial={hasUsedTrial}
          />
        </div>

        {/* Show expiration information for active plans */}
        {isActivePlan && (
          <div className="text-sm text-center text-gray-500">
            <p>
              {isTrial ? "Trial" : "Plan"}{" "}
              {isExpired || isTrialExpired ? "expired" : "active until"}{" "}
              {new Date(
                isTrial
                  ? activeSubscription.trialEndsAt
                  : activeSubscription.expiresAt
              ).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;