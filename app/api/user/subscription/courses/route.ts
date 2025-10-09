// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tiralCourseAccessSchema } from "@/lib/utils/openai/types";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const { userId } = await getServerUserSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "অনুমোদন প্রয়োজন" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validatedData = tiralCourseAccessSchema.parse(body);

    const subscriptionId = validatedData.subscriptionId;
    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "সাবস্ক্রিপশন ID প্রয়োজন" },
        { status: 400 }
      );
    }

    // Find the user's student profile
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return NextResponse.json(
        { success: false, message: "স্টুডেন্ট প্রোফাইল পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // Find the subscription and verify ownership
    const subscription = await db.subscription.findUnique({
      where: {
        id: subscriptionId,
        studentProfileId: user.studentProfile.id,
      },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "সাবস্ক্রিপশন পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // Check if it's a trial subscription
    if (!subscription.subscriptionPlan?.isTrial) {
      return NextResponse.json(
        { success: false, message: "এটি একটি ট্রায়াল সাবস্ক্রিপশন নয়" },
        { status: 400 }
      );
    }

    // Get existing selected course IDs
    const existingCourseIds = subscription.trialSelectedCourseIds || [];

    // Merge existing IDs with new ones (remove duplicates)
    const mergedCourseIds = Array.from(
      new Set([...existingCourseIds, ...validatedData.courseIds])
    );

    // Check if the total number exceeds the trial limit
    if (
      mergedCourseIds.length > subscription.subscriptionPlan?.trialCourseLimit
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `ট্রায়াল কোর্স লিমিট অতিক্রম করেছে। সর্বোচ্চ ${subscription.subscriptionPlan?.trialCourseLimit}টি কোর্স নির্বাচন করতে পারবেন। বর্তমানে ${existingCourseIds.length}টি নির্বাচিত আছে।`,
          data: {
            currentLimit: subscription.subscriptionPlan?.trialCourseLimit,
            currentlySelected: existingCourseIds.length,
            attemptingToAdd: validatedData.courseIds.length,
            totalWouldBe: mergedCourseIds.length,
            alreadySelectedCourses: existingCourseIds,
          },
        },
        { status: 409 } // Conflict
      );
    }

    // Filter out new course IDs that don't already exist
    const newCourseIds = validatedData.courseIds.filter(
      (id) => !existingCourseIds.includes(id)
    );

    // If no new courses to add, return early
    if (newCourseIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "সব কোর্স ইতিমধ্যে নির্বাচিত আছে",
          data: {
            alreadySelectedCourses: existingCourseIds,
          },
        },
        { status: 409 }
      );
    }

    // Validate that the NEW course IDs exist and are published
    const courses = await db.course.findMany({
      where: {
        id: { in: newCourseIds },
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (courses.length !== newCourseIds.length) {
      const foundIds = courses.map((c) => c.id);
      const notFoundIds = newCourseIds.filter((id) => !foundIds.includes(id));

      return NextResponse.json(
        {
          success: false,
          message: "কিছু কোর্স পাওয়া যায়নি বা প্রকাশিত নয়",
          data: { notFoundCourseIds: notFoundIds },
        },
        { status: 400 }
      );
    }

    // Check if trial period is still active
    const now = new Date();
    if (subscription.trialEndsAt && subscription.trialEndsAt < now) {
      return NextResponse.json(
        { success: false, message: "ট্রায়াল পিরিয়ড শেষ হয়ে গেছে" },
        { status: 400 }
      );
    }

    // Update the subscription with merged course IDs
    const updatedSubscription = await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        trialSelectedCourseIds: mergedCourseIds,
      },
      include: {
        trialSelectedCourses: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            teacherProfile: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                lessons: true,
                enrolledStudents: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message:
        newCourseIds.length === 1
          ? "ট্রায়াল কোর্স সফলভাবে যোগ করা হয়েছে"
          : `${newCourseIds.length}টি ট্রায়াল কোর্স সফলভাবে যোগ করা হয়েছে`,
      data: {
        subscription: {
          id: updatedSubscription.id,
          trialSelectedCourseIds: updatedSubscription.trialSelectedCourseIds,
          trialSelectedCourses: updatedSubscription.trialSelectedCourses,
          trialEndsAt: updatedSubscription.trialEndsAt,
        },
        addedCourses: newCourseIds,
        totalSelected: updatedSubscription.trialSelectedCourseIds.length,
        remainingSlots:
          subscription.subscriptionPlan?.trialCourseLimit -
          updatedSubscription.trialSelectedCourseIds.length,
      },
    });
  } catch (error) {
    console.error("Trial courses update error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "আপনার প্রদত্ত ডেটা সঠিক নয়। অনুগ্রহ করে আবার যাচাই করুন।",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "আপনি ইতিমধ্যে এই কোর্সে নথিভুক্ত আছেন" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "সার্ভার ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
