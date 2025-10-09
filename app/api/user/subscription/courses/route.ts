// api/user/subscription/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tiralCourseAccessSchema } from "@/lib/utils/openai/types";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getServerUserSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "অনুমোদন প্রয়োজন" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = tiralCourseAccessSchema.parse(body);

    const subscriptionId = validatedData.subscriptionId;
    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "সাবস্ক্রিপশন ID প্রয়োজন" },
        { status: 400 }
      );
    }

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

    if (!subscription.subscriptionPlan?.isTrial) {
      return NextResponse.json(
        { success: false, message: "এটি একটি ট্রায়াল সাবস্ক্রিপশন নয়" },
        { status: 400 }
      );
    }

    const existingCourseIds = subscription.trialSelectedCourseIds || [];

    const mergedCourseIds = Array.from(
      new Set([...existingCourseIds, ...validatedData.courseIds])
    );

    const trialCourseLimit =
      subscription.subscriptionPlan?.trialCourseLimit || 0;

    if (mergedCourseIds.length > trialCourseLimit) {
      return NextResponse.json(
        {
          success: false,
          message: `ট্রায়াল কোর্স লিমিট অতিক্রম করেছে। সর্বোচ্চ ${trialCourseLimit}টি কোর্স নির্বাচন করতে পারবেন। বর্তমানে ${existingCourseIds.length}টি নির্বাচিত আছে।`,
          data: {
            currentLimit: trialCourseLimit,
            currentlySelected: existingCourseIds.length,
            attemptingToAdd: validatedData.courseIds.length,
            totalWouldBe: mergedCourseIds.length,
            alreadySelectedCourses: existingCourseIds,
          },
        },
        { status: 409 }
      );
    }

    const newCourseIds = validatedData.courseIds.filter(
      (id) => !existingCourseIds.includes(id)
    );

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

    const now = new Date();
    if (subscription.trialEndsAt && subscription.trialEndsAt < now) {
      return NextResponse.json(
        { success: false, message: "ট্রায়াল পিরিয়ড শেষ হয়ে গেছে" },
        { status: 400 }
      );
    }

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
          trialCourseLimit - updatedSubscription.trialSelectedCourseIds.length,
      },
    });
  } catch (error: any) {
    console.error("Trial courses update error:", error);

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
