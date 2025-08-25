//@ts-nocheck
"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { handleCheckout } from "@/lib/actions/checkout";
import {
  ArrowRight,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { CheckoutStorage } from "@/lib/utils/storage/checkoutEmailStorage";
import { PurchaseType } from "@prisma/client";
import {
  checkUserTrialHistory,
  getSubscriptionDBCall,
} from "@/lib/data-access-layer/subscriptions";
import { getUserCurrentSubscriptionDBCall } from "@/lib/data-access-layer/getUserCurrentSubscription";
import toast from "react-hot-toast";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import Link from "next/link";

const formSchema = z.object({
  planId: z.string(),
  amount: z.number(),
  type: z.nativeEnum(PurchaseType),
  email: z.string().email("Invalid email address"),
});

const SubscriptionCheckoutForm = ({
  plan,
  activeSubscription,
  hasUsedTrial,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [showSubscriptionMessage, setShowSubscriptionMessage] = useState(false);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(
    !!session?.user?.email
  );
  // New states for email confirmation bar
  const [emailContinued, setEmailContinued] = useState(false);
  const [storedEmail, setStoredEmail] = useState(
    CheckoutStorage.getEmail() || ""
  );

  // Check subscription automatically if email exists in local storage
  useEffect(() => {
    if (!session?.user?.email && storedEmail) {
      const checkStoredEmailSubscription = async () => {
        setIsCheckingSubscription(true);
        try {
          const subscription = await getUserCurrentSubscriptionDBCall(
            storedEmail
          );
          setCurrentSubscription(subscription);
          setHasCheckedSubscription(true);
          setEmailContinued(true);
          form.setValue("email", storedEmail);
          if (subscription && new Date(subscription.expiresAt) > new Date()) {
            setShowSubscriptionMessage(true);
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          // If there's an error, we'll just clear the stored email and let the user enter it again
          CheckoutStorage.clearEmail();
          setStoredEmail("");
          setEmailContinued(false);
        } finally {
          setIsCheckingSubscription(false);
        }
      };
      checkStoredEmailSubscription();
    }
  }, [storedEmail, session?.user?.email]);

  const isExpiredSubscription =
    currentSubscription && new Date(currentSubscription.expiresAt) < new Date();
  const hasActiveSubscription =
    currentSubscription && new Date(currentSubscription.expiresAt) > new Date();

  // NEW: Check if user is trying to buy the same subscription plan
  const isSamePlan =
    currentSubscription &&
    hasActiveSubscription &&
    currentSubscription.subscriptionPlanId === plan.id;

  // NEW: Check if user is trying to switch from active plan to trial
  const isSwitchingToTrial =
    hasActiveSubscription && plan.isTrial && !isSamePlan;

  // NEW: Enhanced trial logic - can't use trial if hasUsedTrial is true OR switching from active plan
  const canUseTrial =
    !hasUsedTrial && !currentSubscription && !isSwitchingToTrial;
  const showTrialOption = canUseTrial;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planId: plan.id,
      amount: plan?.offerPrice !== 0 ? plan?.offerPrice : plan.regularPrice,
      // type: showTrialOption ? PurchaseType.TRIAL : PurchaseType.SUBSCRIPTION,
      type: PurchaseType.SUBSCRIPTION, // fallback
      email: session?.user?.email || CheckoutStorage.getEmail() || "",
    },
  });

  // For logged in users, auto-set subscription
  useEffect(() => {
    if (session?.user?.email) {
      setCurrentSubscription(activeSubscription);
      setHasCheckedSubscription(true);
      setEmailContinued(true);
      form.setValue("email", session.user.email);
    }
  }, [session, activeSubscription, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "email" && value.email) {
        CheckoutStorage.saveEmail(value.email);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const checkSubscription = async () => {
    const email = form.getValues("email");
    // Clear any existing email errors first
    form.clearErrors("email");
    if (!email) {
      form.setError("email", {
        type: "required",
        message: "একটি বৈধ ইমেইল দিন",
      });
      return;
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      // console.log("email result:", email);
      form.setError("email", {
        type: "pattern",
        message: "একটি বৈধ ইমেইল দিন",
      });
      return;
    }
    setIsCheckingSubscription(true);
    try {
      const subscription = await getUserCurrentSubscriptionDBCall(email);
      setCurrentSubscription(subscription);
      setHasCheckedSubscription(true);
      // Show confirmation bar
      setStoredEmail(email);
      setEmailContinued(true);
      if (subscription && new Date(subscription.expiresAt) > new Date()) {
        setShowSubscriptionMessage(true);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      form.setError("email", {
        type: "server",
        message: "Failed to check subscription status. Please try again.",
      });
    } finally {
      setIsCheckingSubscription(false);
    }
  };
  // ✅ After subscription check, set correct type dynamically
  useEffect(() => {
    if (showTrialOption) {
      form.setValue("type", PurchaseType.TRIAL);
    } else {
      form.setValue("type", PurchaseType.SUBSCRIPTION);
    }
  }, [showTrialOption, form]);

  // Get current selected purchase type
  async function onSubmit(data) {
    setIsProcessing(true);
    // Clear any existing form errors
    form.clearErrors();
    try {
      const subscriptionPlans = await getSubscriptionDBCall();
      const trialSubscriptionPlan = subscriptionPlans.find(
        (plan) => plan.isTrial
      );
      const formData = new FormData();
      const planId =
        data.type === PurchaseType.TRIAL && trialSubscriptionPlan
          ? trialSubscriptionPlan.id
          : data.planId;
      formData.append("planId", planId);
      formData.append("type", data.type);
      formData.append("email", session?.user?.email || data.email);
      // Only append amount if it's not a trial
      if (data.type !== PurchaseType.TRIAL) {
        formData.append("amount", data.amount);
      } else {
        formData.append("amount", "0");
      }
      const res = await handleCheckout(formData);

      if (res.success) {
        // OPEN BKASH PAYMENT URL
        if (res?.data?.url) {
          router.push(res?.data?.url);
        } else {
          console.log(formData, "formdata");
          toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে");
          router.refresh();
          CheckoutStorage.clearEmail();
        }
      } else {
        toast.error("পেমেন্ট প্রসেসিং এ একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        router.push("/checkout");
      }
    } catch (error) {
      toast.error("ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন!");
    } finally {
      setIsProcessing(false);
    }
  }
  const selectedPurchaseType = form.watch("type");

  const onError = (errors) => {
    console.log("errors", errors);
  };

  // Function to get button text based on selected type and subscription status
  const getButtonText = () => {
    if (isProcessing) {
      return "প্রক্রিয়াধীন…";
    }
    if (selectedPurchaseType === PurchaseType.TRIAL) {
      return "ফ্রি ট্রায়াল শুরু করুন";
    }
    if (selectedPurchaseType === PurchaseType.SUBSCRIPTION) {
      return "পেমেন্ট করুন";
    }
    // Fallback to original logic
    if (hasActiveSubscription) {
      return "প্ল্যান আপগ্রেড করুন"; // Upgrade Plan
    }
    if (isExpiredSubscription) {
      return "প্ল্যান রিনিউ করুন"; // Renew Plan
    }
    return "পেমেন্ট করুন";
  };

  return (
    <Card className="sm:p-1 p-0 rounded-lg h-fit">
      <CardHeader className="sm:space-y-1.5 space-y-0 sm:pb-6 pb-2.5">
        <CardTitle className="sm:text-2xl text-xl font-semibold ">
          কোর্স এনরোলমেন্ট সম্পূর্ণ করুন
        </CardTitle>
        <CardDescription className="sr-only"></CardDescription>
      </CardHeader>
      <CardContent>
        {/* NEW: Same Plan Warning Message */}
        {isSamePlan && (
          <div className="mb-6 p-4 bg-brand/5 border rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 shrink-0 hidden sm:block" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  আপনি ইতিমধ্যেই এই সাবস্ক্রিপশন প্ল্যান ব্যবহার করছেন
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  আপনি বর্তমানে{" "}
                  <strong>{currentSubscription?.subscriptionPlan?.name}</strong>{" "}
                  প্ল্যানে সাবস্ক্রাইব করেছেন, যার মেয়াদ শেষ হবে{" "}
                  {new Date(currentSubscription.expiresAt).toLocaleDateString()}{" "}
                  তারিখে।
                </p>
                <div className="flex sm:flex-row flex-col gap-2">
                  <Button
                    onClick={() => router.push("/prime")}
                    variant="default"
                    size="sm"
                    className="bg-brand text-base font-normal transition-colors duration-300 hover:bg-teal-700"
                  >
                    প্ল্যানসমূহ দেখুন
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* NEW: Change Email Option for unAuth users */}
                  {!session?.user?.email && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEmailContinued(false);
                        setStoredEmail("");
                        CheckoutStorage.clearEmail();
                        form.setValue("email", "");
                        setHasCheckedSubscription(false);
                        setCurrentSubscription(null);
                        setShowSubscriptionMessage(false);
                        form.clearErrors("email");
                      }}
                      className="bg-white border border-gray-200 text-base font-normal"
                    >
                      অন্য ইমেল দিয়ে চেষ্টা করুন
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Trial Switching Restriction Message */}
        {isSwitchingToTrial && !isSamePlan && (
          <div className="p-2.5 bg-[#FFF3F3] rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  ট্রায়াল প্ল্যানে স্যুইচ করা যাচ্ছে না।
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  আপনার কাছে বর্তমানে একটি সক্রিয়{" "}
                  <strong>{currentSubscription?.subscriptionPlan?.name}</strong>{" "}
                  সাবস্ক্রিপশন রয়েছে যা{" "}
                  {new Date(currentSubscription.expiresAt).toLocaleDateString()}{" "}
                  তারিখে শেষ হবে। ট্রায়াল প্ল্যান শুধুমাত্র নতুন ব্যবহারকারীর
                  জন্য প্রযোজ্য ।
                </p>

                <div className="flex gap-3 mb-1.5">
                  <Button
                    onClick={() => router.push("/prime")}
                    variant="default"
                    size="sm"
                    className="bg-brand text-base font-normal transition-colors duration-300 hover:bg-teal-700"
                  >
                    প্ল্যানসমূহ দেখুন
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* NEW: Change Email Option for unAuth users */}
                  {!session?.user?.email && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEmailContinued(false);
                        setStoredEmail("");
                        CheckoutStorage.clearEmail();
                        form.setValue("email", "");
                        setHasCheckedSubscription(false);
                        setCurrentSubscription(null);
                        setShowSubscriptionMessage(false);
                        form.clearErrors("email");
                      }}
                      className="bg-white border border-gray-200 text-base font-normal"
                    >
                      অন্য ইমেল দিয়ে চেষ্টা করুন
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Only show the form if not the same plan and not switching to trial */}
        {!isSamePlan && !isSwitchingToTrial && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {/* Email Confirmation Bar */}
              {emailContinued && (
                <div className="flex flex-row md:items-center md:justify-between gap-2 py-2 px-3 border border-gray-200 rounded-md w-full">
                  {/* email */}
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

                  {/* button */}
                  {!session?.user?.email && (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setEmailContinued(false);
                        setStoredEmail("");
                        CheckoutStorage.saveEmail("");
                        form.setValue("email", "");
                        setHasCheckedSubscription(false);
                        form.clearErrors("email");
                      }}
                      className="text-brand h-auto p-1 hover:no-underline font-normal text-sm text-nowrap sm:text-base sm:text-nowrap self-start md:self-auto"
                    >
                      পরিবর্তন করুন
                    </Button>
                  )}
                </div>
              )}

              {/* Email Input for Guest Users */}
              {!session?.user?.email && !emailContinued && (
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
                          placeholder="আপনার ইমেইল দিন"
                          type="email"
                          disabled={isCheckingSubscription}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Continue Button */}
              {!session?.user?.email &&
                !hasCheckedSubscription &&
                !emailContinued && (
                  <Button
                    type="button"
                    variant="default"
                    onClick={checkSubscription}
                    className="w-full bg-brand shadow-customButton hover:bg-teal-700 transition-colors duration-300 size-lg h-12 disabled:bg-gray-400 disabled:text-gray-200"
                    size="lg"
                    disabled={isCheckingSubscription}
                  >
                    {isCheckingSubscription ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <>
                        এগিয়ে যান <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

              {/* Active Subscription Message */}
              {storedEmail &&
                showSubscriptionMessage &&
                hasActiveSubscription &&
                !isSamePlan && (
                  <div className="p-4 bg-brand/5 text-gray-700 text-base py-4 rounded flex gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm ">
                        <span className="text-gray-900 font-semibold">
                          বর্তমান সাবস্ক্রিপশন:{" "}
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {currentSubscription?.subscriptionPlan?.name}
                        </span>
                        (মেয়াদ শেষ হবে{" "}
                        {new Date(
                          currentSubscription.expiresAt
                        ).toLocaleDateString()}{" "}
                        তারিখে )
                      </p>
                    </div>
                  </div>
                )}

              {/* Root form error (for checkout errors) */}
              {form.formState.errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Pricing Options */}
              <div
                className={`space-y-4 ${
                  !hasCheckedSubscription
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="sm:text-[20px] text-lg font-semibold">
                        অপশন সিলেক্ট করুন
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-4"
                          disabled={!hasCheckedSubscription}
                        >
                          {/* Trial Option - Only show if canUseTrial is true */}
                          {showTrialOption && (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-3 md:gap-4">
                              {/* Radio + Label */}
                              <label
                                htmlFor={PurchaseType.TRIAL}
                                className={`flex items-start md:items-center gap-2 flex-1 ${
                                  hasCheckedSubscription
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                                }`}
                              >
                                <RadioGroupItem
                                  value={PurchaseType.TRIAL}
                                  id={PurchaseType.TRIAL}
                                  disabled={!hasCheckedSubscription}
                                  className="shrink-0 mt-1.5 md:mt-0.5 w-4 h-4 text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0"
                                />
                                <div>
                                  <span className="font-semibold text-[18px]">
                                    {convertNumberToBangla(
                                      plan.trialDurationInDays
                                    )}{" "}
                                    দিনের ফ্রী ট্রায়াল
                                  </span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    এখনই শুরু করুন — কোনো পেমেন্ট প্রয়োজন নেই
                                  </p>
                                </div>
                              </label>

                              {/* Price Section */}
                              <div className="text-left md:text-right mt-0 ml-6 md:ml-0">
                                <span className="text-xl sm:text-2xl font-bold text-brand">
                                  ফ্রী
                                </span>
                              </div>
                            </div>
                          )}

                          {/* NEW: Disabled Trial Option - Show when hasUsedTrial is true OR switching from active plan */}
                          {(hasUsedTrial || isSwitchingToTrial) && (
                            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-gray-50 opacity-60">
                              <RadioGroupItem
                                value={PurchaseType.TRIAL}
                                id={PurchaseType.TRIAL}
                                disabled
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  borderRadius: "100%",
                                }}
                                className="text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0"
                              />
                              <div className="flex-1">
                                <FormLabel
                                  htmlFor={PurchaseType.TRIAL}
                                  className="flex items-center gap-2 cursor-not-allowed"
                                >
                                  <AlertCircle className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium text-gray-500">
                                    {convertNumberToBangla(
                                      plan.trialDurationInDays
                                    )}{" "}
                                    দিন ফ্রি ট্রায়াল
                                  </span>
                                </FormLabel>
                                <p className="text-sm text-secondary-button mt-1">
                                  {hasUsedTrial &&
                                    "ফ্রি ট্রায়াল ইতিমধ্যেই ব্যবহার করা হয়েছে"}
                                  {isSwitchingToTrial &&
                                    !hasUsedTrial &&
                                    "Cannot switch to trial from active subscription."}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-400">
                                  ফ্রি
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Subscription Option */}
                          {!plan?.isTrial && (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-x-3 md:gap-4 ">
                              {/* Left Section with Radio + Content */}
                              <div className="flex items-start gap-3 flex-1">
                                <RadioGroupItem
                                  value={PurchaseType.SUBSCRIPTION}
                                  id={PurchaseType.SUBSCRIPTION}
                                  disabled={!hasCheckedSubscription}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "100%",
                                  }}
                                  className="mt-1 shrink-0 text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0"
                                />

                                <div className="flex-1">
                                  <FormLabel
                                    htmlFor={PurchaseType.SUBSCRIPTION}
                                    className={`flex items-start md:items-center gap-2 ${
                                      hasCheckedSubscription
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                    }`}
                                  >
                                    {/* <CreditCard className="md:h-4 md:w-4 hidden md:block" /> */}
                                    <span className="text-lg font-semibold">
                                      {hasActiveSubscription &&
                                        !isSamePlan &&
                                        "প্ল্যান আপগ্রেড করুন"}
                                      {isExpiredSubscription &&
                                        "প্ল্যান রিনিউ করুন"}
                                      {!currentSubscription &&
                                        "সরাসরি ক্রয় করুন"}
                                    </span>
                                  </FormLabel>

                                  <p className="text-sm text-gray-600 mt-1">
                                    {hasActiveSubscription &&
                                      !isSamePlan &&
                                      "অবশিষ্ট সময় নতুন পরিকল্পনার সময়কালের সাথে যোগ করা হবে"}
                                    {isExpiredSubscription &&
                                      "সরাসরি সম্পূর্ণ অ্যাক্সেস পুনরায় পাবেন"}
                                    {!currentSubscription &&
                                      "বিকাশ পেমেন্টের মাধ্যমে সাথে সাথে পূর্ণ অ্যাক্সেস পাবেন"}
                                  </p>
                                </div>
                              </div>

                              {/* Price Section */}
                              <div className="text-left md:text-right ml-7 md:ml-0">
                                <span className="md:text-lg text-xl font-bold text-secondary-button">
                                  ৳
                                  {plan?.offerPrice !== 0
                                    ? convertNumberToBangla(plan?.offerPrice)
                                    : convertNumberToBangla(plan?.offerPrice)}
                                </span>
                              </div>
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {hasCheckedSubscription && (
                <>
                  <Button
                    type="submit"
                    className="w-full bg-brand shadow-customButton hover:bg-teal-700 transition-colors duration-300 size-lg h-12 disabled:bg-gray-400 disabled:text-gray-200"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {getButtonText()}
                  </Button>
                  <p className="text-sm text-gray-600 sm:text-center text-left">
                    {selectedPurchaseType === PurchaseType.SUBSCRIPTION
                      ? "*ফ্রি ট্রায়াল দিয়ে শুরু করুন। পেমেন্ট অপশন শীঘ্রই আসছে।"
                      : "আমরা আপনার জন্য একটি অ্যাকাউন্ট তৈরি করব এবং নিশ্চিতকরণ ইমেইলে পাঠাব।"}
                  </p>
                </>
              )}
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCheckoutForm;
