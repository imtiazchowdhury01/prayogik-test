// @ts-nocheck
"use client";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { PurchaseType } from "@prisma/client";
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

// Form validation schema - removed courseId and amount since they're not form fields anymore
const formSchema = z.object({
  type: z.enum([
    PurchaseType.SINGLE_COURSE,
    PurchaseType.SUBSCRIPTION,
    PurchaseType.OFFER,
  ]),
  planId: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
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
  userSubscription,
}) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(savedPriceType);
  const [selectedPlan, setSelectedPlan] = useState(defaultSelectedPlan);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data } = useSession();

  console.log(userSubscription, "user subscription");
  console.log(selectedType, "selected type");

  // Check if user has active subscription
  const hasActiveSubscription =
    userSubscription &&
    userSubscription.status === "ACTIVE" &&
    !userSubscription?.isTrial;

  // Determine the second option type and details
  const getSecondOptionDetails = () => {
    if (course?.isUnderSubscription) {
      return {
        type: PurchaseType.SUBSCRIPTION,
        title: "Price With Subscription",
        description: hasActiveSubscription
          ? "This course is included with your subscription - Free!"
          : "Get a subscription plan and access this course for free",
        showPrice: !hasActiveSubscription,
      };
    } else {
      return {
        type: PurchaseType.OFFER,
        title: "Price With Subscription",
        description: hasActiveSubscription
          ? "Get this course at your subscriber discount price"
          : "Get a subscription plan + this course at discounted price",
        showPrice: true,
      };
    }
  };

  const secondOption = getSecondOptionDetails();

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: savedPriceType,
      planId: defaultSelectedPlan,
      email: data?.user?.email || CheckoutStorage.getEmail() || "",
    },
  });

  // Clear error when form values change
  const watchedValues = form.watch();
  // clear error message when form values change
  useEffect(() => {
    if (form.formState.isDirty) {
      setErrorMessage("");
    }
  }, [form.formState.isDirty]);
  useEffect(() => {
    // Save email to storage when it changes
    if (watchedValues.email) {
      CheckoutStorage.saveEmail(watchedValues.email);
    }
  }, [watchedValues]);

  useEffect(() => {
    let amount = 0;
    if (selectedType === PurchaseType.SINGLE_COURSE) {
      amount = hasDiscount ? discountedAmount : regularAmount;
    } else if (selectedType === secondOption.type) {
      if (hasActiveSubscription) {
        // User has active subscription - apply their subscription discount
        if (course?.isUnderSubscription) {
          // Course is included in subscription
          amount = 0;
        } else {
          // Apply user's subscription discount to course price
          const discountPercentage =
            userSubscription?.subscriptionPlan?.subscriptionDiscount
              ?.discountPercentage || 0;
          const courseDiscount = regularAmount * (discountPercentage / 100);
          amount = regularAmount - courseDiscount;
        }
      } else {
        // User doesn't have subscription
        const plan = availableSubscriptionPlans.find(
          (p) => p.id === selectedPlan
        );
        if (plan) {
          const subscriptionPrice = plan.regularPrice;
          if (course?.isUnderSubscription) {
            // Course is free with subscription
            amount = subscriptionPrice;
          } else {
            // Course gets discount with subscription
            const discountPercentage =
              plan.subscriptionDiscount?.discountPercentage || 0;
            const courseDiscount = regularAmount * (discountPercentage / 100);
            const coursePrice = regularAmount - courseDiscount;
            amount = subscriptionPrice + coursePrice;
          }
        }
      }
    }
    const finalAmount = Math.round(amount);
    setSelectedAmount(finalAmount);
  }, [
    selectedType,
    selectedPlan,
    hasDiscount,
    discountedAmount,
    regularAmount,
    hasActiveSubscription,
    course,
    availableSubscriptionPlans,
    userSubscription,
  ]);

  // Update form values when state changes
  useEffect(() => {
    form.setValue("type", selectedType);
    if (selectedType === secondOption.type && !hasActiveSubscription) {
      form.setValue("planId", selectedPlan);
    }
  }, [
    selectedType,
    selectedPlan,
    form,
    secondOption.type,
    hasActiveSubscription,
  ]);

  // Save email to storage when it changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "email" && value.email) {
        CheckoutStorage.saveEmail(value.email);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Calculate display price for second option header
  const getSecondOptionDisplayPrice = () => {
    if (hasActiveSubscription) {
      if (course?.isUnderSubscription) {
        return "Free";
      } else {
        const discountPercentage =
          userSubscription?.subscriptionPlan?.subscriptionDiscount
            ?.discountPercentage || 0;
        const courseDiscount = regularAmount * (discountPercentage / 100);
        const discountedPrice = regularAmount - courseDiscount;
        return `৳${convertNumberToBangla(Math.round(discountedPrice))}`;
      }
    }
    return null;
  };

  // Handle form submission
  const onSubmit = async (values) => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Create FormData object with all necessary data
      const formData = new FormData();
      formData.append("courseId", course?.id || "");
      formData.append("type", values.type);
      formData.append("amount", selectedAmount.toString());

      if (values.planId) {
        formData.append("planId", values.planId);
      }

      // Use email from form or session data
      const emailToUse = values.email || data?.user?.email;
      if (emailToUse) {
        formData.append("email", emailToUse);
      }

      const result = await handleCheckout(formData);
      console.log("Checkout result:", result.message);

      if (result.success) {
        router.push("/checkout/success");
        // console.log("Checkout successful:", result);
      } else {
        // Handle error
        console.error("Checkout failed:", result);
        setErrorMessage(
          result.message ||
            "An error occurred during checkout. Please try again."
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Pricing Options */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Select Pricing Option
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value);
                    field.onChange(value);
                  }}
                >
                  {/* Regular Price Option */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem
                      value={PurchaseType.SINGLE_COURSE}
                      id={PurchaseType.SINGLE_COURSE}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={PurchaseType.SINGLE_COURSE}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">Regular Price</span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Standard course pricing
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">
                        ৳
                        {convertNumberToBangla(
                          hasDiscount ? discountedAmount : regularAmount
                        )}
                      </span>
                      {hasDiscount && (
                        <div className="text-sm text-gray-500 line-through">
                          ৳{convertNumberToBangla(regularAmount)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second Option - Dynamic based on course subscription status */}
                  {availableSubscriptionPlans.length > 0 && (
                    <div
                      className={`border rounded-lg p-4 ${
                        hasActiveSubscription ? "bg-green-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <RadioGroupItem
                          value={secondOption.type}
                          id={secondOption.type}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={secondOption.type}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CreditCard className="h-4 w-4" />
                            <span
                              className={`font-medium ${
                                hasActiveSubscription
                                  ? "text-green-700"
                                  : "text-purple-700"
                              }`}
                            >
                              {secondOption.title}
                            </span>
                          </Label>
                          <p
                            className={`text-sm mt-1 ${
                              hasActiveSubscription
                                ? "text-green-600"
                                : "text-purple-600"
                            }`}
                          >
                            {secondOption.description}
                          </p>
                        </div>
                        <div className="text-right">
                          {hasActiveSubscription && secondOption.showPrice && (
                            <div
                              className={`text-lg font-bold ${
                                course?.isUnderSubscription
                                  ? "text-green-600"
                                  : "text-green-600"
                              }`}
                            >
                              {getSecondOptionDisplayPrice()}
                            </div>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedType === secondOption.type && (
                          <motion.div
                            key="subscription-content"
                            initial={{
                              opacity: 0,
                              height: 0,
                              overflow: "hidden",
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              overflow: "hidden",
                            }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            {/* Show subscription plans only if user doesn't have active subscription */}
                            {!hasActiveSubscription &&
                              availableSubscriptionPlans.length > 0 && (
                                <FormField
                                  control={form.control}
                                  name="planId"
                                  render={({ field }) => (
                                    <FormItem className="ml-6 space-y-3 pl-1">
                                      <FormLabel className="text-sm font-medium text-gray-700">
                                        Choose your subscription plan:
                                      </FormLabel>
                                      <FormControl>
                                        <RadioGroup
                                          value={selectedPlan}
                                          onValueChange={(value) => {
                                            setSelectedPlan(value);
                                            field.onChange(value);
                                          }}
                                        >
                                          {availableSubscriptionPlans.map(
                                            (plan) => {
                                              const discountPercentage =
                                                plan.subscriptionDiscount
                                                  ?.discountPercentage || 0;
                                              const subscriptionPrice =
                                                plan.regularPrice;
                                              let coursePrice = 0;
                                              let originalCoursePrice =
                                                regularAmount;

                                              if (course?.isUnderSubscription) {
                                                coursePrice = 0;
                                              } else {
                                                const courseDiscount =
                                                  regularAmount *
                                                  (discountPercentage / 100);
                                                coursePrice =
                                                  regularAmount -
                                                  courseDiscount;
                                              }

                                              const totalPrice =
                                                subscriptionPrice + coursePrice;
                                              const originalTotalPrice =
                                                plan.regularPrice +
                                                originalCoursePrice;
                                              const totalSavings =
                                                originalTotalPrice - totalPrice;

                                              const planDuration =
                                                plan.durationInYears
                                                  ? `${
                                                      plan.durationInYears
                                                    } Year${
                                                      plan.durationInYears > 1
                                                        ? "s"
                                                        : ""
                                                    }`
                                                  : `${
                                                      plan.durationInMonths
                                                    } Month${
                                                      plan.durationInMonths > 1
                                                        ? "s"
                                                        : ""
                                                    }`;

                                              return (
                                                <div
                                                  key={plan.id}
                                                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-purple-50"
                                                >
                                                  <RadioGroupItem
                                                    value={plan.id}
                                                    id={`plan-${plan.id}`}
                                                  />
                                                  <div className="flex-1">
                                                    <Label
                                                      htmlFor={`plan-${plan.id}`}
                                                      className="cursor-pointer"
                                                    >
                                                      <div className="font-medium flex items-center gap-2">
                                                        {plan.name ||
                                                          `${planDuration} Plan`}
                                                        {plan.isDefault && (
                                                          <Badge className="bg-purple-500 text-xs">
                                                            Most Popular
                                                          </Badge>
                                                        )}
                                                        {course?.isUnderSubscription && (
                                                          <Badge
                                                            variant="outline"
                                                            className="text-xs text-green-600 border-green-600"
                                                          >
                                                            Course Included
                                                          </Badge>
                                                        )}
                                                        {!course?.isUnderSubscription &&
                                                          discountPercentage >
                                                            0 && (
                                                            <Badge
                                                              variant="outline"
                                                              className="text-xs text-green-600 border-green-600"
                                                            >
                                                              {
                                                                discountPercentage
                                                              }
                                                              % OFF Course
                                                            </Badge>
                                                          )}
                                                      </div>
                                                      <div className="text-sm text-gray-600">
                                                        {planDuration}{" "}
                                                        subscription
                                                      </div>
                                                    </Label>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="text-sm text-gray-600">
                                                      <span>
                                                        Subscription: ৳
                                                        {convertNumberToBangla(
                                                          Math.round(
                                                            subscriptionPrice
                                                          )
                                                        )}
                                                      </span>
                                                    </div>
                                                    <div className="text-sm text-green-600">
                                                      {course?.isUnderSubscription ? (
                                                        <span className="font-medium text-green-600">
                                                          Course: Free
                                                        </span>
                                                      ) : (
                                                        <div>
                                                          {discountPercentage >
                                                          0 ? (
                                                            <>
                                                              <span className="line-through">
                                                                ৳
                                                                {convertNumberToBangla(
                                                                  originalCoursePrice
                                                                )}
                                                              </span>{" "}
                                                              <span className="font-medium">
                                                                ৳
                                                                {convertNumberToBangla(
                                                                  Math.round(
                                                                    coursePrice
                                                                  )
                                                                )}
                                                              </span>{" "}
                                                              <span className="text-xs">
                                                                (
                                                                {
                                                                  discountPercentage
                                                                }
                                                                % off)
                                                              </span>
                                                            </>
                                                          ) : (
                                                            <span>
                                                              Course: ৳
                                                              {convertNumberToBangla(
                                                                originalCoursePrice
                                                              )}
                                                            </span>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="text-lg font-bold text-purple-600">
                                                      Total: ৳
                                                      {convertNumberToBangla(
                                                        Math.round(totalPrice)
                                                      )}
                                                    </div>
                                                    {totalSavings > 0 && (
                                                      <div className="text-xs text-gray-500">
                                                        Save ৳
                                                        {convertNumberToBangla(
                                                          Math.round(
                                                            totalSavings
                                                          )
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </RadioGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}

                            {/* Show message for users with active subscription */}
                            {hasActiveSubscription && (
                              <div className="ml-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-green-700">
                                    Active{" "}
                                    {userSubscription.subscriptionPlan.name}{" "}
                                    Subscription Detected
                                  </span>
                                </div>
                                <p className="text-sm text-green-600 mt-1">
                                  {course?.isUnderSubscription
                                    ? "This course is included with your active subscription - no additional charge!"
                                    : `You have ${
                                        userSubscription.subscriptionPlan
                                          .subscriptionDiscount
                                          ?.discountPercentage || 0
                                      }% discount with your subscription!`}
                                </p>
                                {/* Show price breakdown for courses not under subscription */}
                                {!course?.isUnderSubscription && (
                                  <div className="mt-2 p-2 bg-white rounded border">
                                    <div className="text-sm">
                                      <span className="text-gray-600">
                                        Regular Price:{" "}
                                      </span>
                                      <span className="line-through text-gray-500">
                                        ৳{convertNumberToBangla(regularAmount)}
                                      </span>
                                    </div>
                                    <div className="text-sm font-medium text-green-700">
                                      <span>Your Subscriber Price: </span>
                                      <span className="text-lg">
                                        {getSecondOptionDisplayPrice()}
                                      </span>
                                      <span className="text-xs ml-1">
                                        (
                                        {userSubscription.subscriptionPlan
                                          .subscriptionDiscount
                                          ?.discountPercentage || 0}
                                        % off)
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Input - Always show but conditionally require */}
        {!data?.user?.email && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address{" "}
                  {!isSignedIn && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                    disabled={!!data?.user?.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {userSubscription && userSubscription?.isTrial && (
          <p className="text-xs text-gray-600 text-center">
            To unlock all premium features, please buy to a subscription plan.
          </p>
        )}

        {/* Checkout Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : `Complete Purchase - ৳${convertNumberToBangla(selectedAmount)}`}
        </Button>

        <p className="text-sm text-gray-600 text-center">
          You will be redirected to Bkash for secure payment processing.
        </p>
      </form>
    </Form>
  );
};

export default CourseCheckoutForm;

// -----------v2-------------------
// "use client";
// import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import { CreditCard, AlertCircle, ArrowRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSession } from "next-auth/react";
// import { PurchaseType } from "@prisma/client";
// import { useRouter } from "next/navigation";
// import { handleCheckout } from "@/lib/actions/checkout";
// import { CheckoutStorage } from "@/lib/utils/storage/checkoutEmailStorage";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { getUserCurrentSubscriptionDBCall } from "@/lib/data-access-layer/getUserCurrentSubscription";

// // Form validation schema - removed courseId and amount since they're not form fields anymore
// const formSchema = z.object({
//   type: z.enum([
//     PurchaseType.SINGLE_COURSE,
//     PurchaseType.SUBSCRIPTION,
//     PurchaseType.OFFER,
//   ]),
//   planId: z.string().optional(),
//   email: z.string().email("Please enter a valid email address"),
// });

// const CourseCheckoutForm = ({
//   course,
//   savedPriceType,
//   hasDiscount,
//   discountedAmount,
//   regularAmount,
//   isSignedIn,
//   availableSubscriptionPlans,
//   defaultSelectedPlan,
//   userSubscription: userSubscriptionData,
// }) => {
//   const router = useRouter();
//   const [selectedType, setSelectedType] = useState(savedPriceType);
//   const [selectedPlan, setSelectedPlan] = useState(defaultSelectedPlan);
//   const [selectedAmount, setSelectedAmount] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [emailContinued, setEmailContinued] = useState(false);
//   const [isEmailProcessing, setIsEmailProcessing] = useState(false);
//   const [storedEmail, setStoredEmail] = useState("");
//   const [userSubscription, setUserSubscription] =
//     useState(userSubscriptionData);
//   const { data } = useSession();

//   const getUserSubscriptionStatus = () => {
//     const activeSubscription =
//       userSubscription &&
//       userSubscription.status === "ACTIVE" &&
//       !userSubscription?.isTrial;

//     const expiredSubscription =
//       userSubscription && userSubscription.status === "EXPIRED";
//     const inActiveSubscription =
//       userSubscription && userSubscription.status === "INACTIVE";
//     const canceledSubscription =
//       userSubscription && userSubscription.status === "CANCELLED";
//     const pendingSubscription =
//       userSubscription && userSubscription.status === "PENDING";

//     switch (activeSubscription) {
//       case true:
//         return "ACTIVE";
//       case expiredSubscription:
//         return "EXPIRED";
//       case inActiveSubscription:
//         return "INACTIVE";
//       case canceledSubscription:
//         return "CANCELLED";
//       case pendingSubscription:
//         return "PENDING";
//       default:
//         return "NO_SUBSCRIPTION";
//     }
//   };

//   // Check if user has active subscription
//   const hasActiveSubscription =
//     userSubscription &&
//     userSubscription.status === "ACTIVE" &&
//     !userSubscription?.isTrial;

//   // Initialize email continuation state
//   useEffect(() => {
//     if (data?.user?.email) {
//       // User is signed in, skip email step
//       setEmailContinued(true);
//       setStoredEmail(data.user.email);
//     } else {
//       // Check if email was previously stored
//       const savedEmail = CheckoutStorage.getEmail();
//       if (savedEmail) {
//         setStoredEmail(savedEmail);
//         setEmailContinued(true);
//       }
//     }
//   }, [data?.user?.email]);

//   // Determine the second option type and details
//   const getSecondOptionDetails = () => {
//     if (course?.isUnderSubscription) {
//       return {
//         type: PurchaseType.SUBSCRIPTION,
//         title: "Price With Subscription",
//         description: hasActiveSubscription
//           ? "This course is included with your subscription - Free!"
//           : "Get a subscription plan and access this course for free",
//         showPrice: !hasActiveSubscription,
//       };
//     } else {
//       return {
//         type: PurchaseType.OFFER,
//         title: "Price With Subscription",
//         description: hasActiveSubscription
//           ? "Get this course at your subscriber discount price"
//           : "Get a subscription plan + this course at discounted price",
//         showPrice: true,
//       };
//     }
//   };

//   const secondOption = getSecondOptionDetails();

//   // Initialize form
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       type: savedPriceType,
//       planId: defaultSelectedPlan,
//       email: data?.user?.email || CheckoutStorage.getEmail() || "",
//     },
//   });

//   // Clear error when form values change
//   const watchedValues = form.watch();
//   // clear error message when form values change
//   useEffect(() => {
//     if (form.formState.isDirty) {
//       setErrorMessage("");
//     }
//   }, [form.formState.isDirty]);

//   useEffect(() => {
//     let amount = 0;
//     if (selectedType === PurchaseType.SINGLE_COURSE) {
//       amount = hasDiscount ? discountedAmount : regularAmount;
//     } else if (selectedType === secondOption.type) {
//       if (hasActiveSubscription) {
//         // User has active subscription - apply their subscription discount
//         if (course?.isUnderSubscription) {
//           // Course is included in subscription
//           amount = 0;
//         } else {
//           // Apply user's subscription discount to course price
//           const discountPercentage =
//             userSubscription?.subscriptionPlan?.subscriptionDiscount
//               ?.discountPercentage || 0;
//           const courseDiscount = regularAmount * (discountPercentage / 100);
//           amount = regularAmount - courseDiscount;
//         }
//       } else {
//         // User doesn't have subscription
//         const plan = availableSubscriptionPlans.find(
//           (p) => p.id === selectedPlan
//         );
//         if (plan) {
//           const subscriptionPrice = plan.regularPrice;
//           if (course?.isUnderSubscription) {
//             // Course is free with subscription
//             amount = subscriptionPrice;
//           } else {
//             // Course gets discount with subscription
//             const discountPercentage =
//               plan.subscriptionDiscount?.discountPercentage || 0;
//             const courseDiscount = regularAmount * (discountPercentage / 100);
//             const coursePrice = regularAmount - courseDiscount;
//             amount = subscriptionPrice + coursePrice;
//           }
//         }
//       }
//     }
//     const finalAmount = Math.round(amount);
//     setSelectedAmount(finalAmount);
//   }, [
//     selectedType,
//     selectedPlan,
//     hasDiscount,
//     discountedAmount,
//     regularAmount,
//     hasActiveSubscription,
//     course,
//     availableSubscriptionPlans,
//     userSubscription,
//   ]);

//   // Update form values when state changes
//   useEffect(() => {
//     form.setValue("type", selectedType);
//     if (selectedType === secondOption.type && !hasActiveSubscription) {
//       form.setValue("planId", selectedPlan);
//     }
//   }, [
//     selectedType,
//     selectedPlan,
//     form,
//     secondOption.type,
//     hasActiveSubscription,
//   ]);

//   // Calculate display price for second option header
//   const getSecondOptionDisplayPrice = () => {
//     if (hasActiveSubscription) {
//       if (course?.isUnderSubscription) {
//         return "Free";
//       } else {
//         const discountPercentage =
//           userSubscription?.subscriptionPlan?.subscriptionDiscount
//             ?.discountPercentage || 0;
//         const courseDiscount = regularAmount * (discountPercentage / 100);
//         const discountedPrice = regularAmount - courseDiscount;
//         return `৳${convertNumberToBangla(Math.round(discountedPrice))}`;
//       }
//     }
//     return null;
//   };

//   // Handle email continue
//   const handleEmailContinue = async () => {
//     const email = form.getValues("email");

//     // Validate email
//     if (!email || !email.includes("@")) {
//       form.setError("email", {
//         type: "manual",
//         message: "Please enter a valid email address",
//       });
//       return;
//     }

//     setIsEmailProcessing(true);
//     setErrorMessage("");

//     try {
//       const response = await getUserCurrentSubscriptionDBCall(email);
//       if (response) {
//         setUserSubscription(response);
//       } else {
//         setUserSubscription(null);
//       }

//       // Store email
//       CheckoutStorage.saveEmail(email);
//       setStoredEmail(email);
//       setEmailContinued(true);

//       console.log("Email processed:", email);
//     } catch (error) {
//       console.error("Email processing error:", error);
//       setErrorMessage("Failed to process email. Please try again.");
//     } finally {
//       setIsEmailProcessing(false);
//     }
//   };

//   // Handle form submission
//   const onSubmit = async (values) => {
//     setIsProcessing(true);
//     setErrorMessage("");

//     try {
//       // Create FormData object with all necessary data
//       const formData = new FormData();
//       formData.append("courseId", course?.id || "");
//       formData.append("type", values.type);
//       formData.append("amount", selectedAmount.toString());

//       if (values.planId) {
//         formData.append("planId", values.planId);
//       }

//       // Use stored email, form email, or session email
//       const emailToUse = storedEmail || values.email || data?.user?.email;
//       if (emailToUse) {
//         formData.append("email", emailToUse);
//       }

//       const result = await handleCheckout(formData);
//       console.log("Checkout result:", result.message);

//       if (result.success) {
//         router.push("/checkout/success");
//         console.log("Checkout successful:", result);
//       } else {
//         // Handle error
//         console.error("Checkout failed:", result);
//         setErrorMessage(
//           result.message ||
//             "An error occurred during checkout. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//       setErrorMessage("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Email Input Section - Always show first if user not signed in */}
//         {!data?.user?.email && (
//           <div className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Email Address <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="Enter your email address"
//                       {...field}
//                       disabled={emailContinued}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {!emailContinued && (
//               <Button
//                 type="button"
//                 onClick={handleEmailContinue}
//                 disabled={isEmailProcessing}
//                 className="w-full"
//                 variant="outline"
//               >
//                 {isEmailProcessing ? (
//                   "Processing..."
//                 ) : (
//                   <>
//                     Continue
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </>
//                 )}
//               </Button>
//             )}

//             {emailContinued && (
//               <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span className="text-sm font-medium text-green-700">
//                     Email confirmed: {storedEmail}
//                   </span>
//                 </div>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setEmailContinued(false);
//                     setStoredEmail("");
//                     CheckoutStorage.saveEmail("");
//                     form.setValue("email", "");
//                   }}
//                   className="text-green-600 hover:text-green-800 h-auto p-1"
//                 >
//                   Change
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Show user email if signed in */}
//         {data?.user?.email && (
//           <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//               <span className="text-sm font-medium text-blue-700">
//                 Signed in as: {data.user.email}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Pricing Options - Always visible but disabled until email is processed */}
//         <FormField
//           control={form.control}
//           name="type"
//           render={({ field }) => (
//             <FormItem className="space-y-4">
//               <FormLabel className="text-base font-medium">
//                 Select Pricing Option
//               </FormLabel>
//               <FormControl>
//                 <RadioGroup
//                   value={selectedType}
//                   onValueChange={(value) => {
//                     // Only allow changes if email is processed or user is signed in
//                     if (emailContinued || data?.user?.email) {
//                       setSelectedType(value);
//                       field.onChange(value);
//                     }
//                   }}
//                   disabled={!emailContinued && !data?.user?.email}
//                   className={`${
//                     !emailContinued && !data?.user?.email
//                       ? "opacity-50 pointer-events-none"
//                       : ""
//                   }`}
//                 >
//                   {/* Regular Price Option */}
//                   <div
//                     className={`flex items-center space-x-3 p-4 border rounded-lg ${
//                       emailContinued || data?.user?.email
//                         ? "hover:bg-gray-50"
//                         : "cursor-not-allowed"
//                     }`}
//                   >
//                     <RadioGroupItem
//                       value={PurchaseType.SINGLE_COURSE}
//                       id={PurchaseType.SINGLE_COURSE}
//                       disabled={!emailContinued && !data?.user?.email}
//                     />
//                     <div className="flex-1">
//                       <Label
//                         htmlFor={PurchaseType.SINGLE_COURSE}
//                         className={`flex items-center gap-2 ${
//                           emailContinued || data?.user?.email
//                             ? "cursor-pointer"
//                             : "cursor-not-allowed"
//                         }`}
//                       >
//                         <CreditCard className="h-4 w-4" />
//                         <span className="font-medium">Regular Price</span>
//                       </Label>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Standard course pricing
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-lg font-bold text-blue-600">
//                         ৳
//                         {convertNumberToBangla(
//                           hasDiscount ? discountedAmount : regularAmount
//                         )}
//                       </span>
//                       {hasDiscount && (
//                         <div className="text-sm text-gray-500 line-through">
//                           ৳{convertNumberToBangla(regularAmount)}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Second Option - Dynamic based on course subscription status */}
//                   {availableSubscriptionPlans.length > 0 && (
//                     <div
//                       className={`border rounded-lg p-4 ${
//                         hasActiveSubscription ? "bg-green-50" : ""
//                       } ${
//                         emailContinued || data?.user?.email
//                           ? ""
//                           : "cursor-not-allowed"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3 mb-4">
//                         <RadioGroupItem
//                           value={secondOption.type}
//                           id={secondOption.type}
//                           disabled={!emailContinued && !data?.user?.email}
//                         />
//                         <div className="flex-1">
//                           <Label
//                             htmlFor={secondOption.type}
//                             className={`flex items-center gap-2 ${
//                               emailContinued || data?.user?.email
//                                 ? "cursor-pointer"
//                                 : "cursor-not-allowed"
//                             }`}
//                           >
//                             <CreditCard className="h-4 w-4" />
//                             <span
//                               className={`font-medium ${
//                                 hasActiveSubscription
//                                   ? "text-green-700"
//                                   : "text-purple-700"
//                               }`}
//                             >
//                               {secondOption.title}
//                             </span>
//                           </Label>
//                           <p
//                             className={`text-sm mt-1 ${
//                               hasActiveSubscription
//                                 ? "text-green-600"
//                                 : "text-purple-600"
//                             }`}
//                           >
//                             {secondOption.description}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           {hasActiveSubscription && secondOption.showPrice && (
//                             <div
//                               className={`text-lg font-bold ${
//                                 course?.isUnderSubscription
//                                   ? "text-green-600"
//                                   : "text-green-600"
//                               }`}
//                             >
//                               {getSecondOptionDisplayPrice()}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <AnimatePresence>
//                         {selectedType === secondOption.type && (
//                           <motion.div
//                             key="subscription-content"
//                             initial={{
//                               opacity: 0,
//                               height: 0,
//                               overflow: "hidden",
//                             }}
//                             animate={{
//                               opacity: 1,
//                               height: "auto",
//                               overflow: "hidden",
//                             }}
//                             exit={{ opacity: 0, height: 0, overflow: "hidden" }}
//                             transition={{ duration: 0.3, ease: "easeOut" }}
//                           >
//                             {/* Show subscription plans only if user doesn't have active subscription */}
//                             {!hasActiveSubscription &&
//                               availableSubscriptionPlans.length > 0 && (
//                                 <FormField
//                                   control={form.control}
//                                   name="planId"
//                                   render={({ field }) => (
//                                     <FormItem className="ml-6 space-y-3 pl-1">
//                                       <FormLabel className="text-sm font-medium text-gray-700">
//                                         Choose your subscription plan:
//                                       </FormLabel>
//                                       <FormControl>
//                                         <RadioGroup
//                                           value={selectedPlan}
//                                           onValueChange={(value) => {
//                                             // Only allow changes if email is processed or user is signed in
//                                             if (
//                                               emailContinued ||
//                                               data?.user?.email
//                                             ) {
//                                               setSelectedPlan(value);
//                                               field.onChange(value);
//                                             }
//                                           }}
//                                           disabled={
//                                             !emailContinued &&
//                                             !data?.user?.email
//                                           }
//                                         >
//                                           {availableSubscriptionPlans.map(
//                                             (plan) => {
//                                               const discountPercentage =
//                                                 plan.subscriptionDiscount
//                                                   ?.discountPercentage || 0;
//                                               const subscriptionPrice =
//                                                 plan.regularPrice;
//                                               let coursePrice = 0;
//                                               let originalCoursePrice =
//                                                 regularAmount;

//                                               if (course?.isUnderSubscription) {
//                                                 coursePrice = 0;
//                                               } else {
//                                                 const courseDiscount =
//                                                   regularAmount *
//                                                   (discountPercentage / 100);
//                                                 coursePrice =
//                                                   regularAmount -
//                                                   courseDiscount;
//                                               }

//                                               const totalPrice =
//                                                 subscriptionPrice + coursePrice;
//                                               const originalTotalPrice =
//                                                 plan.regularPrice +
//                                                 originalCoursePrice;
//                                               const totalSavings =
//                                                 originalTotalPrice - totalPrice;

//                                               const planDuration =
//                                                 plan.durationInYears
//                                                   ? `${
//                                                       plan.durationInYears
//                                                     } Year${
//                                                       plan.durationInYears > 1
//                                                         ? "s"
//                                                         : ""
//                                                     }`
//                                                   : `${
//                                                       plan.durationInMonths
//                                                     } Month${
//                                                       plan.durationInMonths > 1
//                                                         ? "s"
//                                                         : ""
//                                                     }`;

//                                               return (
//                                                 <div
//                                                   key={plan.id}
//                                                   className={`flex items-center space-x-3 p-3 border rounded-lg ${
//                                                     emailContinued ||
//                                                     data?.user?.email
//                                                       ? "hover:bg-purple-50"
//                                                       : "cursor-not-allowed"
//                                                   }`}
//                                                 >
//                                                   <RadioGroupItem
//                                                     value={plan.id}
//                                                     id={`plan-${plan.id}`}
//                                                     disabled={
//                                                       !emailContinued &&
//                                                       !data?.user?.email
//                                                     }
//                                                   />
//                                                   <div className="flex-1">
//                                                     <Label
//                                                       htmlFor={`plan-${plan.id}`}
//                                                       className={`${
//                                                         emailContinued ||
//                                                         data?.user?.email
//                                                           ? "cursor-pointer"
//                                                           : "cursor-not-allowed"
//                                                       }`}
//                                                     >
//                                                       <div className="font-medium flex items-center gap-2">
//                                                         {plan.name ||
//                                                           `${planDuration} Plan`}
//                                                         {plan.isDefault && (
//                                                           <Badge className="bg-purple-500 text-xs">
//                                                             Most Popular
//                                                           </Badge>
//                                                         )}
//                                                         {course?.isUnderSubscription && (
//                                                           <Badge
//                                                             variant="outline"
//                                                             className="text-xs text-green-600 border-green-600"
//                                                           >
//                                                             Course Included
//                                                           </Badge>
//                                                         )}
//                                                         {!course?.isUnderSubscription &&
//                                                           discountPercentage >
//                                                             0 && (
//                                                             <Badge
//                                                               variant="outline"
//                                                               className="text-xs text-green-600 border-green-600"
//                                                             >
//                                                               {
//                                                                 discountPercentage
//                                                               }
//                                                               % OFF Course
//                                                             </Badge>
//                                                           )}
//                                                       </div>
//                                                       <div className="text-sm text-gray-600">
//                                                         {planDuration}{" "}
//                                                         subscription
//                                                       </div>
//                                                     </Label>
//                                                   </div>
//                                                   <div className="text-right">
//                                                     <div className="text-sm text-gray-600">
//                                                       <span>
//                                                         Subscription: ৳
//                                                         {convertNumberToBangla(
//                                                           Math.round(
//                                                             subscriptionPrice
//                                                           )
//                                                         )}
//                                                       </span>
//                                                     </div>
//                                                     <div className="text-sm text-green-600">
//                                                       {course?.isUnderSubscription ? (
//                                                         <span className="font-medium text-green-600">
//                                                           Course: Free
//                                                         </span>
//                                                       ) : (
//                                                         <div>
//                                                           {discountPercentage >
//                                                           0 ? (
//                                                             <>
//                                                               <span className="line-through">
//                                                                 ৳
//                                                                 {convertNumberToBangla(
//                                                                   originalCoursePrice
//                                                                 )}
//                                                               </span>{" "}
//                                                               <span className="font-medium">
//                                                                 ৳
//                                                                 {convertNumberToBangla(
//                                                                   Math.round(
//                                                                     coursePrice
//                                                                   )
//                                                                 )}
//                                                               </span>{" "}
//                                                               <span className="text-xs">
//                                                                 (
//                                                                 {
//                                                                   discountPercentage
//                                                                 }
//                                                                 % off)
//                                                               </span>
//                                                             </>
//                                                           ) : (
//                                                             <span>
//                                                               Course: ৳
//                                                               {convertNumberToBangla(
//                                                                 originalCoursePrice
//                                                               )}
//                                                             </span>
//                                                           )}
//                                                         </div>
//                                                       )}
//                                                     </div>
//                                                     <div className="text-lg font-bold text-purple-600">
//                                                       Total: ৳
//                                                       {convertNumberToBangla(
//                                                         Math.round(totalPrice)
//                                                       )}
//                                                     </div>
//                                                     {totalSavings > 0 && (
//                                                       <div className="text-xs text-gray-500">
//                                                         Save ৳
//                                                         {convertNumberToBangla(
//                                                           Math.round(
//                                                             totalSavings
//                                                           )
//                                                         )}
//                                                       </div>
//                                                     )}
//                                                   </div>
//                                                 </div>
//                                               );
//                                             }
//                                           )}
//                                         </RadioGroup>
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                               )}

//                             {/* Show message for users with active subscription */}
//                             {hasActiveSubscription && (
//                               <div className="ml-6 p-3 bg-green-50 border border-green-200 rounded-lg">
//                                 <div className="flex items-center gap-2">
//                                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                   <span className="text-sm font-medium text-green-700">
//                                     Active{" "}
//                                     {userSubscription.subscriptionPlan.name}{" "}
//                                     Subscription Detected
//                                   </span>
//                                 </div>
//                                 <p className="text-sm text-green-600 mt-1">
//                                   {course?.isUnderSubscription
//                                     ? "This course is included with your active subscription - no additional charge!"
//                                     : `You have ${
//                                         userSubscription.subscriptionPlan
//                                           .subscriptionDiscount
//                                           ?.discountPercentage || 0
//                                       }% discount with your subscription!`}
//                                 </p>
//                                 {/* Show price breakdown for courses not under subscription */}
//                                 {!course?.isUnderSubscription && (
//                                   <div className="mt-2 p-2 bg-white rounded border">
//                                     <div className="text-sm">
//                                       <span className="text-gray-600">
//                                         Regular Price:{" "}
//                                       </span>
//                                       <span className="line-through text-gray-500">
//                                         ৳{convertNumberToBangla(regularAmount)}
//                                       </span>
//                                     </div>
//                                     <div className="text-sm font-medium text-green-700">
//                                       <span>Your Subscriber Price: </span>
//                                       <span className="text-lg">
//                                         {getSecondOptionDisplayPrice()}
//                                       </span>
//                                       <span className="text-xs ml-1">
//                                         (
//                                         {userSubscription.subscriptionPlan
//                                           .subscriptionDiscount
//                                           ?.discountPercentage || 0}
//                                         % off)
//                                       </span>
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   )}
//                 </RadioGroup>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Error Message */}
//         {errorMessage && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{errorMessage}</AlertDescription>
//           </Alert>
//         )}

//         {userSubscription && userSubscription?.isTrial && (
//           <p className="text-xs text-gray-600 text-center">
//             To unlock all premium features, please buy to a subscription plan.
//           </p>
//         )}

//         {/* Checkout Button */}
//         <Button
//           type="submit"
//           className="w-full"
//           size="lg"
//           disabled={isProcessing || (!emailContinued && !data?.user?.email)}
//         >
//           {isProcessing
//             ? "Processing..."
//             : `Complete Purchase - ৳${convertNumberToBangla(selectedAmount)}`}
//         </Button>

//         <p className="text-sm text-gray-600 text-center">
//           You will be redirected to Bkash for secure payment processing.
//         </p>
//       </form>
//     </Form>
//   );
// };

// export default CourseCheckoutForm;

// ------------------- updated version ---------------------------
// "use client";
// import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import { CreditCard, AlertCircle, ArrowRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSession } from "next-auth/react";
// import { PurchaseType, SubscriptionStatus } from "@prisma/client";
// import { useRouter } from "next/navigation";
// import { handleCheckout } from "@/lib/actions/checkout";
// import { CheckoutStorage } from "@/lib/utils/storage/checkoutEmailStorage";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { getUserCurrentSubscriptionDBCall } from "@/lib/data-access-layer/getUserCurrentSubscription";
// import Link from "next/link";

// // Form validation schema - removed courseId and amount since they're not form fields anymore
// const formSchema = z.object({
//   type: z.enum([
//     PurchaseType.SINGLE_COURSE,
//     PurchaseType.SUBSCRIPTION,
//     PurchaseType.OFFER,
//   ]),
//   planId: z.string().optional(),
//   email: z.string().email("Please enter a valid email address"),
// });

// const CourseCheckoutForm = ({
//   course,
//   savedPriceType,
//   hasDiscount,
//   discountedAmount,
//   regularAmount,
//   isSignedIn,
//   availableSubscriptionPlans,
//   defaultSelectedPlan,
//   userSubscription: userSubscriptionData,
// }) => {
//   const router = useRouter();
//   const [selectedType, setSelectedType] = useState(savedPriceType);
//   const [selectedPlan, setSelectedPlan] = useState(defaultSelectedPlan);
//   const [selectedAmount, setSelectedAmount] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [emailContinued, setEmailContinued] = useState(false);
//   const [isEmailProcessing, setIsEmailProcessing] = useState(false);
//   const [storedEmail, setStoredEmail] = useState("");
//   const [userSubscription, setUserSubscription] =
//     useState(userSubscriptionData);
//   const { data } = useSession();

//   const getUserMessage = () => {
//     if (!userSubscription) {
//       return null;
//     }
//     if (userSubscription?.isTrial) {
//       return "You are currently on a trial subscription. Upgrade to continue enjoying benefits.";
//     }

//     if (userSubscription?.status === SubscriptionStatus.ACTIVE) {
//       return "You have an active subscription. Enjoy your course!";
//     }

//     if (userSubscription?.status === SubscriptionStatus.EXPIRED) {
//       return "Your subscription has expired. Please renew to continue accessing courses.";
//     }

//     return null;
//   };

//   console.log(userSubscription, "user subscription");
//   console.log(selectedType, "selected type");

//   // Check if user has active subscription
//   const hasActiveSubscription =
//     userSubscription &&
//     userSubscription.status === "ACTIVE" &&
//     !userSubscription?.isTrial;

//   // Check if user has active subscription()
//   const hasActiveTrialSubscription =
//     userSubscription &&
//     userSubscription.status === "ACTIVE" &&
//     userSubscription?.isTrial;

//   // Initialize email continuation state
//   useEffect(() => {
//     if (data?.user?.email) {
//       // User is signed in, skip email step
//       setEmailContinued(true);
//       setStoredEmail(data.user.email);
//     } else {
//       // Check if email was previously stored
//       const savedEmail = CheckoutStorage.getEmail();
//       if (savedEmail) {
//         setStoredEmail(savedEmail);
//         setEmailContinued(true);
//       }
//     }
//   }, [data?.user?.email]);

//   // Determine the second option type and details
//   const getSecondOptionDetails = () => {
//     if (course?.isUnderSubscription) {
//       return {
//         type: PurchaseType.SUBSCRIPTION,
//         title: "Price With Subscription",
//         description: hasActiveSubscription
//           ? "This course is included with your subscription - Free!"
//           : "Get a subscription plan and access this course for free",
//         showPrice: !hasActiveSubscription,
//       };
//     } else {
//       return {
//         type: PurchaseType.OFFER,
//         title: "Price With Subscription",
//         description: hasActiveSubscription
//           ? "Get this course at your subscriber discount price"
//           : "Get a subscription plan + this course at discounted price",
//         showPrice: true,
//       };
//     }
//   };

//   const secondOption = getSecondOptionDetails();

//   // Initialize form
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       type: savedPriceType,
//       planId: defaultSelectedPlan,
//       email: data?.user?.email || CheckoutStorage.getEmail(),
//     },
//   });

//   // clear error message when form values change
//   // useEffect(() => {
//   //   if (form.formState.isDirty) {
//   //     setErrorMessage("");
//   //   }
//   // }, [form.formState.isDirty]);

//   useEffect(() => {
//     let amount = 0;
//     if (selectedType === PurchaseType.SINGLE_COURSE) {
//       amount = hasDiscount ? discountedAmount : regularAmount;
//     } else if (selectedType === secondOption.type) {
//       if (hasActiveSubscription) {
//         // User has active subscription - apply their subscription discount
//         if (course?.isUnderSubscription) {
//           // Course is included in subscription
//           amount = 0;
//         } else {
//           // Apply user's subscription discount to course price
//           const discountPercentage =
//             userSubscription?.subscriptionPlan?.subscriptionDiscount
//               ?.discountPercentage || 0;
//           const courseDiscount = regularAmount * (discountPercentage / 100);
//           amount = regularAmount - courseDiscount;
//         }
//       } else {
//         // User doesn't have subscription
//         const plan = availableSubscriptionPlans.find(
//           (p) => p.id === selectedPlan
//         );
//         if (plan) {
//           const subscriptionPrice = plan.regularPrice;
//           if (course?.isUnderSubscription) {
//             // Course is free with subscription
//             amount = subscriptionPrice;
//           } else {
//             // Course gets discount with subscription
//             const discountPercentage =
//               plan.subscriptionDiscount?.discountPercentage || 0;
//             const courseDiscount = regularAmount * (discountPercentage / 100);
//             const coursePrice = regularAmount - courseDiscount;
//             amount = subscriptionPrice + coursePrice;
//           }
//         }
//       }
//     }
//     const finalAmount = Math.round(amount);
//     setSelectedAmount(finalAmount);
//   }, [
//     selectedType,
//     selectedPlan,
//     hasDiscount,
//     discountedAmount,
//     regularAmount,
//     hasActiveSubscription,
//     course,
//     availableSubscriptionPlans,
//     userSubscription,
//   ]);

//   // Update form values when state changes
//   useEffect(() => {
//     form.setValue("type", selectedType);
//     if (selectedType === secondOption.type && !hasActiveSubscription) {
//       form.setValue("planId", selectedPlan);
//     }
//   }, [
//     selectedType,
//     selectedPlan,
//     form,
//     secondOption.type,
//     hasActiveSubscription,
//   ]);

//   // Calculate display price for second option header
//   const getSecondOptionDisplayPrice = () => {
//     if (hasActiveSubscription) {
//       if (course?.isUnderSubscription) {
//         return "Free";
//       } else {
//         const discountPercentage =
//           userSubscription?.subscriptionPlan?.subscriptionDiscount
//             ?.discountPercentage || 0;
//         const courseDiscount = regularAmount * (discountPercentage / 100);
//         const discountedPrice = regularAmount - courseDiscount;
//         return `৳${convertNumberToBangla(Math.round(discountedPrice))}`;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     (async () => {
//       await handleEmailContinue();
//       form.clearErrors();
//     })();
//   }, [CheckoutStorage.getEmail()]);

//   // Handle email continue
//   const handleEmailContinue = async () => {
//     const email = form.getValues("email") || CheckoutStorage.getEmail();

//     // Validate email
//     if (!email || !email.includes("@")) {
//       form.setError("email", {
//         type: "manual",
//         message: "Please enter a valid email address",
//       });
//       return;
//     }

//     setIsEmailProcessing(true);
//     setErrorMessage("");

//     try {
//       const response = await getUserCurrentSubscriptionDBCall(email);
//       if (response) {
//         setUserSubscription(response);
//       } else {
//         setUserSubscription(null);
//       }

//       // Store email
//       CheckoutStorage.saveEmail(email);
//       setStoredEmail(email);
//       setEmailContinued(true);

//       console.log("Email processed:", email);
//     } catch (error) {
//       console.error("Email processing error:", error);
//       setErrorMessage("Failed to process email. Please try again.");
//     } finally {
//       setIsEmailProcessing(false);
//     }
//   };

//   // Handle form submission
//   const onSubmit = async (values) => {
//     setIsProcessing(true);
//     setErrorMessage("");
//     console.log(values, "values");
//     // try {
//     //   // Create FormData object with all necessary data
//     //   const formData = new FormData();
//     //   formData.append("courseId", course?.id || "");
//     //   formData.append("type", values.type);
//     //   formData.append("amount", selectedAmount.toString());

//     //   if (values.planId) {
//     //     formData.append("planId", values.planId);
//     //   }

//     //   // Use stored email, form email, or session email
//     //   const emailToUse = storedEmail || values.email || data?.user?.email;
//     //   if (emailToUse) {
//     //     formData.append("email", emailToUse);
//     //   }

//     //   const result = await handleCheckout(formData);
//     //   console.log("Checkout result:", result.message);

//     //   if (result.success) {
//     //     router.push("/checkout/success");
//     //     console.log("Checkout successful:", result);
//     //   } else {
//     //     // Handle error
//     //     console.error("Checkout failed:", result);
//     //     setErrorMessage(
//     //       result.message ||
//     //         "An error occurred during checkout. Please try again."
//     //     );
//     //   }
//     // } catch (error) {
//     //   console.error("Unexpected error:", error);
//     //   setErrorMessage("An unexpected error occurred. Please try again.");
//     // } finally {
//     //   setIsProcessing(false);
//     //   CheckoutStorage.clearEmail();
//     //   setStoredEmail("");
//     //   setEmailContinued(false);
//     //   form.reset({
//     //     email: "",
//     //   });
//     // }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Email Input Section - Always show first if user not signed in */}
//         {!data?.user?.email && !emailContinued && (
//           <div className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Email Address <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="Enter your email address"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {!emailContinued && (
//               <Button
//                 type="button"
//                 onClick={handleEmailContinue}
//                 disabled={isEmailProcessing}
//                 className="w-full"
//                 variant="outline"
//               >
//                 {isEmailProcessing ? (
//                   "Processing..."
//                 ) : (
//                   <>
//                     Continue
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>
//         )}
//         {!data?.user?.email && emailContinued && (
//           <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span className="text-sm font-medium text-green-700">
//                 {storedEmail}
//               </span>
//             </div>
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => {
//                 setEmailContinued(false);
//                 setStoredEmail("");
//                 CheckoutStorage.saveEmail("");
//                 form.setValue("email", "");
//               }}
//               className="text-green-600 hover:text-green-800 h-auto p-1"
//             >
//               Change
//             </Button>
//           </div>
//         )}

//         {/* Show user email if signed in */}
//         {data?.user?.email && (
//           <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//               <span className="text-sm font-medium text-blue-700">
//                 Signed in as: {data.user.email}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Pricing Options - Always visible but disabled until email is processed */}
//         <FormField
//           control={form.control}
//           name="type"
//           render={({ field }) => (
//             <FormItem className="space-y-4">
//               <FormLabel className="text-base font-medium">
//                 Select Pricing Option
//               </FormLabel>
//               <FormControl>
//                 <RadioGroup
//                   value={selectedType}
//                   onValueChange={(value) => {
//                     // Only allow changes if email is processed or user is signed in
//                     if (emailContinued || data?.user?.email) {
//                       setSelectedType(value);
//                       field.onChange(value);
//                     }
//                   }}
//                   disabled={!emailContinued && !data?.user?.email}
//                   className={`${
//                     !emailContinued && !data?.user?.email
//                       ? "opacity-50 pointer-events-none"
//                       : ""
//                   }`}
//                 >
//                   {/* Regular Price Option */}
//                   <div
//                     className={`flex items-center space-x-3 p-4 border rounded-lg ${
//                       emailContinued || data?.user?.email
//                         ? "hover:bg-gray-50"
//                         : "cursor-not-allowed"
//                     }`}
//                   >
//                     <RadioGroupItem
//                       value={PurchaseType.SINGLE_COURSE}
//                       id={PurchaseType.SINGLE_COURSE}
//                       disabled={!emailContinued && !data?.user?.email}
//                     />
//                     <div className="flex-1">
//                       <Label
//                         htmlFor={PurchaseType.SINGLE_COURSE}
//                         className={`flex items-center gap-2 ${
//                           emailContinued || data?.user?.email
//                             ? "cursor-pointer"
//                             : "cursor-not-allowed"
//                         }`}
//                       >
//                         <CreditCard className="h-4 w-4" />
//                         <span className="font-medium">Regular Price</span>
//                       </Label>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Standard course pricing
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-lg font-bold text-blue-600">
//                         ৳
//                         {convertNumberToBangla(
//                           hasDiscount ? discountedAmount : regularAmount
//                         )}
//                       </span>
//                       {hasDiscount && (
//                         <div className="text-sm text-gray-500 line-through">
//                           ৳{convertNumberToBangla(regularAmount)}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Second Option - Dynamic based on course subscription status */}
//                   {availableSubscriptionPlans.length > 0 && (
//                     <div
//                       className={`border rounded-lg p-4 ${
//                         hasActiveSubscription ? "bg-green-50" : ""
//                       } ${
//                         emailContinued || data?.user?.email
//                           ? ""
//                           : "cursor-not-allowed"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3 mb-4">
//                         <RadioGroupItem
//                           value={secondOption.type}
//                           id={secondOption.type}
//                           disabled={!emailContinued && !data?.user?.email}
//                         />
//                         <div className="flex-1">
//                           <Label
//                             htmlFor={secondOption.type}
//                             className={`flex items-center gap-2 ${
//                               emailContinued || data?.user?.email
//                                 ? "cursor-pointer"
//                                 : "cursor-not-allowed"
//                             }`}
//                           >
//                             <CreditCard className="h-4 w-4" />
//                             <span
//                               className={`font-medium ${
//                                 hasActiveSubscription
//                                   ? "text-green-700"
//                                   : "text-purple-700"
//                               }`}
//                             >
//                               {secondOption.title}
//                             </span>
//                           </Label>
//                           <p
//                             className={`text-sm mt-1 ${
//                               hasActiveSubscription
//                                 ? "text-green-600"
//                                 : "text-purple-600"
//                             }`}
//                           >
//                             {secondOption.description}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           {hasActiveSubscription && secondOption.showPrice && (
//                             <div
//                               className={`text-lg font-bold ${
//                                 course?.isUnderSubscription
//                                   ? "text-green-600"
//                                   : "text-green-600"
//                               }`}
//                             >
//                               {getSecondOptionDisplayPrice()}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <AnimatePresence>
//                         {selectedType === secondOption.type && (
//                           <motion.div
//                             key="subscription-content"
//                             initial={{
//                               opacity: 0,
//                               height: 0,
//                               overflow: "hidden",
//                             }}
//                             animate={{
//                               opacity: 1,
//                               height: "auto",
//                               overflow: "hidden",
//                             }}
//                             exit={{ opacity: 0, height: 0, overflow: "hidden" }}
//                             transition={{ duration: 0.3, ease: "easeOut" }}
//                           >
//                             {/* Show subscription plans only if user doesn't have active subscription */}
//                             {(hasActiveTrialSubscription &&
//                               course?.isUnderSubscription) ||
//                               (!hasActiveSubscription &&
//                                 availableSubscriptionPlans.length > 0 && (
//                                   <FormField
//                                     control={form.control}
//                                     name="planId"
//                                     render={({ field }) => (
//                                       <FormItem className="ml-6 space-y-3 pl-1">
//                                         <FormLabel className="text-sm font-medium text-gray-700">
//                                           Choose your subscription plan:
//                                         </FormLabel>
//                                         <FormControl>
//                                           <RadioGroup
//                                             value={selectedPlan}
//                                             onValueChange={(value) => {
//                                               // Only allow changes if email is processed or user is signed in
//                                               if (
//                                                 emailContinued ||
//                                                 data?.user?.email
//                                               ) {
//                                                 setSelectedPlan(value);
//                                                 field.onChange(value);
//                                               }
//                                             }}
//                                             disabled={
//                                               !emailContinued &&
//                                               !data?.user?.email
//                                             }
//                                           >
//                                             {availableSubscriptionPlans.map(
//                                               (plan) => {
//                                                 const discountPercentage =
//                                                   plan.subscriptionDiscount
//                                                     ?.discountPercentage || 0;
//                                                 const subscriptionPrice =
//                                                   plan.regularPrice;
//                                                 let coursePrice = 0;
//                                                 let originalCoursePrice =
//                                                   regularAmount;

//                                                 if (
//                                                   course?.isUnderSubscription
//                                                 ) {
//                                                   coursePrice = 0;
//                                                 } else {
//                                                   const courseDiscount =
//                                                     regularAmount *
//                                                     (discountPercentage / 100);
//                                                   coursePrice =
//                                                     regularAmount -
//                                                     courseDiscount;
//                                                 }

//                                                 const totalPrice =
//                                                   subscriptionPrice +
//                                                   coursePrice;
//                                                 const originalTotalPrice =
//                                                   plan.regularPrice +
//                                                   originalCoursePrice;
//                                                 const totalSavings =
//                                                   originalTotalPrice -
//                                                   totalPrice;

//                                                 // const planDuration =
//                                                 //   plan.durationInYears
//                                                 //     ? `${
//                                                 //         plan.durationInYears
//                                                 //       } Year${
//                                                 //         plan.durationInYears > 1
//                                                 //           ? "s"
//                                                 //           : ""
//                                                 //       }`
//                                                 //     : `${
//                                                 //         plan.durationInMonths
//                                                 //       } Month${
//                                                 //         plan.durationInMonths > 1
//                                                 //           ? "s"
//                                                 //           : ""
//                                                 //       }`;

//                                                 const planDuration =
//                                                   plan.isTrial &&
//                                                   plan.trialDurationInDays
//                                                     ? `${
//                                                         plan.trialDurationInDays
//                                                       } Day${
//                                                         plan.trialDurationInDays >
//                                                         1
//                                                           ? "s"
//                                                           : ""
//                                                       }`
//                                                     : plan.durationInYears
//                                                     ? `${
//                                                         plan.durationInYears
//                                                       } Year${
//                                                         plan.durationInYears > 1
//                                                           ? "s"
//                                                           : ""
//                                                       }`
//                                                     : `${
//                                                         plan.durationInMonths
//                                                       } Month${
//                                                         plan.durationInMonths >
//                                                         1
//                                                           ? "s"
//                                                           : ""
//                                                       }`;

//                                                 return (
//                                                   <div
//                                                     key={plan.id}
//                                                     className={`flex items-center space-x-3 p-3 border rounded-lg ${
//                                                       emailContinued ||
//                                                       data?.user?.email
//                                                         ? "hover:bg-purple-50"
//                                                         : "cursor-not-allowed"
//                                                     }`}
//                                                   >
//                                                     <RadioGroupItem
//                                                       value={plan.id}
//                                                       id={`plan-${plan.id}`}
//                                                       disabled={
//                                                         !emailContinued &&
//                                                         !data?.user?.email
//                                                       }
//                                                     />
//                                                     <div className="flex-1">
//                                                       <Label
//                                                         htmlFor={`plan-${plan.id}`}
//                                                         className={`${
//                                                           emailContinued ||
//                                                           data?.user?.email
//                                                             ? "cursor-pointer"
//                                                             : "cursor-not-allowed"
//                                                         }`}
//                                                       >
//                                                         <div className="font-medium flex items-center gap-2">
//                                                           {plan.name ||
//                                                             `${planDuration} Plan`}
//                                                           {plan.isDefault && (
//                                                             <Badge className="bg-purple-500 text-xs">
//                                                               Most Popular
//                                                             </Badge>
//                                                           )}
//                                                           {course?.isUnderSubscription && (
//                                                             <Badge
//                                                               variant="outline"
//                                                               className="text-xs text-green-600 border-green-600"
//                                                             >
//                                                               Course Included
//                                                             </Badge>
//                                                           )}
//                                                           {!course?.isUnderSubscription &&
//                                                             discountPercentage >
//                                                               0 && (
//                                                               <Badge
//                                                                 variant="outline"
//                                                                 className="text-xs text-green-600 border-green-600"
//                                                               >
//                                                                 {
//                                                                   discountPercentage
//                                                                 }
//                                                                 % OFF Course
//                                                               </Badge>
//                                                             )}
//                                                         </div>
//                                                         <div className="text-sm text-gray-600">
//                                                           {planDuration}{" "}
//                                                           subscription
//                                                         </div>
//                                                       </Label>
//                                                     </div>
//                                                     <div className="text-right">
//                                                       <div className="text-sm text-gray-600">
//                                                         <span>
//                                                           Subscription: ৳
//                                                           {convertNumberToBangla(
//                                                             Math.round(
//                                                               subscriptionPrice
//                                                             )
//                                                           )}
//                                                         </span>
//                                                       </div>
//                                                       <div className="text-sm text-green-600">
//                                                         {course?.isUnderSubscription ? (
//                                                           <span className="font-medium text-green-600">
//                                                             Course: Free
//                                                           </span>
//                                                         ) : (
//                                                           <div>
//                                                             {discountPercentage >
//                                                             0 ? (
//                                                               <>
//                                                                 <span className="line-through">
//                                                                   ৳
//                                                                   {convertNumberToBangla(
//                                                                     originalCoursePrice
//                                                                   )}
//                                                                 </span>{" "}
//                                                                 <span className="font-medium">
//                                                                   ৳
//                                                                   {convertNumberToBangla(
//                                                                     Math.round(
//                                                                       coursePrice
//                                                                     )
//                                                                   )}
//                                                                 </span>{" "}
//                                                                 <span className="text-xs">
//                                                                   (
//                                                                   {
//                                                                     discountPercentage
//                                                                   }
//                                                                   % off)
//                                                                 </span>
//                                                               </>
//                                                             ) : (
//                                                               <span>
//                                                                 Course: ৳
//                                                                 {convertNumberToBangla(
//                                                                   originalCoursePrice
//                                                                 )}
//                                                               </span>
//                                                             )}
//                                                           </div>
//                                                         )}
//                                                       </div>
//                                                       <div className="text-lg font-bold text-purple-600">
//                                                         Total: ৳
//                                                         {convertNumberToBangla(
//                                                           Math.round(totalPrice)
//                                                         )}
//                                                       </div>
//                                                       {totalSavings > 0 && (
//                                                         <div className="text-xs text-gray-500">
//                                                           Save ৳
//                                                           {convertNumberToBangla(
//                                                             Math.round(
//                                                               totalSavings
//                                                             )
//                                                           )}
//                                                         </div>
//                                                       )}
//                                                     </div>
//                                                   </div>
//                                                 );
//                                               }
//                                             )}
//                                           </RadioGroup>
//                                         </FormControl>
//                                         <FormMessage />
//                                       </FormItem>
//                                     )}
//                                   />
//                                 ))}

//                             {/* Show message for users with active subscription */}
//                             {hasActiveSubscription ||
//                               (hasActiveTrialSubscription &&
//                                 course?.isUnderSubscription && (
//                                   <div className="ml-6 p-3 bg-green-50 border border-green-200 rounded-lg">
//                                     <div className="flex items-center gap-2">
//                                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                       <span className="text-sm font-medium text-green-700">
//                                         Active{" "}
//                                         {userSubscription.subscriptionPlan.name}{" "}
//                                         Subscription Detected
//                                       </span>
//                                     </div>
//                                     <p className="text-sm text-green-600 mt-1">
//                                       {course?.isUnderSubscription ? (
//                                         <>
//                                           <span>
//                                             This course is included with your
//                                             active subscription - no additional
//                                             charge!
//                                           </span>
//                                           {!data?.user?.email && (
//                                             <Link
//                                               href={"/signin"}
//                                               className="ml-2 font-semibold underline"
//                                             >
//                                               Login
//                                             </Link>
//                                           )}
//                                         </>
//                                       ) : (
//                                         `You have ${
//                                           userSubscription.subscriptionPlan
//                                             .subscriptionDiscount
//                                             ?.discountPercentage || 0
//                                         }% discount with your subscription!`
//                                       )}
//                                     </p>
//                                     {/* Show price breakdown for courses not under subscription */}
//                                     {!course?.isUnderSubscription && (
//                                       <div className="mt-2 p-2 bg-white rounded border">
//                                         <div className="text-sm">
//                                           <span className="text-gray-600">
//                                             Regular Price:{" "}
//                                           </span>
//                                           <span className="line-through text-gray-500">
//                                             ৳
//                                             {convertNumberToBangla(
//                                               regularAmount
//                                             )}
//                                           </span>
//                                         </div>
//                                         <div className="text-sm font-medium text-green-700">
//                                           <span>Your Subscriber Price: </span>
//                                           <span className="text-lg">
//                                             {getSecondOptionDisplayPrice()}
//                                           </span>
//                                           <span className="text-xs ml-1">
//                                             (
//                                             {userSubscription.subscriptionPlan
//                                               .subscriptionDiscount
//                                               ?.discountPercentage || 0}
//                                             % off)
//                                           </span>
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 ))}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   )}
//                 </RadioGroup>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Error Message */}
//         {errorMessage && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{errorMessage}</AlertDescription>
//           </Alert>
//         )}

//         {emailContinued && getUserMessage() && (
//           <p className="text-xs text-gray-600 text-center">
//             {getUserMessage()}
//           </p>
//         )}

//         {/* Checkout Button */}
//         <Button
//           type="submit"
//           className="w-full"
//           size="lg"
//           disabled={
//             isProcessing ||
//             (!emailContinued && !data?.user?.email) ||
//             (course?.isUnderSubscription &&
//               userSubscription?.status === "ACTIVE")
//           }
//         >
//           {isProcessing
//             ? "Processing..."
//             : `Complete Purchase - ৳${convertNumberToBangla(selectedAmount)}`}
//         </Button>

//         <p className="text-sm text-gray-600 text-center">
//           You will be redirected to Bkash for secure payment processing.
//         </p>
//       </form>
//     </Form>
//   );
// };

// export default CourseCheckoutForm;
