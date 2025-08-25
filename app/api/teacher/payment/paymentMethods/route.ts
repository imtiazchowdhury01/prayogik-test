// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";

// GET method for fetching payment methods of a teacher
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId");

  const teacherProfileId = await useTeacherProfile(teacherId);

  const paymentMethods = await db.paymentMethod.findMany({
    where: { teacherProfileId },
  });

  return NextResponse.json(paymentMethods);
}

// POST method for creating a new payment method
export async function POST(request) {
  const {
    teacherId,
    accountNumber,
    type,
    bankName,
    branch,
    routingNo,
    accName,
    active,
  } = await request.json();

  const teacherProfileId = await useTeacherProfile(teacherId);

  const newPaymentMethod = await db.paymentMethod.create({
    data: {
      teacherProfileId,
      accountNumber,
      type,
      bankName,
      branch,
      routingNo,
      accName,
      active: active !== undefined ? active : true, // Set active to true by default
    },
  });

  return NextResponse.json(newPaymentMethod);
}

// PATCH method for updating the active status of a payment method
export async function PATCH(request) {
  const { id, active } = await request.json();

  const updatedPaymentMethod = await db.paymentMethod.update({
    where: { id },
    data: { active },
  });

  return NextResponse.json(updatedPaymentMethod);
}
