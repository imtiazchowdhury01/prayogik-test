"use client";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { Loader, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import SubNotificationHandler from "./SubNotificationHandler";

interface SubscriptionPurchaseProps {
  subscription: any;
  userSubscription?: any;
  subscriptionTitle?: string;
  subscriptionPrice?: string;
  supportNumber?: string;
  preview?: boolean;
  isBottomCard?: boolean;
}

// Declare global type for Stripe (if using Stripe)
declare global {
  interface Window {
    Stripe?: any;
  }
}

function SubscriptionPurchaseManual({
  subscription,
  userSubscription,
  supportNumber = "০১৮১৫২৭৯১৫৫৭৷",
  preview,
  isBottomCard = false,
}: SubscriptionPurchaseProps) {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [hasError, setHasError] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();

  // URL search params
  const success = searchParams.get("subscription-success");
  const canceled = searchParams.get("subscription-cancelled");
  const failed = searchParams.get("subscription-failed");

  const subscriptionPrice = useMemo(
    () =>
      subscription?.prices?.find(
        (price: any) =>
          price.frequency === "MONTHLY" && price.isSubscriptionPrice
      ),
    [subscription]
  );

  // Subscription status checks
  const isExpired = userSubscription?.status === "EXPIRED";
  const isActive = userSubscription?.status === "ACTIVE";
  const isPending = userSubscription?.status === "PENDING";
  const isCancelled = userSubscription?.status === "CANCELLED";
  const isSubscribed = isActive;

  // Extract redirect URL from search params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect");
    if (redirect && redirect !== "null" && redirect !== "undefined") {
      setRedirectUrl(redirect);
    }
  }, []);

  // Auto-redirect if already subscribed
  useEffect(() => {
    if (
      isSubscribed &&
      redirectUrl &&
      redirectUrl !== "null" &&
      redirectUrl !== "undefined"
    ) {
      router.push(redirectUrl);
    }
  }, [isSubscribed, redirectUrl, router]);

  // Handle notification messages
  useEffect(() => {
    if (!isBottomCard) {
      if (success) {
        setNotificationMessage("সাবস্ক্রিপশন সফলভাবে ক্রয় হয়েছে!");
        setHasError(false);
      } else if (canceled) {
        setNotificationMessage("সাবস্ক্রিপশন ক্রয় বাতিল হয়েছে");
        setHasError(true);
      } else if (failed) {
        setNotificationMessage("সাবস্ক্রিপশন ক্রয়ে সমস্যা হয়েছে");
        setHasError(true);
      } else {
        setNotificationMessage(null);
        setHasError(false);
      }
    }
  }, [success, canceled, failed, isBottomCard]);

  const handleSubscriptionPurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !transactionId) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    if (!subscription?.id) {
      toast.error("সাবস্ক্রিপশন তথ্য পাওয়া যাচ্ছে না");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/subscriptions/purchase", {
        subscriptionPlanId: subscription.id,
        payFrom: [phoneNumber],
        trxId: [transactionId],
        redirectUrl: redirectUrl,
      });

      if (response.status === 201) {
        toast.success("সাবস্ক্রিপশন সফলভাবে সক্রিয় হয়েছে।");

        // Reset form after successful submission
        setPhoneNumber("");
        setTransactionId("");
        setShowPurchaseForm(false);
      } else {
        toast.error("সাবস্ক্রিপশন সক্রিয় করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Subscription purchase error:", error);
      toast.error("সাবস্ক্রিপশন ক্রয়ে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPurchaseForm(false);
    setNotificationMessage(null);
    setHasError(false);
    setLoading(false);
  };

  const handleStartPurchaseButton = () => {
    if (status !== "authenticated") {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setShowPurchaseForm(true);
    }
  };

  const getButtonText = () => {
    if (loading) return null;
    if (isActive) return "সাবস্ক্রাইবড";
    if (isExpired) return "রিনিউ করুন";
    if (isPending) return "অপেক্ষমাণ";
    if (isCancelled) return "পুনরায় সাবস্ক্রাইব";
    return "সাবস্ক্রাইব প্রিমিয়াম";
  };

  const isButtonDisabled = loading || isActive || isPending;

  return (
    <>
      {/* Notification Handler */}
      {notificationMessage && !isBottomCard && (
        <SubNotificationHandler
          message={notificationMessage}
          hasError={hasError}
        />
      )}

      <Card className="border-[1px] border-primary-300 rounded-lg p-6 bg-[#f3f9f9] cursor-pointer relative">
        {/* Expired Badge */}
        {isExpired && !isBottomCard && (
          <div className="absolute top-0 right-0 px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-bl-lg">
            মেয়াদ শেষ
          </div>
        )}

        <CardHeader className="pb-4">
          <CardTitle className="text-base text-fontcolor-title">
            সাবস্ক্রিপশন ফি
          </CardTitle>
          <div className="space-y-1 text-sm">
            <div>
              {subscriptionPrice?.isFree ? (
                <div className="flex items-center gap-1 text-3xl">
                  <span>*ফ্রি</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-semibold ">
                      ৳{" "}
                      {convertNumberToBangla(
                        subscriptionPrice?.regularAmount ||
                          subscription?.price ||
                          0
                      )}
                    </span>
                    <span className="text-sm text-fontcolor-description">
                      {"/ মাসিক"}
                    </span>
                  </div>
                  <p className="block mt-1 text-sm text-fontcolor-description">
                    ৭ দিনের ফ্রি ট্রায়াল
                  </p>
                </div>
              )}
            </div>
          </div>
          <Separator className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Subscription Features */}
          {subscription?.features && subscription.features.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-fontcolor-description">
                প্রিমিয়াম বৈশিষ্ট্যসমূহ
              </div>
              <ul className="space-y-1 text-sm">
                {subscription.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-fontcolor-description">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Current Subscription Status */}
          {userSubscription?.expiresAt && isActive && (
            <div className="space-y-2">
              <div className="text-sm text-fontcolor-description">
                বর্তমান সাবস্ক্রিপশন
              </div>
              <div className="text-sm font-medium">
                মেয়াদ শেষ:{" "}
                {new Date(userSubscription.expiresAt).toLocaleDateString(
                  "bn-BD"
                )}
              </div>
            </div>
          )}

          {/* Step 1 - Purchase */}
          <div className="space-y-2">
            <div className="text-sm">১. সাবস্ক্রিপশন শুরু করুন</div>
            <form onSubmit={handleSubscriptionPurchase} className="space-y-4">
              {!showPurchaseForm ? (
                <Button
                  type="button"
                  disabled={preview || isButtonDisabled}
                  variant="outline"
                  className={`w-full ${
                    isButtonDisabled
                      ? "bg-gray-400 text-white cursor-not-allowed hover:bg-gray-400"
                      : "bg-primary-brand text-white hover:bg-primary-brand hover:text-white"
                  }`}
                  onClick={handleStartPurchaseButton}
                >
                  {getButtonText() || "ক্লিক করুন সাবস্ক্রাইব করতে"}
                </Button>
              ) : (
                <>
                  <div className="space-y-4 p-4 border rounded-lg bg-white">
                    <div className="text-center space-y-2">
                      <CreditCard className="h-8 w-8 mx-auto text-primary-brand" />
                      <h3 className="font-medium text-fontcolor-title">
                        নিরাপদ পেমেন্ট
                      </h3>
                      <p className="text-sm text-fontcolor-description">
                        আপনাকে নিরাপদ পেমেন্ট পেজে নিয়ে যাওয়া হবে
                      </p>
                    </div>

                    {/* Payment Methods Info */}
                    <div className="text-center space-y-2">
                      <div className="text-xs text-fontcolor-description">
                        স্বীকৃত পেমেন্ট পদ্ধতি
                      </div>
                      <div className="flex justify-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          বিকাশ
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          নগদ
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          কার্ড
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 justify-end items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className=""
                    >
                      বাতিল
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary-brand text-white hover:bg-primary-brand hover:text-white"
                    >
                      {loading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        "পেমেন্ট করুন"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Step 2 - Support */}
          <div className="space-y-1">
            <div className="text-sm">২. সহায়তার জন্য যোগাযোগ করুন</div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary-brand" />
              <span className="text-base text-fontcolor-description">
                {supportNumber}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default SubscriptionPurchaseManual;
