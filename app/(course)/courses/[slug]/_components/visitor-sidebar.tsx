//@ts-nocheck
import SingleCoursePriceTab from "./single-course-price-tab";
import { fetchSubscriptionDisounts } from "@/services";
import { fetchUserSubscription } from "@/services/user";
import { clientApi } from "@/lib/utils/openai/client";
import { Urls } from "@/constants/urls";
import {
  getSubscriptionDBCall,
  getSubscriptionDiscountDBCall,
} from "@/lib/data-access-layer/subscriptions";

export default async function VisitorSidebar({
  course,
  preview,
  paymentStatus,
}: any) {
  const freeLesson = course?.lessons?.find(
    (lesson: any) => lesson.isFree && lesson.videoUrl
  );

  const allSubscription = await getSubscriptionDBCall();
  const salesData = allSubscription.find(
    (s) => s.isDefault
  )?.subscriptionDiscount;
  const plan = allSubscription.find((p) => p.isDefault);
  return (
    <>
      <div className="lg:mt-6 bg-[#F3F9F9] p-6 rounded-lg">
        <SingleCoursePriceTab
          course={course}
          plan={plan}
          defaultDiscount={plan?.subscriptionDiscount}
          preview={preview}
        />
      </div>
    </>
  );
}
