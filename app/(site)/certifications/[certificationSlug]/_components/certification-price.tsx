import CertificationCheckboxIcon from "@/components/common/certificationCheckboxIcon";
import CertificationCrownIcon from "@/components/common/certificationCrownIcon";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";

import React from "react";
import CertificationSectionTitle from "./certification-section-title";

const CertificationPrice = async ({ data }: any) => {
  // Find regular price and subscription price from the data
  const regularPrice = data?.prices[0]?.regularAmount;
  // const subscriptionPrice = data?.prices?.find(
  //   (price: any) => price.isSubscriptionPrice
  // );

  const subscriptions = await getSubscriptionDBCall();
  const defaultSubscription = subscriptions?.find((sub) => sub.isDefault);

  const priceCards = [];

  // Add regular price card if exists
  if (regularPrice) {
    priceCards.push({
      icon: <CertificationCheckboxIcon />,
      label: "রেগুলার প্রাইস",
      price: `৳${convertNumberToBangla(regularPrice)}`,
    });
  }

  // Add subscription price card if exists
  if (defaultSubscription) {
    const discountPercentage =
      defaultSubscription.subscriptionDiscount?.discountPercentage || 0;
    const discountPrice =
      Math.floor((discountPercentage * regularPrice) / 100) || 0;

    priceCards.push({
      icon: <CertificationCrownIcon />,
      label: "সাবস্ক্রিপশন ফি",
      price: `৳${convertNumberToBangla(discountPrice || regularPrice)}`,
      ...(discountPrice && {
        originalPrice: `৳${convertNumberToBangla(regularPrice)}`,
        discount: `(${convertNumberToBangla(discountPercentage)}% ডিসকাউন্ট)`,
      }),
    });
  }

  return (
    <div
      id="certification-fee"
      className="flex flex-col justify-start items-start relative gap-4 max-w-4xl"
    >
      <CertificationSectionTitle title="সার্টিফিকেশন ফি" />
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full">
        {priceCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start gap-2.5 px-4 py-[18px] rounded-lg bg-white border-[1.2px] border-[#dfedeb] w-full shadow-[0px_4px_4px_0px_rgba(2,22,20,0.02)]"
          >
            <div className="flex flex-col justify-start items-start gap-[18px]">
              <div className="flex justify-start items-center gap-1">
                {card.icon}
                <p className="text-base text-left text-[#41504f]">
                  {card.label}
                </p>
              </div>
              {card.discount ? (
                <div className="flex justify-start items-center gap-3">
                  <div className="flex justify-start items-center gap-2">
                    <p className="text-2xl font-bold text-left text-[#021614]">
                      {card.price}
                    </p>
                    <p className="text-lg text-center text-[#808a89] line-through">
                      {card.originalPrice}
                    </p>
                  </div>
                  <p className="text-sm text-left text-[#021614]">
                    {card.discount}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-left text-[#021614]">
                  {card.price}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationPrice;
