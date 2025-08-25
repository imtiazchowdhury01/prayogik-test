import React from "react";
import { BenefitCard } from "./BenefitCard";
import { db } from "@/lib/db";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { clientApi } from "@/lib/utils/openai/client";

const SubscriptionBenefit = async () => {
  // Premium courses count
  const premiumCoursesCount = await db.course.count({
    where: {
      isPublished: true,
      isUnderSubscription: true,
    },
  });

  const subscriptionRes = await clientApi.getAllSubscriptionPlans();

  let subscription;
  if (subscriptionRes.status === 200 && subscriptionRes.body) {
    subscription = subscriptionRes.body[0] as any;
  }

  return (
    <div>
      <section className=" bg-[#032421]">
        <div className="app-container flex flex-col gap-12 items-center py-16 sm:py-[100px] max-sm:px-5">
          <h1 className="w-full text-4xl font-bold leading-10 text-center text-white max-sm:text-3xl max-sm:leading-9">
            আপনার পছন্দের কোর্স করুন
          </h1>
          <div className="flex items-start justify-center gap-6 max-md:flex-col max-md:w-full">
            <BenefitCard
              title="ফ্রি প্রিমিয়াম কোর্স"
              description={`প্রায়োগিকের ${
                subscription?.name
              } মেম্বার হলে ${convertNumberToBangla(
                premiumCoursesCount
              )}+ প্রিমিয়াম কোর্স ফ্রিতে করতে পারবেন।`}
            />
            <BenefitCard
              title="কম খরচে স্টান্ডার্ড কোর্স"
              description={`${
                subscription?.name
              } মেম্বার হয়ে নির্ধারিত কোর্সসমূহে সাশ্রয় করুন ${convertNumberToBangla(
                subscription?.subscriptionDiscount?.discountPercentage
              )}% পর্যন্ত!`}
            />
            <BenefitCard
              title="নতুন কোর্সের এক্সেস"
              description="প্রতি মাসে যুক্ত হওয়া নতুন কোর্সগুলোর এক্সেস পাওয়া যাবে।"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionBenefit;
