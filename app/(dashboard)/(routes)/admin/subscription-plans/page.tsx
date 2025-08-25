// @ts-nocheck
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { SubscriptionDiscount, SubscriptionPlan } from "@prisma/client";
import { columns } from "./_components/columns";

const SubscriptionPlans = async () => {
  let data: (SubscriptionPlan & SubscriptionDiscount)[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions`
    );

    const responseJson = await response.json();
    data = convertData(responseJson);
    // console.log('data result:', data);
  } catch (err) {
    console.error("Failed to fetch subscription plans:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

const convertData = (data: (SubscriptionPlan & SubscriptionDiscount)[]) => {
  return data.map((item) => {
    const { subscriptionDiscount, ...rest } = item; // Destructure the subscriptionDiscount
    // Merge the original item with flattened subscription discount fields
    return {
      ...rest,
      subscriptionDiscount_id: subscriptionDiscount.id,
      subscriptionDiscount_name: subscriptionDiscount.name,
      subscriptionDiscount_isDefault: subscriptionDiscount.isDefault,
      subscriptionDiscount_discountPercentage:
        subscriptionDiscount.discountPercentage,
      subscriptionDiscount_createdAt: subscriptionDiscount.createdAt,
      subscriptionDiscount_updatedAt: subscriptionDiscount.updatedAt,
      subscribers_count: item._count.subscription,
      durationInMonths: item.durationInMonths || 1,
      durationInYears: item.durationInYears || 1,
      isTrial: item.isTrial || false,
      trialDurationInDays: item.trialDurationInDays || 30,
      regularPrice: item.regularPrice || 0,
    };
  });
};

export default SubscriptionPlans;
