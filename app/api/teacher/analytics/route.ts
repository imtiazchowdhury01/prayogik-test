// import { db } from "@/lib/db";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { userId } = await getServerUserSession();

//   if (!userId) {
//     return NextResponse.json(
//       { error: true, message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   try {
//     const teacherProfile = await db.teacherProfile.findUnique({
//       where: { userId },
//     });

//     if (!teacherProfile) {
//       return NextResponse.json(
//         { error: true, message: "Teacher profile not found" },
//         { status: 404 }
//       );
//     }

//     const teacherProfileId = teacherProfile.id;

//     // Fetch all courses along with enrolled students
//     const courses = await db.course.findMany({
//       where: { teacherProfileId },
//       include: {
//         enrolledStudents: true,
//       },
//     });

//     // Fetch all revenue records at once
//     const teacherRevenueData = await db.teacherRevenue.findMany({
//       where: { teacherProfileId },
//       include: {
//         purchase: true, // Needed to link revenue to specific course
//       },
//     });

//     // Calculate total revenue
//     const totalRevenue = teacherRevenueData.reduce(
//       (acc, revenue) => acc + revenue.amount,
//       0
//     );

//     // Calculate total sales count
//     const totalSalesCount = courses.reduce(
//       (total, course) => total + (course.enrolledStudents.length || 0),
//       0
//     );

//     // Map course-level sales and revenue using in-memory filtering
//     const courseSales = courses.map((course) => {
//       const revenueForCourse = teacherRevenueData
//         .filter((revenue) => revenue.purchase?.courseId === course.id)
//         .reduce((sum, revenue) => sum + revenue.amount, 0);

//       return {
//         name: course.title,
//         total: revenueForCourse,
//       };
//     });

//     return NextResponse.json({
//       totalRevenue,
//       totalSalesCount,
//       courseSales,
//     });
//   } catch (error) {
//     console.error("Error fetching teacher analytics:", error);
//     return NextResponse.json(
//       { error: true, message: "Failed to fetch analytics." },
//       { status: 500 }
//     );
//   }
// }


import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { error: true, message: "Teacher profile not found" },
        { status: 404 }
      );
    }

    const teacherProfileId = teacherProfile.id;

    const courses = await db.course.findMany({
      where: { teacherProfileId },
      include: {
        enrolledStudents: true,
      },
    });

    // Fetch revenue records without include first
    const allRevenueRecords = await db.teacherRevenue.findMany({
      where: { teacherProfileId },
    });

    // Get all unique purchaseIds
    const purchaseIds = allRevenueRecords
      .map(revenue => revenue.purchaseId)
      .filter((id): id is string => id !== null && id !== undefined);

    // Fetch all related purchases in one query
    const purchases = await db.purchase.findMany({
      where: {
        id: { in: purchaseIds }
      },
      select: {
        id: true,
        courseId: true,
      }
    });

    // Create a map for quick lookup
    const purchaseMap = new Map(
      purchases.map(p => [p.id, p])
    );

    // Combine revenue with purchase data
    const validRevenueData = allRevenueRecords
      .map(revenue => ({
        ...revenue,
        purchase: purchaseMap.get(revenue.purchaseId)
      }))
      .filter(revenue => revenue.purchase !== undefined);



    // Calculate total revenue
    const totalRevenue = validRevenueData.reduce(
      (acc, revenue) => acc + revenue.amount,
      0
    );

    const totalSalesCount = courses.reduce(
      (total, course) => total + (course.enrolledStudents.length || 0),
      0
    );

    // Map course-level sales and revenue
    const courseSales = courses.map((course) => {
      const revenueForCourse = validRevenueData
        .filter((revenue) => revenue.purchase?.courseId === course.id)
        .reduce((sum, revenue) => sum + revenue.amount, 0);

      return {
        name: course.title,
        total: revenueForCourse,
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalSalesCount,
      courseSales,
    });
  } catch (error) {
    console.error("Error fetching teacher analytics:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}