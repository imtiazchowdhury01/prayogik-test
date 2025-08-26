//@ts-nocheck
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { useRouter } from "next/navigation";

const BuyNowButton = ({
  plan,
  label = "Buy Now",
  disabled = false,
  activeSubscription,
  hasUsedTrial = false,
}) => {
  const router = useRouter();
  const handlePlanAction = async () => {
    if (plan && !disabled) {
      await clearServerCart();
      await setServerCart({
        type: "SUBSCRIPTION",
        items: [
          
          {
            planId: plan.id,
            activeSubscription,
            hasUsedTrial, // Pass trial history to cart
          },
        ],
      } as any);
      router.push("/checkout");
    }
  };

  return (
    <Button
      onClick={handlePlanAction}
      className="w-full disabled:text-gray-500"
      size="lg"
      disabled={disabled}
      variant={disabled ? "secondary" : "default"}
    >
      {label}
    </Button>
  );
};

export default BuyNowButton;
