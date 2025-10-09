// app/api/courses/access/free/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  updateTeacherBalance,
  updateTeacherMonthlyEarnings,
  enrollStudentToTheCourse,
} from "@/lib/utils/purchase";
import { checkCourseAccess } from "@/actions/get-course-access";
import { handleTrialPurchase } from "@/lib/utils/checkout/server";
import PurchaseEmailService from "@/lib/utils/checkout/mailer";
import { getOrCreateUser } from "@/services/user";
import type { UserWithProfile } from "@/types/user";
import type { Prisma } from "@prisma/client";

// ========== CONSTANTS ==========

const PURCHASE_TYPE_SINGLE_COURSE = "SINGLE_COURSE" as const;
const TEACHER_REVENUE_FREE_COURSE = 0;

const MESSAGES = {
  MISSING_DATA: "কোর্স আইডি বা ইমেইল অনুপস্থিত",
  COURSE_NOT_FOUND: "ব্যবহারকারী বা কোর্স খুঁজে পাওয়া যায়নি",
  ALREADY_ENROLLED: "আপনার এই কোর্সে ইতিমধ্যেই প্রবেশাধিকার রয়েছে",
  TEACHER_NOT_FOUND:
    "শিক্ষক খুঁজে পাওয়া যায়নি বা কোনো র‍্যাঙ্ক নির্ধারণ করা হয়নি",
  STUDENT_PROFILE_ERROR: "ছাত্র প্রোফাইল খুঁজে পাওয়া যায়নি!",
  ENROLLMENT_SUCCESS: "সফলভাবে কোর্সে তালিকাভুক্ত হয়েছেন",
  GENERAL_ERROR: "কোর্সে বিনামূল্যে প্রবেশে সমস্যা হয়েছে",
} as const;

// ========== TYPE DEFINITIONS ==========

interface CourseAccessRequest {
  courseId: string;
  email: string;
}

interface ApiResponse {
  success?: string;
  error?: string;
}

type CourseWithDetails = Prisma.CourseGetPayload<{
  include: {
    lessons: true;
    enrolledStudents: true;
  };
}>;

type TeacherWithRank = Prisma.TeacherProfileGetPayload<{
  include: {
    teacherRank: true;
  };
}>;

// ========== MAIN HANDLER ==========

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const requestBody: CourseAccessRequest = await req.json();
    const { courseId, email } = requestBody;

    // Input validation
    if (!courseId?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: MESSAGES.MISSING_DATA },
        { status: 400 }
      );
    }

    // Get or create user
    const user = await getOrCreateUser(email);

    // Get course with related data
    const course = await getCourseWithDetails(courseId);
    if (!course) {
      return NextResponse.json(
        { error: MESSAGES.COURSE_NOT_FOUND },
        { status: 404 }
      );
    }

    // Check if user already has access
    const hasAccess = await checkExistingAccess(course.slug, user.id);
    if (hasAccess) {
      return NextResponse.json(
        { error: MESSAGES.ALREADY_ENROLLED },
        { status: 400 }
      );
    }

    // ==============
    // Uncomment this if you are giving the trial access for free
    // ==============
    // await ensureTrialSubscription(user, courseId);

    // Get teacher details with rank
    const teacher = await getTeacherWithRank(course.teacherProfileId);
    if (!teacher) {
      return NextResponse.json(
        { error: MESSAGES.TEACHER_NOT_FOUND },
        { status: 404 }
      );
    }

    // Process free enrollment
    await processFreeEnrollment(user, course, teacher);

    // Send enrollment emails
    const mailer = new PurchaseEmailService();
    await mailer.handlePurchaseEmails(
      {
        email: user.email,
        purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
        subscriptionPlanId: null,
        courseId,
        eventId: null,
      },
      null,
      null,
      user,
      user.isNewUser,
      user.temporaryPassword,
      user.username
    );

    return NextResponse.json(
      { success: MESSAGES.ENROLLMENT_SUCCESS },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FREE_COURSE_ACCESS_ERROR]", error);
    return NextResponse.json(
      { error: MESSAGES.GENERAL_ERROR },
      { status: 500 }
    );
  }
}

// ========== HELPER FUNCTIONS ==========

async function getCourseWithDetails(
  courseId: string
): Promise<CourseWithDetails | null> {
  try {
    return await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { position: "asc" },
        },
        enrolledStudents: true,
      },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

async function checkExistingAccess(
  courseSlug: string,
  userId: string
): Promise<boolean> {
  try {
    const courseAccess = await checkCourseAccess(courseSlug, userId);
    return courseAccess.access;
  } catch (error) {
    console.error("Error checking course access:", error);
    return false;
  }
}

async function ensureTrialSubscription(
  user: UserWithProfile,
  courseId: string
): Promise<void> {
  if (!user.studentProfile?.subscription) {
    if (!user.studentProfile) {
      throw new Error(MESSAGES.STUDENT_PROFILE_ERROR);
    }

    await handleTrialPurchase({}, user.studentProfile);

    const mailer = new PurchaseEmailService();
    await mailer.handlePurchaseEmails(
      {
        email: user.email,
        purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
        subscriptionPlanId: null,
        courseId,
        eventId: null,
      },
      null,
      null,
      user,
      user.isNewUser,
      user.temporaryPassword,
      user.username
    );
  }
}

async function getTeacherWithRank(
  teacherProfileId: string
): Promise<TeacherWithRank | null> {
  try {
    return await db.teacherProfile.findUnique({
      where: { id: teacherProfileId },
      include: { teacherRank: true },
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
}

async function processFreeEnrollment(
  user: UserWithProfile,
  course: CourseWithDetails,
  teacher: TeacherWithRank
): Promise<void> {
  // Get student profile
  const studentProfile = await db.studentProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!studentProfile) {
    throw new Error(MESSAGES.STUDENT_PROFILE_ERROR);
  }

  // Get teacher ranks for enrollment process
  const ranks = await db.teacherRank.findMany({
    orderBy: { numberOfSales: "asc" },
  });

  // Get current date for revenue tracking
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Create purchase record with revenue tracking
  await db.purchase.create({
    data: {
      studentProfileId: studentProfile.id,
      teacherProfileId: course.teacherProfileId,
      courseId: course.id,
      purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
      totalAmountTk: 0,
      creditsUsedTk: 0,
      totalPaidTk: 0,
      remainingAmountTk: 0,
      paymentStatus: "COMPLETED",
      fullyPaidAt: currentDate,
      teacherRevenue: {
        create: {
          teacherProfileId: course.teacherProfileId,
          amount: TEACHER_REVENUE_FREE_COURSE,
          month: currentMonth,
          year: currentYear,
          teacherRankId: teacher.teacherRank?.id,
        },
      },
    },
  });

  // Process enrollment and update teacher data in parallel
  await Promise.all([
    enrollStudentToTheCourse(
      course,
      studentProfile.id,
      course.teacherProfileId,
      ranks
    ),
    updateTeacherMonthlyEarnings(
      course.teacherProfileId,
      TEACHER_REVENUE_FREE_COURSE
    ),
    updateTeacherBalance(course.teacherProfileId),
  ]);
}
