// src/app/api/teacher/payment/paymentMethods/[id]/route.ts

// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId");

  const paymentMethods = await db.paymentMethod.findMany({
    where: { teacherId },
  });

  return NextResponse.json(paymentMethods);
}

export async function POST(request: Request) {
  const { teacherId, accountNumber, details, type, active } =
    await request.json();

  const newPaymentMethod = await db.paymentMethod.create({
    data: {
      teacherId,
      accountNumber,
      details,
      type,
      active: active !== undefined ? active : true, // Set active to true by default
    },
  });

  return NextResponse.json(newPaymentMethod);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { active } = await request.json();

  try {
    // Update the selected payment method
    const updatedPaymentMethod = await db.paymentMethod.update({
      where: { id },
      data: { active },
    });

    // If setting this method to active, deactivate all other accounts
    if (active) {
      await db.paymentMethod.updateMany({
        where: {
          teacherId: updatedPaymentMethod.teacherId, // Assuming you have the teacherId available
          id: { not: id }, // Exclude the current account
        },
        data: { active: false }, // Deactivate others
      });
    }

    return NextResponse.json(updatedPaymentMethod);
  } catch (error) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Error updating payment method" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await db.paymentMethod.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Error deleting payment method" },
      { status: 500 }
    );
  }
}
