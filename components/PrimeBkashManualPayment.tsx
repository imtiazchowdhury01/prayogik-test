//@ts-nocheck
"use client";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { CircleHelp, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { useSession } from "next-auth/react";
import { clientApi } from "@/lib/utils/openai/client";
import toast from "react-hot-toast";
import {
  bkashManualPaymentStatus,
  BkashManualPaymentType,
} from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SubscriptionCardHeader } from "@/app/(site)/prime/_component/SubscriptionCardHeader";
import { revalidatePage } from "@/actions/revalidatePage";

interface ManualPaymentFormProps {
  // Core payment data - now supports both course and subscription
  subscriptionId?: string;
  courseId?: string;
  paymentType?: "course" | "subscription"; // Explicit payment type
  type: BkashManualPaymentType;
  displayPrice: string;
  price: number;
  paymentStatus?: bkashManualPaymentStatus;
  // UI customization
  cardTitle?: string;
  cardClassName?: string;
  cardHeaderClassName?: string;
  cardContentClassName?: string;

  // New color customization options
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonHoverBackgroundColor?: string;
  buttonHoverTextColor?: string;

  // Payment info
  bkashNumber?: string;
  supportNumber?: string;
  paymentInstruction?: string;
  moneyBackGuarantee?: string;

  // Form labels and placeholders
  labels?: {
    phoneNumber?: string;
    transactionId?: string;
    step1?: string;
    step2?: string;
    clickToEnter?: string;
    submit?: string;
    cancel?: string;
    paymentWith?: string;
    supportContact?: string;
  };

  placeholders?: {
    phoneNumber?: string;
    transactionId?: string;
  };

  // E.g.: rRenew date
  buttonSubText?: React.JSX.Element | null;
  buttonSubmitTailwindcss?: string;
  // Messages
  messages?: {
    fillAllFields?: string;
    completeCaptcha?: string;
    paymentSuccess?: string;
    paymentError?: string;
  };

  // reCAPTCHA
  recaptchaSiteKey?: string;
  recaptchaLanguage?: string;
  showRecaptcha?: boolean;

  // Privacy policy links
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  privacyText?: string;
  termsText?: string;

  // Behavior
  preview?: boolean;
  showMoneyBackGuarantee?: boolean;
  resetFormOnSuccess?: boolean;

  // Callbacks
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: any) => void;
  onFormReset?: () => void;
  title: string;
  subscriptionDiscountPercentage: string;
}

// Declare global type for reCAPTCHA
declare global {
  interface Window {
    handleRecaptchaChange: (token: string) => void;
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: string | Element, parameters: any) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
      getWidgetId: (container: Element) => number;
    };
  }
}

