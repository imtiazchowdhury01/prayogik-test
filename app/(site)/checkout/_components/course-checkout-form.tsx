// @ts-nocheck
"use client";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { PurchaseType, SubscriptionStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { handleCheckout } from "@/lib/actions/checkout";
import { CheckoutStorage } from "@/lib/utils/storage/checkoutEmailStorage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getUserCurrentSubscriptionDBCall } from "@/lib/data-access-layer/getUserCurrentSubscription";
import Link from "next/link";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import CheckMarkIcon from "@/components/common/CheckMarkIcon";

// Skeleton component
const Skeleton = ({ className = "", ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

// Loading skeleton component
const CheckoutFormSkeleton = () => (
  <div className="space-y-6">
    {/* Email section skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>

    {/* Pricing options skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-5 w-40" />

      {/* Regular option skeleton */}
      <div className="p-4 border rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* Subscription option skeleton */}
      <div className="p-4 border rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>

    {/* Button skeleton */}
    <Skeleton className="h-12 w-full" />

    {/* Footer text skeleton */}
    <div className="text-center">
      <Skeleton className="h-3 w-64 mx-auto" />
    </div>
  </div>
);

// Constants for better maintainability
const SUBSCRIPTION_MESSAGES = {
  TRIAL_ACTIVE: (planName) =>
    `আপনি বর্তমানে ট্রায়াল প্ল্যানে আছেন। প্রিমিয়াম সুবিধা পেতে আপগ্রেড করুন।`,

  SUBSCRIPTION_ACTIVE: (planName) =>
    `আপনার একটি সক্রিয় ${planName} সাবস্ক্রিপশন রয়েছে। আপনার কোর্সগুলোতে অ্যাক্সেস উপভোগ করুন!`,

  SUBSCRIPTION_EXPIRED: (planName) =>
    `আপনার ${planName} সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে। প্রিমিয়াম কোর্স চালিয়ে যেতে অনুগ্রহ করে রিনিউ করুন।`,

  COURSE_INCLUDED: (planName) =>
    `এই কোর্সটি আপনার ${planName} সাবস্ক্রিপশনের অন্তর্ভুক্ত - সম্পূর্ণ ফ্রি!`,

  SUBSCRIBER_DISCOUNT: (planName, discount) =>
    `আপনি আপনার ${planName} সাবস্ক্রিপশনে এই কোর্সে ${discount}% ডিসকাউন্ট পাচ্ছেন!`,
};

const PRICING_LABELS = {
  REGULAR: "স্ট্যান্ডার্ড কোর্স",
  SUBSCRIPTION: "সাবস্ক্রিপশন প্ল্যান",
  REGULAR_DESC: "এককালীন পেমেন্টের মাধ্যমে কোর্সটি কিনুন",
  SUBSCRIPTION_DESC: "৭০% সাশ্রয়ে কোর্স কিনুন ",
  FREE_WITH_SUB: "সাবস্ক্রিপশনের সাথে ফ্রী",
  DISCOUNT_WITH_SUB: "সাবস্ক্রিপশনের সাথে ডিসকাউন্ট প্রাপ্ত",
};

// Form validation schema
const formSchema = z.object({
  type: z.enum([
    PurchaseType.SINGLE_COURSE,
    PurchaseType.SUBSCRIPTION,
    PurchaseType.OFFER,
  ]),
  planId: z.string().optional(),
  email: z.string().email("একটি বৈধ ইমেইল দিন"),
});

const CourseCheckoutForm = ({
  course,
  savedPriceType,
  hasDiscount,
  discountedAmount,
  regularAmount,
  isSignedIn,
  availableSubscriptionPlans,
  defaultSelectedPlan,
  userSubscription: initialUserSubscription,
  isPaymentSuccessful,
}) => {
  // Hooks
  const router = useRouter();
  const { data: session } = useSession();

  // State management
  const [selectedType, setSelectedType] = useState(savedPriceType);
  const [selectedPlan, setSelectedPlan] = useState(defaultSelectedPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailContinued, setEmailContinued] = useState(false);
  const [isEmailProcessing, setIsEmailProcessing] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");
  const [userSubscription, setUserSubscription] = useState(
    initialUserSubscription
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoadingSubscriptionStatus, setIsLoadingSubscriptionStatus] =
    useState(false);

  // Computed values using useMemo for better performance
  const currentUserEmail = useMemo(
    () => session?.user?.email || storedEmail,
    [session?.user?.email, storedEmail]
  );

  // Calculate subscription status effect
  useEffect(() => {
    const calculateSubscriptionStatus = async () => {
      if (!userSubscription) {
        setSubscriptionStatus(null);
        return;
      }

      setIsLoadingSubscriptionStatus(true);
      try {
        const subscriptionPlans = await getSubscriptionDBCall();
        const trialSubscriptionPlan = subscriptionPlans.find(
          (plan) => plan.isTrial
        );

        const status = {
          isActive: userSubscription.status === SubscriptionStatus.ACTIVE,
          isTrial:
            userSubscription.status === SubscriptionStatus.ACTIVE &&
            userSubscription?.subscriptionPlan?.id ===
              trialSubscriptionPlan?.id,
          isExpired: userSubscription.status === SubscriptionStatus.EXPIRED,
          planName: userSubscription.subscriptionPlan?.name || "",
          discountPercentage:
            userSubscription.subscriptionPlan?.subscriptionDiscount
              ?.discountPercentage || 0,
        };

        setSubscriptionStatus(status);
      } catch (error) {
        console.error("Error calculating subscription status:", error);
        setSubscriptionStatus(null);
      } finally {
        setIsLoadingSubscriptionStatus(false);
      }
    };

    calculateSubscriptionStatus();
  }, [userSubscription]);

  const pricingOptions = useMemo(() => {
    const secondOptionType = course?.isUnderSubscription
      ? PurchaseType.SUBSCRIPTION
      : PurchaseType.OFFER;

    return {
      regular: {
        type: PurchaseType.SINGLE_COURSE,
        title: PRICING_LABELS.REGULAR,
        description: PRICING_LABELS.REGULAR_DESC,
        price: hasDiscount ? discountedAmount : regularAmount,
        originalPrice: hasDiscount ? regularAmount : null,
      },
      subscription: {
        type: secondOptionType,
        title: PRICING_LABELS.SUBSCRIPTION,
        description:
          subscriptionStatus?.isActive && !subscriptionStatus?.isTrial
            ? course?.isUnderSubscription
              ? PRICING_LABELS.FREE_WITH_SUB
              : PRICING_LABELS.DISCOUNT_WITH_SUB
            : PRICING_LABELS.SUBSCRIPTION_DESC,
      },
    };
  }, [
    course,
    hasDiscount,
    discountedAmount,
    regularAmount,
    subscriptionStatus,
  ]);

  // Initialize form with better default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: savedPriceType,
      planId: defaultSelectedPlan,
      email: currentUserEmail || "",
    },
    mode: "onChange", // Real-time validation
  });

  // Calculate selected amount with useCallback for performance
  const calculateAmount = useCallback(() => {
    if (selectedType === PurchaseType.SINGLE_COURSE) {
      return hasDiscount ? discountedAmount : regularAmount;
    }

    if (selectedType === pricingOptions.subscription.type) {
      if (subscriptionStatus?.isActive && !subscriptionStatus?.isTrial) {
        if (course?.isUnderSubscription) {
          return 0; // Free with subscription
        }
        // Apply user's subscription discount
        const courseDiscount =
          regularAmount * (subscriptionStatus.discountPercentage / 100);
        return regularAmount - courseDiscount;
      }

      // Calculate subscription + course price (for trial users or new subscribers)
      const selectedPlanData = availableSubscriptionPlans.find(
        (plan) => plan.id === selectedPlan
      );
      if (!selectedPlanData) return 0;

      const subscriptionPrice =
        selectedPlanData?.offerPrice !== 0
          ? selectedPlanData?.offerPrice
          : selectedPlanData.regularPrice;
      if (course?.isUnderSubscription) {
        return subscriptionPrice;
      }

      const planDiscountPercentage =
        selectedPlanData.subscriptionDiscount?.discountPercentage || 0;
      const courseDiscount = regularAmount * (planDiscountPercentage / 100);
      const discountedCoursePrice = regularAmount - courseDiscount;
      return subscriptionPrice + discountedCoursePrice;
    }

    return 0;
  }, [
    selectedType,
    subscriptionStatus,
    course,
    regularAmount,
    hasDiscount,
    discountedAmount,
    availableSubscriptionPlans,
    selectedPlan,
    pricingOptions.subscription.type,
  ]);

  const selectedAmount = useMemo(
    () => Math.round(calculateAmount()),
    [calculateAmount]
  );

  // User message with more meaningful content
  const getUserStatusMessage = useCallback(() => {
    if (!subscriptionStatus) return null;

    const { isActive, isTrial, isExpired, planName } = subscriptionStatus;

    if (isTrial) {
      return {
        type: "info",
        message: SUBSCRIPTION_MESSAGES.TRIAL_ACTIVE(planName),
        icon: Clock,
      };
    }

    if (isActive) {
      return {
        type: "success",
        message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ACTIVE(planName),
        icon: CheckCircle,
      };
    }

    if (isExpired) {
      return {
        type: "warning",
        message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_EXPIRED(planName),
        icon: AlertCircle,
      };
    }

    return null;
  }, [subscriptionStatus]);

  // Initialize email continuation state
  useEffect(() => {
    const initializeEmailState = () => {
      if (session?.user?.email) {
        setEmailContinued(true);
        setStoredEmail(session.user.email);
        return;
      }

      const savedEmail = CheckoutStorage.getEmail();
      if (savedEmail) {
        setStoredEmail(savedEmail);
        setEmailContinued(true);
      }
    };

    initializeEmailState();
  }, [session?.user?.email]);

  // Update form values when state changes
  useEffect(() => {
    form.setValue("type", selectedType);
    if (
      selectedType === pricingOptions.subscription.type &&
      !(subscriptionStatus?.isActive && !subscriptionStatus?.isTrial)
    ) {
      form.setValue("planId", selectedPlan);
    }
  }, [
    selectedType,
    selectedPlan,
    form,
    pricingOptions.subscription.type,
    subscriptionStatus,
  ]);

  // Auto-process email when available
  useEffect(() => {
    const autoProcessEmail = async () => {
      const email = CheckoutStorage.getEmail();
      if (email && !emailContinued && !session?.user?.email) {
        form.setValue("email", email);
        await handleEmailContinue();
      }
    };

    autoProcessEmail();
  }, []);

  // Handle email continue with better error handling
  const handleEmailContinue = async () => {
    const email = form.getValues("email") || CheckoutStorage.getEmail();

    if (!email || !email.includes("@")) {
      form.setError("email", {
        type: "manual",
        message: "একটি বৈধ ইমেইল দিন",
      });
      return;
    }

    setIsEmailProcessing(true);
    setErrorMessage("");
    try {
      const subscriptionData = await getUserCurrentSubscriptionDBCall(email);
      setUserSubscription(subscriptionData);

      CheckoutStorage.saveEmail(email);
      setStoredEmail(email);
      setEmailContinued(true);

      form.clearErrors("email");
    } catch (error) {
      console.error("Email processing error:", error);
      setErrorMessage("ইমেইল ভেরিফিকেশন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsEmailProcessing(false);
    }
  };

  // Reset email state
  const resetEmailState = useCallback(() => {
    setEmailContinued(false);
    setStoredEmail("");
    CheckoutStorage.saveEmail("");
    form.setValue("email", "");
    setUserSubscription(null);
    setSubscriptionStatus(null);
  }, [form]);

  // Handle form submission with better error handling
  const onSubmit = async (values) => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("courseId", course?.id || "");
      formData.append("type", values.type);
      formData.append("amount", selectedAmount.toString());

      if (values.planId) {
        formData.append("planId", values.planId);
      }

      const emailToUse = currentUserEmail || values.email;
      if (emailToUse) {
        formData.append("email", emailToUse);
      }

      const result = await handleCheckout(formData);

      if (result.success) {
        // OPEN BKASH PAYMENT URL
        if (result?.data?.url) {
          router.push(result?.data?.url);
        } else {
          toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে");
          router.refresh();
          // Clear stored data on success
          CheckoutStorage.clearEmail();
          if (session?.user?.email) {
            router.push(`/courses/${course?.slug}`);
          } else {
            router.push(`/signin`);
          }
        }
      } else {
        toast.error("দুঃখিত! পেমেন্ট সম্পন্ন করা যায়নি");
        setErrorMessage(result.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        "অপ্রত্যাশিত একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন!"
      );
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render subscription plan options
  const renderSubscriptionPlans = () => {
    if (
      (subscriptionStatus?.isActive && !subscriptionStatus.isTrial) ||
      (subscriptionStatus?.isTrial && course?.isUnderSubscription) ||
      availableSubscriptionPlans.length === 0
    ) {
      return null;
    }

    return (
      <>
        <FormField
          control={form.control}
          name="planId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-sm font-medium text-gray-700">
                {subscriptionStatus?.isTrial
                  ? "আপনার সাবস্ক্রিপশন প্ল্যান আপগ্রেড করুন:"
                  : ""}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={selectedPlan}
                  onValueChange={(value) => {
                    if (emailContinued || session?.user?.email) {
                      setSelectedPlan(value);
                      field.onChange(value);
                    }
                  }}
                  disabled={!emailContinued && !session?.user?.email}
                >
                  {availableSubscriptionPlans
                    .filter((plan) => {
                      // For trial users, show non-trial plans (upgrade options)
                      if (subscriptionStatus?.isTrial) {
                        return !plan.isTrial;
                      }
                      // For non-subscribers, show all plans
                      return true;
                    })
                    .map((plan) => {
                      const discountPercentage =
                        plan.subscriptionDiscount?.discountPercentage || 0;
                      const subscriptionPrice =
                        plan.offerPrice && plan.offerPrice !== 0
                          ? plan.offerPrice
                          : plan.regularPrice;

                      const planDuration =
                        plan.isTrial && plan.trialDurationInDays
                          ? `${plan.trialDurationInDays} Day${
                              plan.trialDurationInDays > 1 ? "s" : ""
                            }`
                          : plan.durationInYears
                          ? `${plan.durationInYears} Year${
                              plan.durationInYears > 1 ? "s" : ""
                            }`
                          : `${plan.durationInMonths} Month${
                              plan.durationInMonths > 1 ? "s" : ""
                            }`;

                      let coursePrice = 0;
                      if (!course?.isUnderSubscription) {
                        const courseDiscount =
                          regularAmount * (discountPercentage / 100);
                        coursePrice = regularAmount - courseDiscount;
                      }

                      const totalPrice = subscriptionPrice + coursePrice;
                      const originalTotalPrice =
                        plan.regularPrice + regularAmount;

                      // Add offer savings calculation if there's an offer price
                      const offerSavings =
                        plan.offerPrice && plan.offerPrice !== 0
                          ? plan.regularPrice - plan.offerPrice
                          : 0;

                      // Update to include offer savings:
                      const totalSavings = originalTotalPrice - totalPrice;
                      return (
                        <div
                          key={plan.id}
                          className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 border rounded-lg"
                        >
                          {/* Radio + Label */}
                          <label
                            htmlFor={`plan-${plan.id}`}
                            className="flex flex-1 items-start md:items-center gap-2 cursor-pointer w-full"
                          >
                            <RadioGroupItem
                              value={plan.id}
                              id={`plan-${plan.id}`}
                              disabled={
                                !emailContinued && !session?.user?.email
                              }
                              className="shrink-0 mt-1 w-5 h-5 text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0"
                            />

                            {/* Plan details */}
                            <div className="flex-1 w-full">
                              {/* Top row: Plan name + badges + price */}
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                <div className="flex flex-wrap gap-1 mb-1 md:mb-0">
                                  <p className="text-lg font-semibold">
                                    {convertNumberToBangla(
                                      plan.durationInYears
                                    )}{" "}
                                    বছরের প্ল্যান
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1">
                                    {plan.offerPrice !== 0 && (
                                      <Badge className="bg-secondary-button text-xs h-fit">
                                        স্পেশাল অফার
                                      </Badge>
                                    )}
                                    {!course?.isUnderSubscription &&
                                      discountPercentage > 0 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs h-fit text-brand border-brand"
                                        >
                                          কোর্স অন্তর্ভুক্ত
                                        </Badge>
                                      )}
                                  </div>
                                </div>

                                <div className="text-lg font-bold text-secondary-brand whitespace-nowrap">
                                  {plan.offerPrice !== 0 && (
                                    <span className="text-sm text-gray-400 line-through mr-1 font-normal">
                                      ৳
                                      {convertNumberToBangla(plan.regularPrice)}
                                    </span>
                                  )}
                                  ৳
                                  {convertNumberToBangla(
                                    Math.round(subscriptionPrice)
                                  )}
                                </div>
                              </div>

                              {/* Course under subscription */}
                              <div className="text-sm text-gray-600 pt-1">
                                {course?.isUnderSubscription ? (
                                  <span className="font-medium text-green-600">
                                    কোর্স: ফ্রি
                                  </span>
                                ) : discountPercentage > 0 ? (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <span>কোর্স:</span>
                                    <span className="font-medium text-gray-700">
                                      ৳
                                      {convertNumberToBangla(
                                        Math.round(coursePrice)
                                      )}
                                    </span>
                                    <span className="line-through text-gray-500">
                                      ৳{convertNumberToBangla(regularAmount)}
                                    </span>
                                  </div>
                                ) : (
                                  <span>
                                    কোর্স: ৳
                                    {convertNumberToBangla(regularAmount)}
                                  </span>
                                )}
                              </div>

                              {/* Savings */}
                              {totalSavings > 0 && (
                                <div className="text-sm text-gray-700 pt-1">
                                  <span className="mr-2">সাশ্রয়:</span>৳
                                  {convertNumberToBangla(
                                    Math.round(totalSavings)
                                  )}
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* total p rice section */}

        {/* <div className="flex justify-between items-center mt-4 text-xl font-bold border-t pr-2.5">
          <p className="pt-2">সর্বমোট</p>
          <p className="pt-2">৳{convertNumberToBangla(selectedAmount)}</p>
        </div> */}
      </>
    );
  };

  // Render active subscription message
  const renderActiveSubscriptionMessage = () => {
    // Only show for active non-trial subscriptions
    if (!subscriptionStatus?.isActive || subscriptionStatus?.isTrial) {
      return null;
    }

    const { planName, discountPercentage } = subscriptionStatus;

    return (
      <div className="ml-6 p-3 bg-brand/5 border shadow-customInput rounded-lg">
        <div className="flex items-center gap-2">
          <CheckMarkIcon />
          <span className="text-sm font-medium text-gray-700">
            {planName} সাবস্ক্রিপশন বর্তমানে সক্রিয় রয়েছে
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {course?.isUnderSubscription ? (
            <>
              {SUBSCRIPTION_MESSAGES.COURSE_INCLUDED(planName)}
              {!session?.user?.email && (
                <Link
                  href="/signin"
                  className="ml-2 font-semibold text-brand underline hover:text-brand"
                >
                  সাইন ইন করুন
                </Link>
              )}
            </>
          ) : (
            SUBSCRIPTION_MESSAGES.SUBSCRIBER_DISCOUNT(
              planName,
              discountPercentage
            )
          )}
        </p>

        {!course?.isUnderSubscription && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="text-sm">
              <span className="text-gray-600">রেগুলার প্রাইস: </span>
              <span className="line-through text-gray-500">
                ৳{convertNumberToBangla(regularAmount)}
              </span>
            </div>
            <div className="text-sm font-medium ">
              <span>কোর্স {planName} প্রাইস: </span>
              <span className="text-sm">
                ৳
                {convertNumberToBangla(
                  Math.round(
                    regularAmount - (regularAmount * discountPercentage) / 100
                  )
                )}
              </span>
              <span className="text-xs ml-1">({discountPercentage}%)</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Show loading skeleton while calculating subscription status
  if (isLoadingSubscriptionStatus) {
    return <CheckoutFormSkeleton />;
  }

  const isFormDisabled = !emailContinued && !session?.user?.email;

  const canPurchase =
    (subscriptionStatus?.isActive &&
      !subscriptionStatus?.isTrial &&
      course?.isUnderSubscription) ||
    (subscriptionStatus?.isTrial && course?.isUnderSubscription);

  const userStatusMessage = getUserStatusMessage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sm:text-2xl text-xl font-semibold">
          এনরোলমেন্ট ডিটেলস
        </CardTitle>
        <CardDescription className="sr-only"></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input Section */}
            {!session?.user?.email && !emailContinued && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-normal">
                        <RequiredFieldStar labelText="ইমেইল" />
                      </FormLabel>
                      <FormControl className="text-base font-normal">
                        <Input
                          className="h-12 shadow-customInput"
                          type="email"
                          placeholder="আপনার ইমেইল দিন"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={handleEmailContinue}
                  disabled={isEmailProcessing}
                  className="w-full bg-brand shadow-customButton hover:bg-teal-700 transition-colors duration-300 size-lg h-12 disabled:bg-gray-400 disabled:text-gray-200"
                  size="lg"
                  variant="default"
                >
                  {isEmailProcessing ? (
                    <>
                      <Loader className="animate-spin mr-2" size={16} />
                    </>
                  ) : (
                    <>
                      এগিয়ে যান <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Email Status Display */}
            {!session?.user?.email && emailContinued && (
              <div className="flex gap-2 items-center justify-between p-3 bg-white border shadow-customInput rounded-lg">
                <div className="flex items-center gap-2 w-full">
                  <Mail className="w-4 h-4 text-brand shrink-0" />
                  <div className="w-full">
                    <Input
                      type="text"
                      readOnly
                      value={session?.user?.email || storedEmail}
                      className="text-gray-700 text-sm sm:text-base font-normal w-full overflow-x-auto outline-0 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-fit rounded-none p-0"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={resetEmailState}
                  className="text-brand h-auto p-1 hover:no-underline font-normal text-sm text-nowrap sm:text-base sm:text-nowrap self-start md:self-auto"
                >
                  পরিবর্তন করুন
                </Button>
              </div>
            )}

            {/* Signed-in User Display */}
            {session?.user?.email && (
              <div className="p-3 border shadow-customInput rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand" />
                  <span className="text-gray-700 text-base font-normal">
                    সাইন ইন করেছেন: {session.user.email}
                  </span>
                </div>
              </div>
            )}

            {/* User Status Message */}
            {userStatusMessage && (
              <Alert
                className={`border  ${
                  userStatusMessage.type === "success"
                    ? "shadow-customInput bg-brand/5"
                    : userStatusMessage.type === "warning"
                    ? "border-yellow-500 bg-yellow-50"
                    : "shadow-customInput bg-brand/5"
                }`}
              >
                <CheckMarkIcon />
                <AlertDescription className="text-sm mt-1 ">
                  {userStatusMessage.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Pricing Options */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[20px] font-semibold">
                    অপশন সিলেক্ট করুন
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={selectedType}
                      onValueChange={(value) => {
                        if (!isFormDisabled) {
                          setSelectedType(value);
                          field.onChange(value);
                        }
                      }}
                      disabled={isFormDisabled}
                      className={
                        isFormDisabled ? "opacity-50 pointer-events-none" : ""
                      }
                    >
                      {/* Regular Price Option */}
                      <div
                        className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-3 md:gap-4 ${
                          subscriptionStatus?.isActive &&
                          !subscriptionStatus?.isTrial &&
                          course?.isUnderSubscription
                            ? "opacity-50 pointer-events-none bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Radio + Label */}
                        <label
                          htmlFor={pricingOptions.regular.type}
                          className={`flex items-start md:items-center gap-2 flex-1 cursor-pointer`}
                        >
                          <RadioGroupItem
                            value={pricingOptions.regular.type}
                            id={pricingOptions.regular.type}
                            disabled={
                              isFormDisabled ||
                              (subscriptionStatus?.isActive &&
                                !subscriptionStatus?.isTrial &&
                                course?.isUnderSubscription)
                            }
                            className="shrink-0 mt-1 w-4 h-4 text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-[18px]">
                              {pricingOptions.regular.title}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {pricingOptions.regular.description}
                            </p>
                          </div>
                        </label>

                        {/* Price Section */}
                        <div className="text-left md:text-right ml-6 md:ml-0">
                          <span className="text-lg font-bold text-secondary-button">
                            ৳
                            {convertNumberToBangla(
                              pricingOptions.regular.price
                            )}
                          </span>
                          {pricingOptions.regular.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ৳
                              {convertNumberToBangla(
                                pricingOptions.regular.originalPrice
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subscription Option */}
                      {availableSubscriptionPlans.length > 0 &&
                        !(
                          subscriptionStatus?.isTrial &&
                          course?.isUnderSubscription
                        ) && (
                          <div
                            className={`border rounded-lg p-4 transition-colors ${
                              subscriptionStatus?.isActive &&
                              !subscriptionStatus?.isTrial
                                ? "shadow-customInput"
                                : subscriptionStatus?.isTrial
                                ? "shadow-customInput"
                                : "shadow-customInput"
                            }`}
                          >
                            {/* plans  */}
                            <div className="flex sm:items-center items-start space-x-3 mb-4">
                              <RadioGroupItem
                                value={pricingOptions.subscription.type}
                                id={pricingOptions.subscription.type}
                                disabled={isFormDisabled}
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  borderRadius: "100%",
                                }}
                                className="text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0 ml-0 space-y-3 pl-0 mt-1.5 sm:mt-0"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={pricingOptions.subscription.type}
                                  className="flex items-center gap-2 cursor-pointer font-semibold text-[18px]"
                                >
                                  <span
                                    className={`font-medium ${
                                      subscriptionStatus?.isActive &&
                                      !subscriptionStatus?.isTrial
                                        ? ""
                                        : subscriptionStatus?.isTrial
                                        ? ""
                                        : ""
                                    }`}
                                  >
                                    {subscriptionStatus?.isTrial
                                      ? "সাবস্ক্রিপশন আপগ্রেড করুন"
                                      : pricingOptions.subscription.title}
                                  </span>
                                </Label>
                                <p className={`text-sm mt-1 `}>
                                  {subscriptionStatus?.isTrial
                                    ? "ট্রায়াল থেকে ফুল সাবস্ক্রিপশনে আপগ্রেড করুন"
                                    : pricingOptions.subscription.description}
                                </p>
                              </div>
                            </div>

                            <AnimatePresence>
                              {selectedType ===
                                pricingOptions.subscription.type && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                  style={{ overflow: "hidden" }}
                                >
                                  {renderSubscriptionPlans()}
                                  {renderActiveSubscriptionMessage()}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                      {/* Trial User with Course Under Subscription - Show Message Only */}
                      {subscriptionStatus?.isTrial &&
                        course?.isUnderSubscription &&
                        selectedType !== pricingOptions.subscription.type && (
                          <div className="p-4 bg-brand/5 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 " />
                              <span className="text-sm font-medium ">
                                ফ্রী ট্রায়াল ব্যবহার করা যাবে
                              </span>
                            </div>
                            <p className="text-sm t">
                              এই কোর্সটি আপনার ট্রায়াল সাবস্ক্রিপশনে
                              অন্তর্ভুক্ত – ট্রায়াল সময়কালে সম্পূর্ণ ফ্রি!
                              {!session?.user?.email && (
                                <Link
                                  href="/signin"
                                  className="ml-2 font-semibold underline hover:text-teal-700 text-brand"
                                >
                                  সাইন ইন করুন
                                </Link>
                              )}
                            </p>
                          </div>
                        )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            {/* Total Price Section */}
            {subscriptionStatus?.isActive &&
            !subscriptionStatus?.isTrial &&
            course?.isUnderSubscription ? null : (
              <div className="flex justify-between items-center mt-4 text-xl font-bold border-t pr-2.5">
                <p className="pt-2">সর্বমোট</p>
                <p className="pt-2">৳{convertNumberToBangla(selectedAmount)}</p>
              </div>
            )}

            {/* Checkout Button */}
            <Button
              type="submit"
              className="w-full bg-[#E2136E] hover:bg-[#d70d65]  disabled:bg-gray-400 disabled:text-gray-200"
              size="lg"
              disabled={
                isProcessing ||
                isPaymentSuccessful ||
                (subscriptionStatus?.isActive &&
                  !subscriptionStatus?.isTrial &&
                  course?.isUnderSubscription)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                viewBox="-6.6741 -11.07275 57.8422 66.4365"
                fill="none"
              >
                <g fill="none">
                  <path d="M42.31 44.291H2.182C.981 44.291 0 43.308 0 42.107V2.186C0 .982.981 0 2.182 0H42.31c1.203 0 2.184.982 2.184 2.186v39.921c0 1.201-.981 2.184-2.184 2.184" />
                  <path
                    fill="#FFF"
                    d="M31.894 24.251l-14.107-2.246 1.909 8.329zm.572-.682L21.374 8.16l-3.623 13.106zm-15.402-2.482L5.441 6.239l15.221 1.819zm-5.639-6.154l-6.449-6.08h1.695zm24.504 1.15L33.2 23.486l-4.426-6.118zM21.417 30.232l10.71-4.3.454-1.365zm-8.933 7.821l4.589-16.102 2.326 10.479zm24.099-21.914l-1.128 3.056 4.059-.07z"
                  />
                </g>
              </svg>

              {isProcessing ? (
                <>
                  {/* <Loader className="animate-spin mr-2" size={16} /> */}
                  প্রক্রিয়াধীন…
                </>
              ) : subscriptionStatus?.isActive &&
                !subscriptionStatus?.isTrial &&
                course?.isUnderSubscription ? (
                "বিকাশে পেমেন্ট সম্পূর্ণ করুন"
              ) : subscriptionStatus?.isTrial && course?.isUnderSubscription ? (
                "ট্রায়াল প্ল্যানে অন্তর্ভুক্ত আছে - সাইন ইন করুন"
              ) : (
                `বিকাশে পেমেন্ট সম্পূর্ণ করুন`
              )}
            </Button>

            <p className="text-sm text-gray-600 sm:text-center text-left">
              নিরাপদ পেমেন্ট প্রসেসিং বিকাশ এর মাধ্যমে। আপনার লেনদেন সুরক্ষিত।
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CourseCheckoutForm;
