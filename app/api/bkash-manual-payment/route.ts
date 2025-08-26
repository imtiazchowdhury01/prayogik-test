import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  addMonths,
  addYears,
} from "@/lib/utils/expireDate/generate-expire-date";
import {
  bkashManualPaymentStatus,
  BkashManualPaymentType,
} from "@prisma/client";
import { NextResponse } from "next/server";

interface GetBkashManualPaymentsBody {
  isAdmin: boolean;
}

interface CreateBkashManualPaymentBody {
  isAdmin: boolean;
  userId: string;
  courseId?: string;
  subscriptionId?: string;
  payFrom: string[];
  payableAmount: number;
  trxId: string[];
  amount?: number;
  status?: bkashManualPaymentStatus;
  type: BkashManualPaymentType;
  title: string;
}

// GET - Fetch all Bkash Manual Payments
export async function GET(req: Request) {
  try {
    const session = await getServerUserSession(req);
    if (!session.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const payments = await db.bkashManualPayment.findMany({
      include: {
        course: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        subscriptionPlan: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(
      { message: "Bkash manual payments fetched successfully", data: payments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bkash manual payments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new Bkash Manual Payment
export async function POST(req: Request) {
  try {
    const {
      courseId,
      payFrom,
      payableAmount,
      trxId,
      type,
      title,
      subscriptionId,
    }: CreateBkashManualPaymentBody = await req.json();
    let subscriptionPlanId = subscriptionId;
    const session = await getServerUserSession(req);
    const userId = session.userId;

    // Validate required fields
    if (
      !userId ||
      (!courseId && !subscriptionPlanId) ||
      !payFrom ||
      !trxId ||
      !payableAmount
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // studentProfile fetch
    const studentProfile = await db.studentProfile.findUnique({
      where: {
        userId,
      },
    });
    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    let whereClause: any = {
      userId,
    };

    if (subscriptionPlanId) {
      whereClause = {
        ...whereClause,
        subscriptionPlanId: subscriptionPlanId,
      };

      // Calculate expiration
      const subscriptionPlan = await db.subscriptionPlan.findUnique({
        where: { id: subscriptionPlanId },
      });

      if (!subscriptionPlan) {
        return NextResponse.json(
          { message: "Subscription plan not found" },
          { status: 400 }
        );
      }

      const currentDate = new Date();
      let expiresAt: Date = currentDate;

      if (subscriptionPlan.type === "MONTHLY") {
        expiresAt = addMonths(currentDate, 1);
      } else if (subscriptionPlan.type === "YEARLY") {
        expiresAt = addYears(currentDate, 1);
      }

      // Create a new subscription for the user and its status would be pending
      await db.subscription.create({
        data: {
          studentProfileId: studentProfile.id,
          subscriptionPlanId,
          expiresAt,
          status: "PENDING",
        },
      });
    }

    if (courseId) {
      whereClause = {
        ...whereClause,
        courseId: courseId,
      };

      if (type === "OFFER") {
        const subscriptionText = title?.split("+")[0].trim() || "";
        const isSubscriptionTextExist = await db.subscriptionPlan.findFirst({
          where: {
            name: subscriptionText,
          },
        });

        if (isSubscriptionTextExist) {
          subscriptionPlanId = isSubscriptionTextExist.id;

          // Expirest at calculate
          const currentDate = new Date();
          let expiresAt: Date = currentDate;

          if (isSubscriptionTextExist.type === "MONTHLY") {
            expiresAt = addMonths(currentDate, 1);
          } else if (isSubscriptionTextExist.type === "YEARLY") {
            expiresAt = addYears(currentDate, 1);
          }

          await db.subscription.create({
            data: {
              studentProfileId: studentProfile.id,
              subscriptionPlanId,
              expiresAt,
              status: "PENDING",
            },
          });
        }
      }
    }

    // Check if payment already exists for this user and course
    const existingPayment = await db.bkashManualPayment.findFirst({
      where: whereClause,
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already exists for this user and course" },
        { status: 400 }
      );
    }

    const newPayment = await db.bkashManualPayment.create({
      data: {
        userId,
        courseId,
        subscriptionPlanId,
        type,
        payFrom,
        payableAmount,
        trxId,
        amount: 0,
        status: "PENDING",
        title,
      },
    });

    return NextResponse.json(
      {
        message: "Bkash manual payment created successfully",
        data: newPayment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bkash manual payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
