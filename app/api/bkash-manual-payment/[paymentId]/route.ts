import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { bkashManualPaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface UpdateBkashManualPaymentBody {
  paymentId: string;
  payFrom?: string[];
  trxId?: string[];
  amount?: number;
  status?: bkashManualPaymentStatus;
  isAdmin?: boolean;
}

// PUT - Update a Bkash Manual Payment
export async function PUT(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { payFrom, trxId, amount, status }: UpdateBkashManualPaymentBody =
      await req.json();

    const session = await getServerUserSession(req);
    const { paymentId } = params;

    // Validate required fields
    if (!paymentId) {
      return NextResponse.json(
        { message: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Check if payment exists
    const existingPayment = await db.bkashManualPayment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Authorization check
    // Admin can update any payment
    if (!session.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};

    if (payFrom !== undefined) updateData.payFrom = payFrom;
    if (trxId !== undefined) updateData.trxId = trxId;
    if (amount !== undefined) updateData.amount = amount;

    // Only admin can update status
    if (status !== undefined) {
      if (!session.isAdmin) {
        return NextResponse.json(
          { message: "Only admin can update payment status" },
          { status: 403 }
        );
      }
      updateData.status = status;
    }

    // Update the payment
    const updatedPayment = await db.bkashManualPayment.update({
      where: { id: paymentId },
      data: updateData,
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
      },
    });

    return NextResponse.json(
      {
        message: "Bkash manual payment updated successfully",
        data: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bkash manual payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET - Bkash ManualPayment by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
): Promise<Response> {
  try {
    const { paymentId } = params;
    const id = paymentId;

    if (!id) {
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }

    const session = await getServerUserSession(req);
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "No user ID found" },
        { status: 400 }
      );
    }

    const course = await db.course.findUnique({ where: { id } });
    const subscriptionPlan = await db.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });

    let whereClause;

    if (course) {
      whereClause = {
        courseId: course.id,
      };
    } else if (subscriptionPlan) {
      whereClause = {
        subscriptionPlanId: subscriptionPlan.id,
      };
    }

    const manualPayment = await db.bkashManualPayment.findFirst({
      where: {
        ...whereClause,
        userId,
      },
    });

    if (!manualPayment) {
      return NextResponse.json(
        { message: "Manual Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(manualPayment);
  } catch (error) {
    console.error("Error fetching bkash manual payment by ID:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a Bkash Manual Payment
export async function DELETE(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerUserSession(req);
    // console.log('session result:', session);
    const { paymentId } = params;

    // Validate required fields
    if (!paymentId) {
      return NextResponse.json(
        { message: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Check if payment exists
    const existingPayment = await db.bkashManualPayment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Authorization check - Only admin can delete payments
    // if (!session.isAdmin) {
    //   return NextResponse.json(
    //     { message: "Unauthorized - Only admin can delete payments" },
    //     { status: 403 }
    //   );
    // }

    // Delete the payment
    await db.bkashManualPayment.delete({
      where: { id: paymentId },
    });

    return NextResponse.json(
      {
        message: "Bkash manual payment deleted successfully",
        deletedId: paymentId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bkash manual payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}