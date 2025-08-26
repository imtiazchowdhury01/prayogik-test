//@ts-nocheck
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import SubscriptionCheckoutForm from "./SubscriptionCheckoutForm";
import {
  checkUserTrialHistory,
  getSubscriptionPlanByIdDBCall,
} from "@/lib/data-access-layer/subscriptions";
import { getUserSubscription } from "@/lib/getUserSubscription";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CheckCircle } from "lucide-react";
import CheckMarkIcon from "@/components/common/CheckMarkIcon";
import FireIcon from "@/components/common/FireIcon";
import CrownIcon from "@/components/common/CrownIcon";
import PaymentMessage from "./payment-message";

export default async function SubscriptionCheckout({
  cartData,
  errorMessage,
  isPaymentSuccessful,
  transactionId,
  amount,
}: any) {
  const plan = await getSubscriptionPlanByIdDBCall(cartData?.items[0]?.planId);
  if (!plan) {
    redirect("/prime"); // If no plan in cookies, send user back
  }
  const activeSubscription = await getUserSubscription();
  // Check if user has used trial
  const { userId } = await getServerUserSession();
  const hasUsedTrial = userId ? await checkUserTrialHistory(userId) : false;

  return (
    <div className="bg-[#F3F9F9] flex justify-center items-center p-6 xl:p-14 border-b">
      {/* main card */}
      <Card className="app-container mx-auto bg-white p-6 md:p-10 border-0">
        {/* title and description */}
        <div>
          <h1 className="md:text-4xl text-3xl font-bold">চেকআউট </h1>
          <p className="sm:text-base text-sm font-normal text-gray-600">
            সব তথ্য যাচাই করুন এবং নিশ্চিন্তে পেমেন্ট করুন।
          </p>
        </div>
        {/* divider */}
        <hr className="my-4 border-gray-200" />

        {/* message for success or failed */}
        <PaymentMessage
          errorMessage={errorMessage}
          isPaymentSuccessful={isPaymentSuccessful}
          transactionId={transactionId}
          amount={amount}
        />

        {/* grid component */}
        <div className="grid lg:grid-cols-2 gap-10 pt-2">
          {/* Left Side - Plan Details */}
          <div>
            <Card className="relative p-6">
              {/* card title */}
              <div className="flex sm:flex-row flex-col justify-start sm:justify-between sm:items-center items-start">
                <h2 className="sm:text-2xl text-xl font-semibold">
                  প্লানের বিস্তারিত
                </h2>
                <div>
                  {plan.offerPrice ? (
                    <Badge className="bg-secondary-button hover:bg-secondary-button text-white rounded text-sm sm:text-base font-normal text-wrap">
                      স্পেশাল অফার
                    </Badge>
                  ) : (
                    <Badge className="bg-brand/10 hover:bg-brand/10 text-brand rounded text-sm sm:text-base font-normal text-wrap">
                      ফ্রী এক্সেস
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">
                  <div className="flex flex-row gap-4 pt-4 sm:pt-8 sm:items-start items-center">
                    {/* Icon */}
                    <div className="shrink-0">
                      {plan?.name === "Trial" ? <FireIcon /> : <CrownIcon />}
                    </div>

                    {/* Text Block */}
                    <div className="space-y-1">
                      <p className="text-sm font-normal text-gray-500">
                        {convertNumberToBangla(plan.durationInYears)} বছরের
                        প্ল্যান
                      </p>

                      <h3 className="flex flex-wrap items-center sm:gap-y-2 gap-y-0 sm:gap-x-2 gap-x-1">
                        {plan.name === "Trial" ? (
                          "ফ্রী প্ল্যান"
                        ) : (
                          <>
                            <span className="text-black text-xl sm:text-3xl font-bold">
                              ৳{convertNumberToBangla(plan.offerPrice)}
                            </span>
                            <span className="text-gray-400 line-through text-sm sm:text-lg font-normal">
                              ৳{convertNumberToBangla(plan.regularPrice)}
                            </span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>
                </CardTitle>

                {/* features */}
                <CardDescription className="text-lg text-left pt-3 sm:pt-6 text-gray-900 font-normal">
                  <div className="space-y-2">
                    <div className="flex items-start sm:items-center gap-2 text-sm">
                      <CheckMarkIcon />
                      <p className="text-sm text-gray-700">
                        {plan.name === "Trial" ? (
                          <>
                            ফ্রী ট্রায়াল:{" "}
                            {convertNumberToBangla(plan.trialDurationInDays)}{" "}
                            দিন
                          </>
                        ) : (
                          <>
                            সময়কাল {convertNumberToBangla(plan.durationInYears)}{" "}
                            বছর
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckMarkIcon />
                      <p>
                        সব স্ট্যান্ডার্ড কোর্সে{" "}
                        {convertNumberToBangla(
                          plan?.subscriptionDiscount?.discountPercentage
                        )}
                        % ডিসকাউন্ট
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckMarkIcon />
                      <p>সব প্রাইম কোর্স ফ্রি</p>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            {/* desktop screen */}
            <div className="w-fit hidden lg:block">
              <Link href="/prime">
                <Button
                  variant="link"
                  className="flex flex-row gap-1 text-brand pt-8 hover:no-underline px-0 font-normal"
                >
                  <ArrowLeft className="w-4 h-4" />
                  সাবস্ক্রিপশন পেজে ফিরে যান
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Checkout Form */}
          <SubscriptionCheckoutForm
            plan={plan}
            activeSubscription={activeSubscription}
            hasUsedTrial={hasUsedTrial}
            isPaymentSuccessful={isPaymentSuccessful}
          />
          {/* MOBILE screen */}
          <div className="w-fit lg:hidden block">
            <Link href="/prime">
              <Button
                variant="link"
                className="flex flex-row gap-1 text-brand hover:no-underline px-0 font-normal"
              >
                <ArrowLeft className="w-4 h-4" />
                সাবস্ক্রিপশন পেজে ফিরে যান
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
