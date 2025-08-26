// @ts-nocheck
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users } from "lucide-react";
import { getCourseDBCall } from "@/lib/data-access-layer/course";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import CourseCheckoutForm from "./course-checkout-form";
import Image from "next/image";
import { getUserSubscription } from "@/lib/getUserSubscription";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { PurchaseType } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaymentMessage from "./payment-message";

const CourseCheckout = async ({
  cartData,
  errorMessage,
  isPaymentSuccessful,
  transactionId,
  amount,
}: any) => {
  const userSubscription = await getUserSubscription();
  const { courseSlug, checkoutType } = cartData?.items[0];
  const course = await getCourseDBCall(courseSlug);
  const allSubscriptionPlans = await getSubscriptionDBCall();
  const cookieStore = cookies();
  const savedPriceType = checkoutType || PurchaseType.SINGLE_COURSE;
  const savedSelectedPlan =
    cookieStore.get("checkout_selected_plan")?.value || "";
  const { userId } = await getServerUserSession();

  // Check if user has active subscription
  const hasActiveSubscription =
    userSubscription && userSubscription.status === "ACTIVE";

  if (!cartData || !course) {
    return <div>Course not found</div>;
  }

  // Get the first price for regular pricing
  const regularPrice = course.prices?.[0];
  const regularAmount = regularPrice?.regularAmount || 0;
  const discountedAmount = regularPrice?.discountedAmount;
  const hasDiscount = discountedAmount && discountedAmount < regularAmount;

  // Filter and sort subscription plans
  const availableSubscriptionPlans = allSubscriptionPlans
    .filter((plan) => plan.name && plan.regularPrice)
    .sort((a, b) => {
      // Sort by duration: shorter durations first
      const aDuration = a.durationInYears || a.durationInMonths / 12 || 1;
      const bDuration = b.durationInYears || b.durationInMonths / 12 || 1;
      return aDuration - bDuration;
    });

  // Set default selected plan to the first available plan
  const defaultSelectedPlan =
    savedSelectedPlan || availableSubscriptionPlans[0]?.id || "";

  return (
    <div className="bg-[#F3F9F9] flex justify-center items-center p-6 xl:p-14 border-b">
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
        <div className="flex lg:flex-row flex-col justify-between gap-10 pt-2">
          {/* Left Side - Course Details */}
          <div className="lg:w-[45%] w-full">
            <Card className="relative p-6">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={course.imageUrl || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="mb-0 pb-6 px-0">
                <CardTitle className="sm:text-2xl text-xl font-semibold ">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-gray-700 space-y-1 px-0">
                <div>ইন্সট্রাক্টর {course.teacherProfile?.user?.name}</div>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex items-center space-x-[6px]">
                    <Image
                      src={"/icon/book-gray.svg"}
                      alt="user-icon"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                    <p className="text-base text-fontcolor-description">
                      {convertNumberToBangla(course?.lessons?.length)} টি লেসন
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {convertNumberToBangla(
                      course.enrolledStudents?.length || 0
                    )}{" "}
                    শিক্ষার্থী
                  </div>
                </div>

                <div>
                  <div className="">
                    <span className="text-sm text-gray-600 mr-1">
                      রেগুলার প্রাইস:
                    </span>
                    <span className="text-lg font-semibold">
                      ৳{convertNumberToBangla(regularAmount)}
                    </span>
                  </div>
                  {hasDiscount && (
                    <div className="">
                      <span className="text-sm text-brand font-medium">
                        Discounted Price:
                      </span>
                      <span className="text-xl font-bold text-brand">
                        ৳{convertNumberToBangla(discountedAmount)}
                      </span>
                    </div>
                  )}
                  {/* {hasActiveSubscription && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">
                        Subscriber Discount:
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        {userSubscription?.subscriptionPlan?.subscriptionDiscount
                          ?.discountPercentage || 0}
                        % OFF
                      </span>
                    </div>
                  )} */}
                </div>
              </CardContent>
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
          <div className="lg:w-[55%] w-full">
            <CourseCheckoutForm
              availableSubscriptionPlans={availableSubscriptionPlans}
              course={course}
              savedPriceType={savedPriceType}
              hasDiscount={hasDiscount}
              discountedAmount={discountedAmount}
              regularAmount={regularAmount}
              defaultSelectedPlan={defaultSelectedPlan}
              isSignedIn={!!userId}
              userSubscription={userSubscription}
              isPaymentSuccessful={isPaymentSuccessful}
            />
          </div>
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
};

export default CourseCheckout;
