//@ts-nocheck
import type { Metadata } from "next";
import PrimeCourseSection from "./_component/PrimeCourseSection";
import PrimeFaqSection from "./_component/PrimeFaqSection";
import PrimeHero from "./_component/PrimeHero";
import PrimePricingSection from "./_component/PrimePricingSection";
import PrimePromotionalSection from "./_component/PrimePromotionalSection";
import PrimeVideoSection from "./_component/PrimeVideoSection";
import WhyPrimeSection from "./_component/WhyPrimeSection";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

export const metadata: Metadata = {
  title: "Unlock All Courses with One Subscription | Prayogik",
  description:
    "Get unlimited access to all premium Bangla courses with a single subscription. Learn practical skills, grow your career, and enjoy new courses regularly—only on Prayogik.",
};

export default async function Subscription() {
  const subscriptionsInfoArray = await getSubscriptionDBCall();

  const primeSubscription = subscriptionsInfoArray?.find(
    (sub: any) => sub.name === "প্রাইম"
  );
  const subscriptionInfo = {
    name: primeSubscription?.name || "প্রাইম",
    discountPercentage: convertNumberToBangla(
      primeSubscription?.subscriptionDiscount?.discountPercentage || 0
    ),
    price: convertNumberToBangla(primeSubscription?.regularPrice || 0),
  };
  // console.log("subscriptionInfo result:", subscriptionInfo);
  return (
    <div className="bg-white scroll-smooth">
      <PrimeHero subscriptionInfo={subscriptionInfo} />
      <PrimePromotionalSection />
      <PrimeVideoSection />
      <PrimeCourseSection />
      <WhyPrimeSection />
      <PrimePricingSection subscriptionInfo={subscriptionInfo} />
      <PrimeFaqSection />
    </div>
  );
}