function PrimeBkashManualPayment({
  type,
  subscriptionId,
  courseId,
  paymentType,
  displayPrice,
  buttonSubmitTailwindcss,
  cardTitle,
  cardClassName = "border-[1px] border-primary-300 rounded-lg p-6 cursor-pointer",
  cardHeaderClassName = "pb-0",
  cardContentClassName = "space-y-3 p-0",
  price,
  paymentStatus,
  // Color customization with defaults
  // backgroundColor = "#E7F5F4", //
  backgroundColor = "white", //
  textColor = "inherit",
  titleColor = "inherit",
  descriptionColor = "inherit",
  buttonBackgroundColor = "rgba(var(--primary-500))",
  buttonTextColor = "white",
  buttonHoverBackgroundColor = "var(--primary-brand, #3b82f6)",
  buttonHoverTextColor = "white",
  buttonSubText,
  bkashNumber = process.env.BKASH_MANUAL_PAYMENT_NUMBER || "+৮৮০১৭১৩৪৩২৮৮১",
  supportNumber = process.env.SUPPORT_NUMBER || "+৮৮০১৭১৩৪৩২৮৮০",
  paymentInstruction = "১. বিকাশে পেমেন্ট করুন",
  moneyBackGuarantee = "",
  labels = {},
  placeholders = {},
  messages = {},
  recaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
  recaptchaLanguage = "bn",
  showRecaptcha = true,
  privacyPolicyUrl = "https://policies.google.com/privacy",
  termsOfServiceUrl = "https://policies.google.com/terms",
  privacyText = "গোপনীয়তা নীতি",
  termsText = "সেবার শর্তাবলী",
  preview = false,
  showMoneyBackGuarantee = true,
  resetFormOnSuccess = true,
  onPaymentSuccess,
  onPaymentError,
  onFormReset,
  title,
  subscriptionDiscountPercentage,
}: ManualPaymentFormProps) {
  // Default labels
  const defaultLabels = {
    phoneNumber: "বিকাশ ফোন নম্বর দিন",
    transactionId: "বিকাশ ট্রান্সেকশন আইডি দিন",
    step1: "২. ট্রান্সেকশন আইডি দিন",
    step2: "৩. সাপোর্টের জন্য যোগাযোগ করুন",
    clickToEnter: "ক্লিক করুন ট্রান্সেকশন আইডি লিখতে",
    submit: "সাবমিট",
    cancel: "বাতিল",
    paymentWith: "বিকাশে পেমেন্ট করুন",
    supportContact: "সাপোর্টের জন্য যোগাযোগ করুন",
    ...labels,
  };

  // Default placeholders
  const defaultPlaceholders = {
    phoneNumber: "বিকাশ নম্বর লিখুন",
    transactionId: "উদাহরণ: TX123ABC456",
    ...placeholders,
  };

  // Default messages
  const defaultMessages = {
    fillAllFields: "সব ফিল্ড পূরণ করুন",
    completeCaptcha: "reCAPTCHA সম্পূর্ণ করুন",
    paymentSuccess:
      "পেমেন্ট রিকোয়েস্ট করা হয়েছে। \nসাপোর্ট নম্বরে যোগাযোগ করুন",
    paymentError:
      "পেমেন্ট রিকোয়েস্ট সম্পন্ন হয়নি।  \nসাপোর্ট নম্বরে যোগাযোগ করুন",
    ...messages,
  };

  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(
    null
  );
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showTrxIdInput, setShowTrxIdInput] = useState(false);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  // Determine the payment target ID and type
  const paymentTargetId = useMemo(() => {
    if (courseId) return courseId;
    if (subscriptionId) return subscriptionId;
  }, [courseId, subscriptionId]);

  const actualPaymentType = useMemo(() => {
    if (paymentType) return paymentType;
    if (subscriptionId) return "subscription";
    return "course";
  }, [paymentType, subscriptionId]);

  // Create dynamic styles object
  const dynamicStyles = useMemo(
    () => ({
      card: {
        backgroundColor,
        color: textColor,
      },
      title: {
        color: titleColor !== "inherit" ? titleColor : undefined,
      },
      description: {
        color: descriptionColor !== "inherit" ? descriptionColor : undefined,
      },
      button: {
        backgroundColor: buttonBackgroundColor,
        color: buttonTextColor,
        "--hover-bg": buttonHoverBackgroundColor,
        "--hover-text": buttonHoverTextColor,
      } as React.CSSProperties,
    }),
    [
      backgroundColor,
      textColor,
      titleColor,
      descriptionColor,
      buttonBackgroundColor,
      buttonTextColor,
      buttonHoverBackgroundColor,
      buttonHoverTextColor,
    ]
  );

  // Function to handle reCAPTCHA response
  const handleRecaptchaChange = (token: string) => {
    if (token) {
      setRecaptchaToken(token);
      setRecaptchaError(null);
    } else {
      setRecaptchaToken(null);
    }
  };

  // Function to reset reCAPTCHA
  const resetRecaptcha = () => {
    if (recaptchaWidgetId !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(recaptchaWidgetId);
        setRecaptchaToken(null);
        setRecaptchaError(null);
      } catch (error) {
        console.error("Error resetting reCAPTCHA:", error);
      }
    }
  };

  // Load and initialize reCAPTCHA
  useEffect(() => {
    if (!showRecaptcha) return;

    if (typeof window !== "undefined") {
      window.handleRecaptchaChange = handleRecaptchaChange;

      // Check if reCAPTCHA script is already loaded
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
      } else {
        // Load reCAPTCHA script dynamically
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?hl=${recaptchaLanguage}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setRecaptchaLoaded(true);
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      // Cleanup
      if (typeof window !== "undefined") {
        window.handleRecaptchaChange = () => {};
      }
    };
  }, [showRecaptcha, recaptchaLanguage]);

  // Render reCAPTCHA when it's loaded and form is shown
  useEffect(() => {
    if (!showRecaptcha) return;

    if (
      recaptchaLoaded &&
      showTrxIdInput &&
      recaptchaRef.current &&
      !recaptchaWidgetId
    ) {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          if (recaptchaRef.current) {
            try {
              const widgetId = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: recaptchaSiteKey,
                callback: "handleRecaptchaChange",
              });
              setRecaptchaWidgetId(widgetId);
            } catch (error) {
              console.error("Error rendering reCAPTCHA:", error);
            }
          }
        });
      }
    }
  }, [
    recaptchaLoaded,
    showTrxIdInput,
    recaptchaWidgetId,
    showRecaptcha,
    recaptchaSiteKey,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !transactionId) {
      toast.error(defaultMessages.fillAllFields);
      return;
    }

    if (!paymentTargetId) {
      toast.error("Payment target ID is missing");
      return;
    }

    // Check reCAPTCHA only if it's enabled
    if (showRecaptcha) {
      const token = window.grecaptcha?.getResponse(
        recaptchaWidgetId || undefined
      );
      if (!token) {
        setRecaptchaError(defaultMessages.completeCaptcha);
        return;
      }
    }

    setRecaptchaError(null);
    setloading(true);

    try {
      // Create payment data based on payment type
      const paymentData =
        actualPaymentType === "subscription"
          ? {
              subscriptionId: paymentTargetId,
              payFrom: [phoneNumber],
              trxId: [transactionId],
            }
          : {
              courseId: paymentTargetId,
              payFrom: [phoneNumber],
              trxId: [transactionId],
            };

      const res = await clientApi.createBkashPayment({
        body: {
          payFrom: paymentData.payFrom,
          trxId: paymentData.trxId,
          type,
          subscriptionId: paymentData.subscriptionId!,
          courseId: paymentData.courseId!,
          payableAmount: price,
          title,
        },
      });

      if (res.status === 201) {
        router.refresh();
        await revalidatePage("/prime");
        toast.success(defaultMessages.paymentSuccess);

        // Call success callback
        onPaymentSuccess?.(res);

        if (resetFormOnSuccess) {
          // Reset form after successful submission
          setPhoneNumber("");
          setTransactionId("");
          setShowTrxIdInput(false);

          // Reset reCAPTCHA
          if (showRecaptcha) {
            resetRecaptcha();
          }

          // Reset widget ID so it can be recreated next time
          setRecaptchaWidgetId(null);

          // Call reset callback
          onFormReset?.();
        }
      } else {
        toast.error(defaultMessages.paymentError);
        onPaymentError?.(res);
        // Reset reCAPTCHA on error so user can try again
        if (showRecaptcha) {
          resetRecaptcha();
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(defaultMessages.paymentError);
      onPaymentError?.(error);
      // Reset reCAPTCHA on error so user can try again
      if (showRecaptcha) {
        resetRecaptcha();
      }
    } finally {
      setloading(false);
    }
  };

  const handleCancel = () => {
    setPhoneNumber("");
    setTransactionId("");
    setShowTrxIdInput(false);
    setRecaptchaError(null);
    setRecaptchaToken(null);

    // Reset reCAPTCHA
    if (showRecaptcha) {
      resetRecaptcha();
    }

    // Reset widget ID
    setRecaptchaWidgetId(null);
    setloading(false);

    // Call reset callback
    onFormReset?.();
  };

  const handleStartWritingTrxIdButton = () => {
    if (status !== "authenticated") {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setShowTrxIdInput(true);
    }
  };

  // -------- after subscribed show this card------------
  if (preview) {
    return (
      <div className="p-[1px] rounded-lg [background:linear-gradient(90deg,_#FF3A4D_0%,_#FF8538_100%)]">
        <Card
          className={cn(cardClassName, "border-0 p-6 bg-white rounded-lg m-0")}
          style={{ ...dynamicStyles.card }}
        >
          {/* subscription info data header */}
          <SubscriptionCardHeader title={cardTitle} displayPrice={price} />

          {/* TODO: REFACTOR CSS FOR ONLY SUBSCRIBED BUTTON: px-6 */}
          <CardContent className={cn(cardContentClassName, "mt-2")}>
            <Button
              type="button"
              disabled={preview}
              variant="outline"
              className="w-full opacity-50 hover:bg-primary-brand hover:text-white bg-teal-800 cursor-not-allowed text-white transition-opacity disabled:bg-gray-600 disabled:text-white"
            >
              {defaultLabels.clickToEnter}
            </Button>

            {/* Renew Date */}
            {buttonSubText && buttonSubText}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!preview && paymentStatus) {
    // Define status-specific styles
    const getStatusStyles = (status: bkashManualPaymentStatus) => {
      switch (status) {
        case "FAILED":
          return {
            border: "border-red-500 border-dashed border-2",
            background: "bg-red-50",
            textColor: "text-red-600 font-bold",
            text: "পেমেন্ট হয়নি",
          };
        case "PENDING":
          return {
            border: "border-yellow-500 border-dashed border-2",
            background: "bg-yellow-50",
            textColor: "text-yellow-600 font-bold",
            text: "পেমেন্ট রিকোয়েস্ট সাবমিট করা হয়েছে। অ্যাডমিন অনুমোদনের জন্য সাপোর্ট এ যোগাযোগ করুন।",
          };
        case "SUCCESS":
          return {
            border: "border-green-500 border-dashed border-2",
            background: "bg-green-50",
            textColor: "text-green-600 font-bold",
            text: "আপনার পেমেন্ট ভেরিফাই হয়েছে। কিছুক্ষনের মধ্যেই এক্সেস পাবেন। অপেক্ষা করার জন্য ধন্যবাদ।",
          };
        default:
          return {
            border: "",
            background: "",
            textColor: "",
            text: "",
          };
      }
    };

    const statusStyles = getStatusStyles(paymentStatus);

    return (
      <>
        {/*----------- after payment show this card ---------------*/}
        <div className="p-[1px] rounded-lg [background:linear-gradient(90deg,_#FF3A4D_0%,_#FF8538_100%)]">
          <Card
            className={cn(cardClassName, "border-0 p-6  rounded-lg h-full")}
            style={{ ...dynamicStyles.card }}
          >
            <CardHeader className={cardHeaderClassName}>
              {cardTitle ? (
                <CardTitle
                  style={dynamicStyles.title}
                  className={cn(
                    "text-lg bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text text-transparent text-center"
                  )}
                >
                  {cardTitle}
                </CardTitle>
              ) : null}
              <div className="text-center">
                <p className="text-gray-600 text-base">বার্ষিক সাবস্ক্রিপশন</p>
                <div>
                  {displayPrice ? (
                    <div className="flex justify-center items-center gap-1 text-[32px] font-semibold text-[#414B4A]">
                      <span>৳{displayPrice}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardHeader>

            <CardContent
              className={cn(
                statusStyles.textColor,
                statusStyles.background,
                statusStyles.border,
                "grid place-items-center pt-6 mt-4"
              )}
            >
              <div className={cn("text-center", statusStyles.textColor)}>
                {statusStyles.text}
              </div>
            </CardContent>

            <div className="space-y-1 mt-6 ml-2">
              <div className="text-base">
                {defaultLabels.step2.replace("৩.", "")}
              </div>
              <div className="flex items-center gap-2">
                <Phone
                  className="h-4 w-4 text-gray-700"
                  // style={{ color: buttonBackgroundColor }}
                />
                <span className="text-base" style={dynamicStyles.description}>
                  {supportNumber}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      {showRecaptcha && (
        <Head>
          <script
            src={`https://www.google.com/recaptcha/api.js?hl=${recaptchaLanguage}`}
            async
            defer
          />
        </Head>
      )}
      {/* ---------without payment show this card---------- */}
      <div className="p-[1px] rounded-lg [background:linear-gradient(90deg,_#FF3A4D_0%,_#FF8538_100%)]">
        <Card className="border-0 p-6 bg-white rounded-lg">
          {cardTitle && (
            <CardHeader className={cardHeaderClassName}>
              {cardTitle ? (
                <CardTitle
                  className="text-lg bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text text-transparent text-center"
                  style={dynamicStyles.title}
                >
                  {cardTitle}
                </CardTitle>
              ) : null}
              <div className="text-center">
                <p className="text-gray-600 text-base">বার্ষিক সাবস্ক্রিপশন</p>
                <div>
                  {displayPrice ? (
                    <div className="flex justify-center items-center gap-1 text-[32px] font-semibold text-[#414B4A]">
                      <span>৳{displayPrice}</span>
                    </div>
                  ) : null}
                </div>
              </div>
              {cardTitle && <Separator className="mt-4" />}
            </CardHeader>
          )}
          <CardContent className={cardContentClassName}>
            {/* Payment Instructions */}
            <div className="mt-4">
              <div className="text-base" style={dynamicStyles.description}>
                {paymentInstruction}
              </div>
              <div className="font-bold text-lg pl-4">{bkashNumber}</div>
            </div>
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="text-base">{defaultLabels.step1}</div>
              <form onSubmit={handleSubmit} className="space-y-4 pl-4">
                {!showTrxIdInput ? (
                  <>
                    <Button
                      type="button"
                      disabled={preview}
                      variant="default"
                      className={cn(
                        "w-full rounded-[6px] text-md hover:opacity-90 transition-opacity  bg-gradient-to-r from-[#FF3A4D] to-[#FF8538]  hover:from-[#FF3A4D] hover:to-[#FF8538]",
                        "hover:bg-primary-brand hover:text-white",
                        buttonSubmitTailwindcss
                      )}
                      // className={cn(
                      //   "w-full rounded-[6px] text-md border border-[#FF3A4D] hover:bg-primary-brand text-transparent bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text hover:bg-none transition-opacity",
                      //   "hover:bg-primary-brand hover:text-white",
                      //   buttonSubmitTailwindcss
                      // )}
                      // style={{
                      //   backgroundImage:
                      //     "linear-gradient(90deg, #FF3A4D 0%, #FF8538 100%)",
                      //   backgroundClip: "text",
                      //   WebkitBackgroundClip: "text",
                      //   WebkitTextFillColor: "transparent",
                      // }}
                      onClick={handleStartWritingTrxIdButton}
                    >
                      <span className="text-white">
                        {defaultLabels.clickToEnter}
                      </span>
                    </Button>

                    {/* Renew Date */}
                    {buttonSubText && (
                      <p className="text-sm text-center text-gray-500">
                        {buttonSubText}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="bg-white space-y-4 p-4 border rounded-md">
                    <div className="space-y-1 mt-1">
                      <Label
                        htmlFor="phone"
                        style={dynamicStyles.description}
                        className="flex flex-row items-center gap-1 text-gray-700"
                      >
                        {defaultLabels.phoneNumber}

                        <div className="relative group inline-block">
                          {/* Icon with slight top margin */}
                          <CircleHelp className="w-4 h-4 relative -top-0.5 cursor-pointer" />

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-wrap rounded  w-[250px] bg-white border px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            আপনার ১১ সংখ্যার বিকাশ নম্বর লিখুন, উদাহরণ:
                            01XXXXXXXXX
                          </div>
                        </div>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={defaultPlaceholders.phoneNumber}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className=""
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="trxid"
                        style={dynamicStyles.description}
                        className="flex items-center gap-1 text-gray-700"
                      >
                        {defaultLabels.transactionId}

                        <div className="relative group inline-block ">
                          <CircleHelp className="w-4 h-4 relative -top-0.5 cursor-pointer" />
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-wrap rounded w-[250px] bg-white border px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            আপনার বিকাশ পেমেন্ট থেকে পাওয়া অনন্য ট্রান্সেকশন
                            আইডি দিন। উদাহরণ: TX123ABC456
                          </div>
                        </div>
                      </Label>
                      <Input
                        id="trxid"
                        type="text"
                        placeholder={defaultPlaceholders.transactionId}
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className=""
                        required
                      />
                    </div>

                    {/* reCAPTCHA v2 container */}
                    {showRecaptcha && (
                      <div className="mt-4">
                        <div
                          ref={recaptchaRef}
                          style={{
                            transform: "scale(0.77)",
                            WebkitTransform: "scale(0.77)",
                            transformOrigin: "0 0",
                            WebkitTransformOrigin: "0 0",
                          }}
                        ></div>
                        {recaptchaError && (
                          <p className="mt-1 text-sm text-red-500">
                            {recaptchaError}
                          </p>
                        )}
                      </div>
                    )}
                    {/* Google reCAPTCHA v2 privacy note */}
                    {showRecaptcha && (
                      <div className="mt-2 text-xs text-gray-500">
                        <Link
                          href={privacyPolicyUrl}
                          target="_blank"
                          className="ml-1 text-blue-500 hover:underline"
                        >
                          {privacyText}
                        </Link>{" "}
                        এবং
                        <Link
                          href={termsOfServiceUrl}
                          target="_blank"
                          className="ml-1 text-blue-500 hover:underline"
                        >
                          {termsText}
                        </Link>{" "}
                        দেখুন।
                      </div>
                    )}
                    <div className="flex gap-1 justify-end items-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        {defaultLabels.cancel}
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || (showRecaptcha && !recaptchaToken)}
                        className="hover:opacity-90 transition-opacity text-white bg-gradient-to-r from-[#FF3A4D] to-[#FF8538]  hover:from-[#FF3A4D] hover:to-[#FF8538]"
                        // style={dynamicStyles.button}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          defaultLabels.submit
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
            {/* Step 2 */}
            <div className="space-y-1">
              <div className="text-base">{defaultLabels.step2}</div>
              <div className="flex items-center gap-2 pl-4">
                <Phone
                  className="h-4 w-4 text-gray-700"
                  // style={{ color: buttonBackgroundColor }}
                />
                <span className="text-base" style={dynamicStyles.description}>
                  {supportNumber}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default PrimeBkashManualPayment;
