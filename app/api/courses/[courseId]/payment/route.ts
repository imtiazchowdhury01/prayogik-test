// // @ts-nocheck
// import { db } from "@/lib/db";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { getCoursePurchaseCount } from "@/lib/utils/getCoursePurchaseCount";
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { v4 as uuid } from "uuid";

// const isDiscountExpired = (expiresAt) => {
//   const currentDate = new Date();
//   return currentDate.getTime() > expiresAt?.getTime();
// };

// const getStudentProfile = async (userId) => {
//   // Check if userId is provided
//   if (!userId) {
//     return;
//   }

//   // Fetch the teacher profile using the provided userId
//   const studentProfile = await db.studentProfile.findUnique({
//     where: { userId },
//     include: {
//       subscription: {
//         include: {
//           subscriptionPlan: {
//             include: {
//               subscriptionDiscount: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return studentProfile;
// };

// export async function POST(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   const {
//     priceId,
//     teacherId,
//     isSubscribedUser,
//     isPurchasingUnderSubscriptionPrice,
//   } = await req.json();

//   try {
//     const { userId } = await getServerUserSession();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const studentProfile = await getStudentProfile(userId);
//     const studentProfileId = studentProfile.id;

//     const coursePromise = db.course.findUnique({
//       where: {
//         id: params.courseId,
//         isPublished: true,
//       },
//       include: {
//         // subscriptionDiscount: true,
//       },
//     });

//     const pricePromise = db.price.findUnique({
//       where: {
//         id: priceId,
//         courseId: params.courseId,
//       },
//     });

//     const [course, price] = await Promise.all([coursePromise, pricePromise]);
//     const isDiscountGotExpired =
//       price?.discountExpiresOn && price?.discountedAmount
//         ? isDiscountExpired(price?.discountExpiresOn)
//         : true;

//     let priceForMember;

//     if (isSubscribedUser && isPurchasingUnderSubscriptionPrice) {
//       let subDiscount =
//         studentProfile?.subscription?.subscriptionPlan?.subscriptionDiscount
//           ?.discountPercentage;
//       priceForMember = !isDiscountGotExpired
//         ? price?.discountedAmount -
//           (price?.discountedAmount * subDiscount) / 100
//         : price?.regularAmount - (price?.regularAmount * subDiscount) / 100;
//     }

//     if (!course || !price) {
//       return new NextResponse("Invalid request", {
//         status: 404,
//       });
//     }

//     const existingPurchase = await db.purchase.findFirst({
//       where: {
//         studentProfileId,
//         courseId: params.courseId,
//       },
//     });

//     if (existingPurchase) {
//       return new NextResponse("Already purchased", { status: 400 });
//     }

//     const user = await db.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return new NextResponse("User not found", { status: 404 });
//     }

//     if (isSubscribedUser && isPurchasingUnderSubscriptionPrice) {
//       // get coursePurchaseCount
//       const coursePurchaseCount = await getCoursePurchaseCount(
//         studentProfileId
//       );
//       const courseLimit =
//         studentProfile?.subscription?.subscriptionPlan?.courseLimit;
//       if (coursePurchaseCount >= courseLimit) {
//         return new NextResponse(
//           "Maximum Purchase limit reached under subscription",
//           {
//             status: 400,
//           }
//         );
//       }
//     }

//     // calculating price for course
//     const courseAmount = priceForMember
//       ? priceForMember
//       : price.discountExpiresOn &&
//         price.discountedAmount &&
//         !isDiscountGotExpired
//       ? price.discountedAmount
//       : price.regularAmount;

