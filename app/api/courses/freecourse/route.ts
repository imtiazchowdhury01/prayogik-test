// api/courses/freecourse/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    // Get student profile
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        teacherProfileId: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const teacherProfileId = course.teacherProfileId;

    // Check if already enrolled
    const enrollmentCheck = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        courseId: courseId,
      },
    });

    const isUserEnrolled = !!enrollmentCheck;

    if (isUserEnrolled) {
      return NextResponse.json(
        { error: true, message: "Course already purchased" },
        { status: 409 }
      );
    }

    // Create purchase with required fields
    const purchase = await db.purchase.create({
      data: {
        studentProfileId: studentProfile.id,
        teacherProfileId,
        courseId: courseId,
        purchaseType: "SINGLE_COURSE",
        totalAmountTk: 0,
        creditsUsedTk: 0,
        totalPaidTk: 0,
        remainingAmountTk: 0,
        paymentStatus: "COMPLETED",
        teacherRevenue: {
          create: {
            teacherProfileId: teacherProfileId,
            amount: 0,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        },
      },
    });

    // Enroll student
    await db.enrolledStudents.create({
      data: {
        courseId: courseId,
        studentProfileId: studentProfile.id,
      },
    });

    // Update teacher's total sales
    const updatedTeacherProfile = await db.teacherProfile.update({
      where: {
        id: teacherProfileId,
      },
      data: {
        totalSales: {
          increment: 1,
        },
      },
      select: {
        totalSales: true,
      },
    });

    const teachersTotalSales = updatedTeacherProfile.totalSales;

    // Fetch all ranks and sort by numberOfSales
    const ranks = await db.teacherRank.findMany({
      orderBy: {
        numberOfSales: "asc",
      },
    });

    let newRankId: string | undefined;

    // Calculate the new rank based on the total sales
    if (teachersTotalSales === 0) {
      newRankId = ranks[0]?.id;
    } else {
      // Assign rank ID based on totalSales
      for (const rank of ranks) {
        if (rank.numberOfSales <= teachersTotalSales) {
          newRankId = rank.id;
        }
      }
    }

    // Update the teacher's rank if a new rank was determined
    if (newRankId) {
      await db.teacherProfile.update({
        where: {
          id: teacherProfileId,
        },
        data: {
          teacherRankId: newRankId,
        },
      });
    }

    return NextResponse.json(
      { success: true, message: "Course purchased successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[FREE_COURSE_PURCHASE_ERROR]", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Purchase already exists for this course and user." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
}
