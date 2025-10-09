import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
// export async function PUT(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     // Get user session to check if the user is authorized
//     const { userId, isAdmin } = await getServerUserSession(req);

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const teacherProfileId = await useTeacherProfile(userId);

//     // Parse the incoming request JSON to extract the list of chapter positions
//     const { list } = await req.json();

//     // Check if the course belongs to the logged-in teacher (i.e., the userId should match the course's teacherId)
//     const ownCourse = await useCourseByTeacherOrCoTeacher(
//       userId,
//       params.courseId
//     );

//     if (!ownCourse && !isAdmin) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Iterate through the list of chapters and update their positions
//     for (const item of list) {
//       await db.lesson.update({
//         where: { id: item.id },
//         data: { position: item.position },
//       });
//     }

//     return new NextResponse("Success", { status: 200 });
//   } catch (error) {
//     console.log("[REORDER]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }



export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    if (!list || !Array.isArray(list) || list.length === 0) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const ownCourse = await useCourseByTeacherOrCoTeacher(
      userId,
      params.courseId
    );

    if (!ownCourse && !isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const startTime = Date.now();

  
    await Promise.all(
      list.map((item) =>
        db.lesson.update({
          where: { id: item.id },
          data: { 
            position: item.position, 
            updatedAt: new Date() 
          },
        })
      )
    );

    const duration = Date.now() - startTime;
    console.log(`[PARALLEL UPDATE] Updated ${list.length} lessons in ${duration}ms`);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[PARALLEL UPDATE ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
