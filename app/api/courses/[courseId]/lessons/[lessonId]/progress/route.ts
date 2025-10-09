// // @ts-nocheck
// import { useStudentProfile } from "@/hooks/useStudentProfile";
// import { db } from "@/lib/db";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { NextResponse } from "next/server";

// export async function PUT(
//   req: Request,
//   { params }: { params: { courseId: string; lessonId: string } }
// ) {
//   try {
    
//     const { userId } = await getServerUserSession(req);
//     const studentProfileId = await useStudentProfile(userId);



//     const { isCompleted } = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const newIsCompleted = isCompleted;

//     const progress = await db.progress.upsert({
//       where: {
//         studentProfileId_lessonId: {
//           studentProfileId,
//           lessonId: params.lessonId,
//         },
//       },
//       update: {
//         isCompleted: newIsCompleted,
//       },
//       create: {
//         studentProfileId,
//         lessonId: params.lessonId,
//         isCompleted: newIsCompleted,
//       },
//     });

    
//     return NextResponse.json(progress);
//   } catch (error) {
//     console.error("[CHAPTER_ID_PROGRESS]", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get studentProfileId from the database
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        studentProfile: {
          select: {
            id: true,
          },
        },
      },
    });

    const studentProfileId = user?.studentProfile?.id;

    if (!studentProfileId) {
      return new NextResponse("Student profile not found", { status: 400 });
    }

    const { isCompleted } = await req.json();

    const progress = await db.progress.upsert({
      where: {
        studentProfileId_lessonId: {  // Use the name of the unique constraint
          studentProfileId: studentProfileId,
          lessonId: params.lessonId,
        },
      },
      update: {
        isCompleted: isCompleted,
      },
      create: {
        studentProfileId: studentProfileId,
        lessonId: params.lessonId,
        isCompleted: isCompleted,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
