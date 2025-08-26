// @ts-nocheck

"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function CheckoutButton({
  course,
  userId,
  className,
  courseId,
  priceId,
  children,
  checked,
  isSubscribedUser,
  isFreeforsubscribedUser,
  isPurchasingUnderSubscriptionPrice,
  termsChecked,
  preview,
  ...props
}: {
  course?: any;
  className?: string;
  courseId: string;
  priceId: string | null;
  children?: React.ReactNode;
  checked?: boolean;
  isSubscribedUser?: boolean;
  termsChecked?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const onClick = async () => {
    if (!isSubscribedUser && isPurchasingUnderSubscriptionPrice) {
      router.push(`/prime?redirect=${window.location.pathname}`);
      return;
    }
    try {
      setIsLoading(true);

      const isFreeCourse = Boolean(
        course.prices.find((price) => price?.isFree === true)
      );

      if (isFreeCourse || (isFreeforsubscribedUser && isSubscribedUser)) {
        const response = await axios.post(
          `/api/courses/freecourse?courseId=${courseId}`,
          { userId }
        );

        if (response.data.success) {
          window.location.assign(
            `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/${course.lessons[0]?.slug}?success=1`
          );
        } else {
          toast.error(response.data.error || "Purchase failed.");
        }
      } else {
        const response = await axios.post(`/api/courses/${courseId}/payment`, {
          priceId,
          teacherId: course?.teacherProfileId,
          isSubscribedUser: isSubscribedUser,
          isPurchasingUnderSubscriptionPrice:
            isPurchasingUnderSubscriptionPrice,
        });

        if (response.data.url) {
          window.location.assign(response.data.url);
        } else {
          toast.error(response.data.message || "Something went wrong!");
        }
      }
    } catch (error) {
      console.log("Error from checkout button:", error);
      if (error.response) {
        // Handle JSON error response
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (typeof error.response.data === "string") {
          // Handle plain text error response
          toast.error(error.response.data);
        } else {
          toast.error("Something went wrong!");
        }
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && !userId) {
      router.refresh();
    }
  }, [status, userId, router]);

  return userId ? (
    <Button
      {...props}
      onClick={onClick}
      disabled={isLoading || !checked || !userId || !termsChecked}
      className={`w-full py-4 mt-2 text-base font-semibold text-white transition-all duration-300 rounded-sm bg-primary-brand hover:bg-primary-700 ${
        isLoading ||
        !checked ||
        !userId ||
        (!termsChecked && "opacity-50 cursor-not-allowed")
      }`}
    >
      {isLoading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
      {children || <span>কোর্সটি কিনুন</span>}
    </Button>
  ) : (
    // <Link href={}>
    <Button
      onClick={() => {
        router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
      }}
      disabled={preview}
      {...props}
      className="w-full py-4 my-5 text-base font-semibold text-white transition-all duration-300 rounded-sm bg-primary-brand hover:bg-primary-700"
    >
      {children || <span>কোর্সটি কিনুন</span>}
    </Button>
    // </Link>
  );
}
