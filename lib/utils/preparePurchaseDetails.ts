import { db } from "../db";

type purchaseDetails = {
  purchaseId: string | null;
  purchaseType: any;
  transactionId: any;
  amount: any;
  expiresAt: any;
  isTrial: boolean;
  courseName: string | null;
  subscriptionPlanName: string | null;
  eventName: string | null;
  eventDate: any;
  eventType: string | null;
  eventLocation: string | null;
  isOnlineEvent: boolean;
  eventPrice: number | null;
  eventZoomLink: string | null;
  eventstatus: string | null;
  trialStartDate: any;
  trialEndDate: any;
  coursePrice: number | null;
};

function getCoursePrice(prices?: { isFree: boolean; regularAmount: number }[]) {
  if (!prices || prices.length === 0) return null;
  return prices[0].isFree ? null : prices[0].regularAmount || null;
}

const preparePurchaseDetails = async (
  payload: any,
  purchase: any,
  subscription: any,
  course: any = null,
  subscriptionPlan: any = null,
  event: any = null
) => {
  const purchaseDetails: purchaseDetails = {
    purchaseId: purchase?.id || null,
    purchaseType: payload.purchaseType,
    transactionId: payload.trxID || null,
    amount: payload.amount || null,
    expiresAt: purchase?.expiresAt || subscription?.expiresAt || null,
    isTrial: subscription?.isTrial || false,
    courseName: null,
    coursePrice: null,
    subscriptionPlanName: subscription?.subscriptionPlan?.name || null,
    eventName: null,
    eventDate: null,
    eventType: null,
    eventLocation: null,
    isOnlineEvent: false,
    eventPrice: null,
    eventZoomLink: null,
    eventstatus: null,
    trialStartDate: subscription?.startDate || subscription?.createdAt || null,
    trialEndDate: subscription?.expiresAt || null,
  };

  // Get course details if courseId exists
  if (payload.courseId && !course) {
    // console.log("FROM IF CONDITION: ", payload.courseId);
    const courseData = await db.course.findUnique({
      where: { id: payload.courseId },
      select: {
        title: true,
        prices: {
          select: {
            isFree: true,
            regularAmount: true,
          },
        },
      },
    });
    // console.log("FROM IF CONDITION Course: ", courseData);
    purchaseDetails.courseName = courseData?.title || null;
    purchaseDetails.coursePrice = getCoursePrice(courseData?.prices);
  } else if (course) {
    // console.log(course, "courseInfo");
    purchaseDetails.courseName = course.title;
    purchaseDetails.coursePrice = getCoursePrice(course.prices);
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

  // Get event details if eventId exists
  if (payload.eventId && !event) {
    const eventData = await db.event.findUnique({
      where: { id: payload.eventId },
      select: {
        title: true,
        date: true,
        type: true,
        location: true,
        isOnline: true,
        price: true,
        zoomLink: true,
        status: true,
      },
    });
    if (eventData) {
      purchaseDetails.eventName = eventData.title;
      purchaseDetails.eventDate = eventData.date;
      purchaseDetails.eventType = eventData.type;
      purchaseDetails.eventLocation = eventData.location;
      purchaseDetails.isOnlineEvent = eventData.isOnline;
      purchaseDetails.eventPrice = eventData.price;
      purchaseDetails.eventZoomLink = eventData.zoomLink;
      purchaseDetails.eventstatus = eventData.status;
    }
  } else if (event) {
    purchaseDetails.eventName = event.title;
    purchaseDetails.eventDate = event.date;
    purchaseDetails.eventType = event.type;
    purchaseDetails.eventLocation = event.location;
    purchaseDetails.isOnlineEvent = event.isOnline;
    purchaseDetails.eventPrice = event.price;
    purchaseDetails.eventZoomLink = event.zoomLink;
    purchaseDetails.eventstatus = event.status;
  }
  // console.log(purchaseDetails, "Purchase details form prepareDatails fn");
  return purchaseDetails;
};

export default preparePurchaseDetails;
