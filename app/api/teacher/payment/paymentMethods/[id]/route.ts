// api/teacher/payment/paymentMethods/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { isPrimary } = await request.json();

  try {
    const updatedBankAccount = await db.bankAccount.update({
      where: { id },
      data: { isPrimary },
    });

    if (isPrimary && updatedBankAccount.teacherProfileId) {
      await db.bankAccount.updateMany({
        where: {
          teacherProfileId: updatedBankAccount.teacherProfileId,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    return NextResponse.json(updatedBankAccount);
  } catch (error) {
    console.error("Error updating bank account:", error);
    return NextResponse.json(
      { error: "Error updating bank account" },
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
    await db.bankAccount.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return NextResponse.json(
      { error: "Error deleting bank account" },
      { status: 500 }
    );
  }
}
