// app/api/courses/access/free/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import {
  updateTeacherBalance,
  updateTeacherMonthlyEarnings,
  enrollStudentToTheCourse,
} from "@/lib/utils/purchase";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const PURCHASE_TYPE_SINGLE_COURSE = "SINGLE_COURSE";
  const { courseId } = await req.json();
  const { userId } = await getServerUserSession();

  try {
    if (!courseId || !userId) {
      return NextResponse.json(
        { error: "Missing courseId or userId" },
        { status: 400 }
      );
    }

    const [user, course] = await Promise.all([
      db.user.findUnique({ where: { id: userId } }),
      db.course.findUnique({
        where: { id: courseId, isPublished: true },
        include: { lessons: true, enrolledStudents: true },
      }),
    ]);

    if (!user || !course) {
      return NextResponse.json(
        { error: "User or Course not found" },
        { status: 404 }
      );
    }

    const studentProfileId = await useStudentProfile(user.id);
    const teacherProfileId = course.teacherProfileId;

    // Get teacher details
    const teacher = await db.teacherProfile.findUnique({
      where: { id: teacherProfileId },
      include: { teacherRank: true },
    });

    if (!teacher || !teacher.teacherRankId) {
      return NextResponse.json(
        { error: "Teacher not found or no rank assigned" },
        { status: 404 }
      );
    }

    const ranks = await db.teacherRank.findMany({
      orderBy: { numberOfSales: "asc" },
    });

    const teacherRevenue = 0; // No revenue for free access

    if (!studentProfileId) {
      return NextResponse.json(
        { error: "Student profile not found!" },
        { status: 404 }
      );
    }
    // 1. Create a Purchase record
    const newPurchase = await db.purchase.create({
      data: {
        studentProfileId,
        teacherProfileId,
        courseId,
        purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
        TeacherRevenue: {
          create: {
            teacherProfileId,
            amount: teacherRevenue,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            teacherRankId: teacher.teacherRank?.id || "",
          },
        },
      },
    });

    // 2. Enroll student to the course
    if (newPurchase) {
      await enrollStudentToTheCourse(
        course,
        studentProfileId,
        teacherProfileId,
        ranks
      );
    }

    // 3. Update teacher's monthly earnings (0 revenue still needs a record)
    await updateTeacherMonthlyEarnings(teacherProfileId, teacherRevenue);

    // 4. Update teacher's balance (optional here, depending on logic)
    await updateTeacherBalance(teacherProfileId);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/${course.lessons[0]?.slug}?success=1`,
      302
    );
  } catch (error) {
    console.error("[FREE_COURSE_ACCESS_ERROR]", error);

    try {
      const courseFallback = await db.course.findUnique({
        where: { id: courseId },
        select: { slug: true },
      });

      const redirectUrl = courseFallback?.slug
        ? `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseFallback.slug}?cancelled=1`
        : `${process.env.NEXT_PUBLIC_APP_URL}?cancelled=1`;

      return NextResponse.redirect(redirectUrl, 302);
    } catch (err) {
      console.error("[REDIRECT_ERROR]", err);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}?cancelled=1`,
        302
      );
    }
  }
}
