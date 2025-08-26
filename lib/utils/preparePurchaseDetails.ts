import { db } from "../db";

const preparePurchaseDetails = async (
  payload: any,
  purchase: any,
  subscription: any,
  course: any = null,
  subscriptionPlan: any = null
) => {
  const purchaseDetails: {
    purchaseType: any;
    transactionId: any;
    amount: any;
    expiresAt: any;
    isTrial: boolean;
    courseName: string | null;
    subscriptionPlanName: string | null;
  } = {
    purchaseType: payload.type,
    transactionId: payload.trxID || null,
    amount: payload.amount || null,
    expiresAt: purchase?.expiresAt || subscription?.expiresAt || null,
    isTrial: subscription?.isTrial || false,
    courseName: null,
    subscriptionPlanName: null,
  };

  // Get course details if courseId exists
  if (payload.courseId && !course) {
    const courseData = await db.course.findUnique({
      where: { id: payload.courseId },
      select: { title: true },
    });
    purchaseDetails.courseName = courseData?.title || null;
  } else if (course) {
    purchaseDetails.courseName = course.title;
  }

  // Get subscription plan details if subscriptionPlanId exists
  if (payload.subscriptionPlanId && !subscriptionPlan) {
    const subscriptionPlanData = await db.subscriptionPlan.findUnique({
      where: { id: payload.subscriptionPlanId },
      select: { name: true },
    });
    purchaseDetails.subscriptionPlanName = subscriptionPlanData?.name || null;
  } else if (subscriptionPlan) {
    purchaseDetails.subscriptionPlanName = subscriptionPlan.name;
  }

  return purchaseDetails;
};
export default preparePurchaseDetails;
