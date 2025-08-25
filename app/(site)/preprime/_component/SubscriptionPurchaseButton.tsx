// @ts-nocheck
"use client";
import { SubscriptionHero } from "./SubscriptionHero";
import SubscriptionPlansList from "./SubscriptionPlansList";
import { useState, useEffect, useCallback } from "react";
import Faq from "./Faq";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";
import SubNotificationHandler from "./SubNotificationHandler";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const SubscriptionPurchaseButton = ({
  subscription,
  userSubscription,
  isBottomCard,
}) => {
  const [loading, setLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  const router = useRouter();

  const success = searchParams.get("subscription-success");
  const canceled = searchParams.get("subscription-cancelled");
  const failed = searchParams.get("subscription-failed");

  const isExpired = userSubscription?.status === "EXPIRED";
  const isSubscribed = userSubscription?.status === "ACTIVE";

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, []);
  useEffect(() => {
    if (
      isSubscribed &&
      redirectUrl &&
      redirectUrl !== "null" &&
      redirectUrl !== "undefined"
    ) {
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  const handlePurchase = async (subscriptionPlanId) => {
    if (!subscriptionPlanId) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/subscriptions/purchase", {
        subscriptionPlanId,
        redirectUrl: redirectUrl,
      });

      window.location.assign(response.data.url);
    } catch (error) {
      console.error("Error making purchase:", error);
      toast.error("Error processing the purchase.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isBottomCard) {
      if (success) {
        setNotificationMessage("Subscription purchase successful!");
      } else if (canceled) {
        setNotificationMessage("Subscription purchase canceled");
      } else if (failed) {
        setNotificationMessage("Subscription purchase failed");
      } else {
        setNotificationMessage(null);
      }
    }
  }, [success, canceled, failed]);

  return (
    <>
      {notificationMessage && !isBottomCard && (
        <SubNotificationHandler
          message={notificationMessage}
          hasError={hasError}
        />
      )}

      {isExpired && !isBottomCard && (
        <div className="absolute top-0 right-0 px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-bl-lg">
          Expired
        </div>
      )}

      <button
        onClick={() => {
          if (session?.user?.id) {
            handlePurchase(subscription.id);
          } else {
            router.push("/signin?redirect=prime");
          }
        }}
        disabled={isSubscribed || loading}
        className={`gap-1 px-6 py-3 w-full h-14 text-lg font-bold leading-7 text-center text-white rounded-md  max-sm:text-base ${
          isSubscribed
            ? "bg-gray-400 cursor-not-allowed" // Disabled color and cursor
            : "bg-subscribe-button-gradient hover:bg-subscribe-button-gradient-hover cursor-pointer"
        } flex justify-center items-center `}
        aria-label="Subscribe to Premium"
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : isSubscribed ? (
          "সাবস্ক্রাইবড"
        ) : isExpired ? (
          "রিনিউ করুন"
        ) : (
          "সাবস্ক্রাইব প্রিমিয়াম"
        )}
      </button>
    </>
  );
};

export default SubscriptionPurchaseButton;
