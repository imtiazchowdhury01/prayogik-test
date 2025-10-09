// api/teacher/payment/paymentMethods/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherProfileId = searchParams.get("teacherProfileId");

  if (!teacherProfileId) {
    return NextResponse.json(
      { error: "Teacher profile ID required" },
      { status: 400 }
    );
  }

  const bankAccounts = await db.bankAccount.findMany({
    where: { teacherProfileId },
  });

  return NextResponse.json(bankAccounts);
}

export async function POST(request: Request) {
  const {
    teacherProfileId,
    accountNumber,
    bankName,
    branch,
    routingNumber,
    accountName,
    isPrimary,
  } = await request.json();

  if (!teacherProfileId) {
    return NextResponse.json(
      { error: "Teacher profile ID required" },
      { status: 400 }
    );
  }

  const newBankAccount = await db.bankAccount.create({
    data: {
      teacherProfileId,
      accountNumber,
      bankName,
      branch,
      routingNumber,
      accountName,
      isPrimary: isPrimary !== undefined ? isPrimary : false,
    },
  });

  return NextResponse.json(newBankAccount);
}

export async function PATCH(request: Request) {
  const { id, isPrimary } = await request.json();

  const updatedBankAccount = await db.bankAccount.update({
    where: { id },
    data: { isPrimary },
  });

  return NextResponse.json(updatedBankAccount);
}
