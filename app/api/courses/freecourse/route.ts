// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { NextRequest, NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

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

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { enrolledStudents: true },
    });

    const teacherProfileId = course.teacherProfileId;

    const studentProfileId = await useStudentProfile(userId);

    const enrollmentCheck =
      Array.isArray(course.enrolledStudents) &&
      course.enrolledStudents.find(
        (student) => student.studentProfileId === studentProfileId
      );

    const isUserEnrolled = !!enrollmentCheck;

    if (isUserEnrolled) {
      return NextResponse.json(
        { error: true, message: "Course already purchased" },
        { status: 500 }
      );
    }
    const purchase = await db.purchase.create({
      data: {
        studentProfileId,
        teacherProfileId,
        courseId: courseId,
        purchaseType: "SINGLE_COURSE",

        TeacherRevenue: {
          create: {
            // userId: user.id,
            teacherProfileId: teacherProfileId,
            // courseId: courseId,
            amount: 0,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        },
      },
    });

    if (!isUserEnrolled) {
      await db.enrolledStudents.create({
        data: {
          courseId: courseId,
          studentProfileId: studentProfileId,
        },
      });

      // Update the totalSales in the TeacherProfile model
      await db.teacherProfile.update({
        where: {
          id: teacherProfileId,
        },
        data: {
          totalSales: {
            increment: 1,
          },
        },
      });

      // Find totalSales of the teacher
      const teacherProfile = await db.teacherProfile.findUnique({
        where: {
          id: teacherProfileId,
        },
        select: { totalSales: true },
      });

      // Ensure totalSales has a value before accessing it
      const teachersTotalSales = teacherProfile ? teacherProfile.totalSales : 0;

      // Fetch all ranks
      const unsortedRanks = await db.teacherRank.findMany();
      const ranks = unsortedRanks.sort(
        (a, b) => a.numberOfSales - b.numberOfSales
      );

      let newRankId;

      // Calculate the new rank based on the total sales
      if (teachersTotalSales === 0) {
        newRankId = ranks[0].id; // Assuming ranks array is not empty
      } else {
        // Assign rank ID based on totalSales
        for (const rank of ranks) {
          if (rank.numberOfSales <= teachersTotalSales) {
            newRankId = rank.id;
          }
        }
      }

      // Update the teacher's rank based on the totalSales
      const updateTeacherRanksPromise = await db.teacherProfile.update({
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
  } catch (error) {
    console.error("[CALLBACK_ERROR]", error);

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
