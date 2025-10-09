import { db } from "@/lib/db";
import { cache } from "react";

export const getCertificationCoursesDBCall = cache(async () => {
  try {
    const certifications = await db.certification.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        description: true,
        level: true,
        learningOutcomes: true,
        whofor: true,
        imageUrl: true,
        isPublished: true,
        skills: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        courses: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            totalDuration: true,
            courseType: true,
            prices: {
              select: {
                id: true,
                isFree: true,
                regularAmount: true,
                discountedAmount: true,
                discountExpiresOn: true,
                isLifeTime: true,
                duration: true,
                frequency: true,
              },
            },
            teacherProfile: {
              select: {
                user: {
                  select: {
                    name: true,
                    username: true,
                  },
                },
              },
            },
            _count: {
              select: {
                lessons: {
                  where: { isPublished: true },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                username: true,
              },
            },
          },
        },
        coTeachers: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        prices: {
          select: {
            id: true,
            isFree: true,
            regularAmount: true,
            discountedAmount: true,
            discountExpiresOn: true,
            isLifeTime: true,
            duration: true,
            frequency: true,
          },
        },
        _count: {
          select: {
            courses: {
              where: { isPublished: true },
            },
            enrolledStudents: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return certifications || [];
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
});

export async function getCertificationDbCallBySlug(certificationSlug: string) {
  // Fetch certification details with related data
  const certification = await db.certification.findUnique({
    where: {
      slug: certificationSlug,
    },
    include: {
      courses: {
        where: {
          isPublished: true,
        },
        include: {
          lessons: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: "asc",
            },
          },
          attachments: true,
          teacherProfile: {
            select: {
              user: {
                select: {
                  name: true,
                  username: true,
                  avatarUrl: true,
                  bio: true,
                  facebook: true,
                  linkedin: true,
                  website: true,
                  youtube: true,
                  twitter: true,
                },
              },
              yearsOfExperience: true,
              subjectSpecializations: true,
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
        },
      },
      skills: {
        select: {
          id: true,
          name: true,
        },
      },
      teacherProfile: {
        select: {
          user: {
            select: {
              name: true,
              username: true,
              avatarUrl: true,
              bio: true,
              facebook: true,
              linkedin: true,
              website: true,
              youtube: true,
              twitter: true,
            },
          },
          yearsOfExperience: true,
          subjectSpecializations: true,
        },
      },
      coTeachers: {
        select: {
          user: {
            select: {
              name: true,
              username: true,
              avatarUrl: true,
              bio: true,
              facebook: true,
              linkedin: true,
              website: true,
              youtube: true,
              twitter: true,
            },
          },
          yearsOfExperience: true,
          subjectSpecializations: true,
        },
      },
      enrolledStudents: {
        take: 3, // Limit to 3 for display
        orderBy: {
          id: 'desc' // Get most recent enrollments
        },
        include: {
          studentProfile: {
            include: {
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      },
      prices: true,
      _count: {
        select: {
          enrolledStudents: true,
        },
      },
    },
  });

  if (!certification) {
    return null;
  }

  // Calculate total duration of all courses
  const totalCoursesDuration = certification.courses.reduce((total, course) => {
    return total + (course.totalDuration || 0);
  }, 0);

  return {
    ...certification,
    totalCoursesCount: certification.courses.length,
    totalEnrolledStudents: certification._count.enrolledStudents,
    totalCoursesDuration,
  };
}

export async function getCertificationsDBCall() {
  // Fetch your certifications data here
  const certifications = await db.certification.findMany({
    include: {
      skills: true,
      courses: true,
      teacherProfile: true,
      coTeachers: true,
      _count: {
        select: {
          enrolledStudents: true,
          purchases: true,
        },
      },
    },
  });

  return certifications;
}