import { db } from "../db";

async function getTeachersDBCall(limit?: number) {
  try {
    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: "VERIFIED",
        },
      },
      take: limit ? limit : undefined,
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        emailVerified: true,
        role: true,
        bio: true,
        dateOfBirth: true,
        gender: true,
        education: true,
        nationality: true,
        phoneNumber: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        accountStatus: true,

        facebook: true,
        linkedin: true,
        twitter: true,
        youtube: true,
        website: true,
        others: true,

        teacherProfile: {
          include: {
            createdCourses: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc", // Consistent ordering
      },
    });

    return teachers;
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    return [];
  }
}

async function getTeacherCreatedCourseDBCall(username: string) {
  const courses = await db.course.findMany({
    where: {
      teacherProfile: {
        user: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
      },
      isPublished: true,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      totalDuration: true,
      isUnderSubscription: true,
      lessons: {
        where: {
          isFree: true,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          position: true,
          videoUrl: true,
          videoStatus: true,
          isFree: true,
          isPublished: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          lessons: {
            where: { isPublished: true },
          },
          enrolledStudents: true,
        },
      },
      teacherProfile: {
        select: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
      imageUrl: true,
      prices: true,
    },
  });

  return courses;
}

async function getTeacherDetailsWithPublishedCourseDBCall(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      name: true,
      bio: true,
      avatarUrl: true,
      username: true,
      accountStatus: true,
      facebook: true,
      twitter: true,
      linkedin: true,
      youtube: true,
      website: true,
      teacherProfile: {
        select: {
          teacherStatus: true,
          yearsOfExperience: true,
          subjectSpecializations: true,
          createdCourses: {
            select: {
              id: true,
              title: true,
              slug: true,
              imageUrl: true,
              isPublished: true,
              prices: {
                select: {
                  regularAmount: true,
                  isFree: true,
                },
              },
              isUnderSubscription: true,
              _count: {
                select: {
                  enrolledStudents: true,
                },
              },
              lessons: {
                where: {
                  isPublished: true,
                },
                select: {
                  id: true,
                  title: true,
                  videoUrl: true,
                  isFree: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (
    !user ||
    !user.teacherProfile ||
    user.teacherProfile.teacherStatus !== "VERIFIED"
  ) {
    return null;
  }

  return user;
}

export {
  getTeachersDBCall,
  getTeacherCreatedCourseDBCall,
  getTeacherDetailsWithPublishedCourseDBCall,
};
