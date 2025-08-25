// @ts-nocheck
import { db } from "@/lib/db";

// Utility function to update course purchase count - no need
export const updateCoursePurchaseCount = async (studentProfileId: string) => {
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        studentProfileId,
      },
    });

    if (!subscription) {
      throw new Error("Subscription not found for the student");
    }

    // Increment the coursePurchaseCount by 1
    const updatedSubscription = await db.subscription.update({
      where: {
        id: subscription.id, // Use the subscription ID to update
      },
      data: {
        coursePurchaseCount: {
          increment: 1,
        },
      },
    });

    return updatedSubscription;
  } catch (error) {
    console.error("Error updating course purchase count:", error);
    throw error;
  }
};

/**
 * Utility function to calculate and update TeacherBalance for a specific teacher.
 * @param teacherProfileId - The ID of the teacher profile.
 */
export async function updateTeacherBalance(teacherProfileId: string) {
  try {
    if (!teacherProfileId) {
      throw new Error("teacherProfileId is required");
    }

    // Fetch all revenues for the specific teacher
    const revenues = await db.teacherRevenue.findMany({
      where: { teacherProfileId },
    });

    // Fetch all payments for the specific teacher
    const payments = await db.teacherPayments.findMany({
      where: { teacherProfileId },
    });

    // Create a map to store the total earned and total paid for each month and year
    const balanceMap = new Map<
      string,
      { totalEarned: number; totalPaid: number }
    >();

    // Calculate total earned for each month and year
    revenues.forEach((revenue) => {
      const key = `${revenue.year}-${revenue.month}`;
      const current = balanceMap.get(key) || { totalEarned: 0, totalPaid: 0 };
      current.totalEarned +=
        typeof revenue.amount === "string"
          ? parseFloat(revenue.amount)
          : revenue.amount;
      balanceMap.set(key, current);
    });

    // Calculate total paid for each month and year
    payments.forEach((payment) => {
      const key = `${payment.year_paid_for}-${payment.month_paid_for}`;
      const current = balanceMap.get(key) || { totalEarned: 0, totalPaid: 0 };
      current.totalPaid +=
        typeof payment.amount_paid === "string"
          ? parseFloat(payment.amount_paid)
          : payment.amount_paid;
      balanceMap.set(key, current);
    });

    // Sort the keys (year-month) in ascending order to process them sequentially
    const sortedKeys = Array.from(balanceMap.keys()).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });

    let previousBalanceRemaining = 0;

    // Update or create TeacherBalance records
    for (const key of sortedKeys) {
      const [year, month] = key.split("-").map(Number);
      const balance = balanceMap.get(key);

      if (!balance) continue;

      // Calculate the current balance remaining including the previous month's balance
      const currentBalanceRemaining =
        balance.totalEarned - balance.totalPaid + previousBalanceRemaining;

      // Check if a TeacherBalance record already exists for this teacher, year, and month
      const existingBalance = await db.teacherBalance.findFirst({
        where: {
          teacherProfileId,
          year,
          month,
        },
      });

      if (existingBalance) {
        // Update the existing record
        await db.teacherBalance.update({
          where: { id: existingBalance.id },
          data: {
            total_earned: balance.totalEarned,
            total_paid: balance.totalPaid,
            balance_remaining: currentBalanceRemaining,
          },
        });
      } else {
        // Create a new record
        await db.teacherBalance.create({
          data: {
            teacherProfileId,
            year,
            month,
            total_earned: balance.totalEarned,
            total_paid: balance.totalPaid,
            balance_remaining: currentBalanceRemaining,
          },
        });
      }

      // Update the previousBalanceRemaining for the next iteration
      previousBalanceRemaining = currentBalanceRemaining;
    }

    console.log("Teacher balance updated successfully");
  } catch (error) {
    console.error("Error updating teacher balance:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

/**
 * Updates or creates a monthly earnings record for a teacher based on the current month and year.
 *
 * @param {string} teacherProfileId - The ID of the teacher's profile.
 * @param {number} teacherRevenue - The revenue to be added to the teacher's earnings.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function updateTeacherMonthlyEarnings(
  teacherProfileId: string,
  teacherRevenue: number
): Promise<void> {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    const existingMonthlyEarning = await db.teacherMonthlyEarnings.findFirst({
      where: {
        teacherProfileId,
        month: currentMonth,
        year: currentYear,
      },
    });

    if (existingMonthlyEarning) {
      await db.teacherMonthlyEarnings.update({
        where: { id: existingMonthlyEarning.id },
        data: {
          total_earned: {
            increment: teacherRevenue,
          },
        },
      });
    } else {
      await db.teacherMonthlyEarnings.create({
        data: {
          teacherProfileId,
          month: currentMonth,
          year: currentYear,
          total_earned: teacherRevenue,
        },
      });
    }
  } catch (error) {
    console.error("Error updating teacher monthly earnings:", error);
    throw new Error("Failed to update teacher monthly earnings");
  }
}


/**
 * Enrolls a student into a course, updates the teacher's sales count,
 * and adjusts their rank based on total sales.
 *
 * @param {any} course - The course object with enrolled students.
 * @param {string} studentProfileId - The ID of the student's profile.
 * @param {string} teacherProfileId - The ID of the teacher's profile.
 * @param {any[]} ranks - Array of available rank objects to determine teacher's new rank.
 * @returns {Promise<void>} A promise that resolves when enrollment and updates are complete.
 */
export async function enrollStudentToTheCourse(
  course: any,
  studentProfileId: string,
  teacherProfileId: string,
  ranks: any[]
): Promise<void> {
  try {
    const isUserEnrolled =
      Array.isArray(course?.enrolledStudents) &&
      course?.enrolledStudents?.find(
        (enrollment) => enrollment.studentProfileId === studentProfileId
      );

    if (!isUserEnrolled) {
      await db.enrolledStudents.create({
        data: {
          courseId: course?.id,
          studentProfileId: studentProfileId,
        },
      });

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

      const teacherProfile = await db.teacherProfile.findUnique({
        where: {
          id: teacherProfileId,
        },
        select: { totalSales: true },
      });

      const teachersTotalSales = teacherProfile ? teacherProfile.totalSales : 0;

      let newRankId;

      if (teachersTotalSales === 0) {
        newRankId = ranks[0].id;
      } else {
        for (const rank of ranks) {
          if (rank.numberOfSales <= teachersTotalSales) {
            newRankId = rank.id;
          }
        }
      }

      await db.teacherProfile.update({
        where: {
          id: teacherProfileId,
        },
        data: {
          teacherRankId: newRankId,
        },
      });
    }
  } catch (error) {
    console.error("Error enrolling student to the course:", error);
    throw new Error("Failed to enroll student to the course");
  }
}