//     const formData = {
//       cus_name: user.name,
//       cus_email: user.email,
//       cus_phone: user.phoneNumber ? user.phoneNumber : "not available",
//       amount: courseAmount,
//       tran_id: uuid(),
//       signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
//       store_id: process.env.AAMARPAY_STORE_ID,
//       currency: "BDT",
//       desc: `Course: ${course.title}`,
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&teacherId=${teacherId}&success=1`,
//       fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&failed=1`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?canceled=1`,
//       type: "json",
//       opt_a: userId,
//       opt_b: price.id,
//       opt_c: isSubscribedUser,
//       opt_d: isPurchasingUnderSubscriptionPrice,
//     };

//     const paymentUrl = process.env.AAMARPAY_URL;

//     if (!paymentUrl) {
//       return new NextResponse("Payment URL is missing", { status: 404 });
//     }

//     const { data } = await axios.post(paymentUrl, formData, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (data.result !== "true") {
//       let errorMessage = "";
//       for (let key in data) {
//         errorMessage += data[key] + ". ";
//       }
//       return NextResponse.json({ message: errorMessage }, { status: 400 });
//     }

//     return NextResponse.json({ url: data.payment_url });
//   } catch (error) {
//     console.error("[COURSE_ID_CHECKOUT]", error);
//     return NextResponse.json({ message: "Internal Error" }, { status: 500 });
//   }
// }

//  ================================

// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import axios from "axios";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const isDiscountExpired = (expiresAt) => {
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt?.getTime();
};

const getStudentProfile = async (userId) => {
  if (!userId) {
    return;
  }

  const studentProfile = await db.studentProfile.findUnique({
    where: { userId },
    include: {
      subscription: {
        include: {
          subscriptionPlan: {
            include: {
              subscriptionDiscount: true,
            },
          },
        },
      },
    },
  });

  return studentProfile;
};

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const {
    priceId,
    teacherId,
    isSubscribedUser,
    isPurchasingUnderSubscriptionPrice,
  } = await req.json();

  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const studentProfile = await getStudentProfile(userId);
    if (!studentProfile) {
      return new NextResponse("Student profile not found", { status: 404 });
    }

    const studentProfileId = studentProfile.id;

    const coursePromise = db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
      include: {
        // subscriptionDiscount: true,
      },
    });

    const pricePromise = db.price.findUnique({
      where: {
        id: priceId,
        courseId: params.courseId,
      },
    });

    const [course, price] = await Promise.all([coursePromise, pricePromise]);
    if (!course || !price) {
      return new NextResponse("Invalid request", { status: 404 });
    }

    const isDiscountGotExpired =
      price?.discountExpiresOn && price?.discountedAmount
        ? isDiscountExpired(price?.discountExpiresOn)
        : true;

    let priceForMember;

    if (isSubscribedUser && isPurchasingUnderSubscriptionPrice) {
      let subDiscount =
        studentProfile?.subscription?.subscriptionPlan?.subscriptionDiscount
          ?.discountPercentage;
      priceForMember = !isDiscountGotExpired
        ? price?.discountedAmount -
          (price?.discountedAmount * subDiscount) / 100
        : price?.regularAmount - (price?.regularAmount * subDiscount) / 100;
    }

    const existingPurchase = await db.purchase.findFirst({
      where: {
        studentProfileId,
        courseId: params.courseId,
      },
    });

    if (existingPurchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const courseAmount = priceForMember
      ? priceForMember
      : price.discountExpiresOn &&
        price.discountedAmount &&
        !isDiscountGotExpired
      ? price.discountedAmount
      : price.regularAmount;

    const formData = {
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phoneNumber ? user.phoneNumber : "not available",
      amount: courseAmount,
      tran_id: uuid(),
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      store_id: process.env.AAMARPAY_STORE_ID,
      currency: "BDT",
      desc: `Course: ${course.title}`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&teacherId=${teacherId}&success=1`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&failed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?canceled=1`,
      type: "json",
      opt_a: userId,
      opt_b: price.id,
      opt_c: isSubscribedUser,
      opt_d: isPurchasingUnderSubscriptionPrice,
    };

    const paymentUrl = process.env.AAMARPAY_URL;

    if (!paymentUrl) {
      return new NextResponse("Payment URL is missing", { status: 404 });
    }

    const { data } = await axios.post(paymentUrl, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data.result !== "true") {
      let errorMessage = "";
      for (let key in data) {
        errorMessage += data[key] + ". ";
      }
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ url: data.payment_url });
  } catch (error) {
    console.error("[COURSE_ID_CHECKOUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
