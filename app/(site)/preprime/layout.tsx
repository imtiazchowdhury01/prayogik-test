import { AuthAndSubscriptionProvider } from "@/hooks/use-subscription-provider";
import React from "react";

const PrimeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthAndSubscriptionProvider>{children}</AuthAndSubscriptionProvider>
    </>
  );
};

export default PrimeLayout;
