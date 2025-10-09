// api/courses/[courseId]/payment/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

interface PaymentRequest {
  priceId: string;
  teacherId: string;
  isSubscribedUser: boolean;
  isPurchasingUnderSubscriptionPrice: boolean;
}

interface PaymentResponse {
  url?: string;
  message?: string;
}

type StudentWithSubscription = Prisma.StudentProfileGetPayload<{
  include: {
    subscription: {
      include: {
        subscriptionPlan: {
          include: {
            subscriptionDiscount: true;
          };
        };
      };
    };
  };
}>;

type CourseWithDetails = Prisma.CourseGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    isPublished: true;
  };
}>;

type PriceWithDetails = Prisma.PriceGetPayload<{
  select: {
    id: true;
    regularAmount: true;
    discountedAmount: true;
    discountExpiresOn: true;
  };
}>;

// ========== HELPER FUNCTIONS ==========

const isDiscountExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return true;
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt.getTime();
};

const getStudentProfile = async (
  userId: string
): Promise<StudentWithSubscription | null> => {
  return await db.studentProfile.findUnique({
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
};

// ========== POST HANDLER ==========

export async function POST(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<PaymentResponse>> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json(
        { message: "Missing courseId" },
        { status: 400 }
      );
    }

    const body: PaymentRequest = await req.json();
    const {
      priceId,
      teacherId,
      isSubscribedUser,
      isPurchasingUnderSubscriptionPrice,
    } = body;

    if (!priceId || !teacherId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const studentProfile = await getStudentProfile(userId);

    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    const studentProfileId = studentProfile.id;

    // Fetch course and price in parallel
    const [course, price] = await Promise.all([
      db.course.findUnique({
        where: {
          id: courseId,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
        },
      }),
      db.price.findUnique({
        where: {
          id: priceId,
          courseId: courseId,
        },
        select: {
          id: true,
          regularAmount: true,
          discountedAmount: true,
          discountExpiresOn: true,
        },
      }),
    ]);

    if (!course || !price) {
      return NextResponse.json(
        { message: "Course or price not found" },
        { status: 404 }
      );
    }

    // Check if already purchased
    const existingPurchase = await db.purchase.findFirst({
      where: {
        studentProfileId,
        courseId: courseId,
        paymentStatus: "COMPLETED",
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { message: "Already purchased" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Calculate discount
    const isDiscountActive =
      price.discountExpiresOn && price.discountedAmount
        ? !isDiscountExpired(price.discountExpiresOn)
        : false;

    let courseAmount = price.regularAmount;

    if (isDiscountActive && price.discountedAmount) {
      courseAmount = price.discountedAmount;
    }

    // Apply subscription discount if applicable
    if (isSubscribedUser && isPurchasingUnderSubscriptionPrice) {
      const subDiscount =
        studentProfile.subscription?.subscriptionPlan?.subscriptionDiscount
          ?.discountPercentage || 0;

      if (subDiscount > 0) {
        courseAmount = courseAmount - (courseAmount * subDiscount) / 100;
      }
    }

    // Prepare payment data
    const formData = {
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phoneNumber || "not available",
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
      opt_c: isSubscribedUser.toString(),
      opt_d: isPurchasingUnderSubscriptionPrice.toString(),
    };

    const paymentUrl = process.env.AAMARPAY_URL;

    if (!paymentUrl) {
      return NextResponse.json(
        { message: "Payment URL is missing" },
        { status: 500 }
      );
    }

    const { data } = await axios.post(paymentUrl, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data.result !== "true") {
      const errorMessage = Object.values(data).join(". ");
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ url: data.payment_url });
  } catch (error: any) {
    console.error("[COURSE_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { message: error?.message || "Internal Error" },
      { status: 500 }
    );
  }
}
