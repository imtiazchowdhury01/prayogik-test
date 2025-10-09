"use server";
// ============================================
// Utility Function

import { db } from "../db";

//==============================================
export async function updateCertificationCoursesBatch(
  certificationId: string,
  newCourseIds: string[],
  currentCourseIds: string[] = []
) {
  const coursesToAdd = newCourseIds.filter(
    (id) => !currentCourseIds.includes(id)
  );
  const coursesToRemove = currentCourseIds.filter(
    (id) => !newCourseIds.includes(id)
  );

  await db.$transaction(async (tx) => {
    // Handle removals - remove certificationId from courses that should no longer have it
    if (coursesToRemove.length > 0) {
      const coursesToUpdate = await tx.course.findMany({
        where: {
          id: { in: coursesToRemove },
          certificationIds: { has: certificationId },
        },
        select: { id: true, certificationIds: true },
      });

      for (const course of coursesToUpdate) {
        await tx.course.update({
          where: { id: course.id },
          data: {
            certificationIds: {
              set: course.certificationIds.filter(
                (id) => id !== certificationId
              ),
            },
          },
        });
      }
    }

    // Handle additions - add certificationId to newly selected courses
    if (coursesToAdd.length > 0) {
      // First, get all courses that need to be updated
      const coursesToUpdate = await tx.course.findMany({
        where: {
          id: { in: coursesToAdd },
        },
        select: { id: true, certificationIds: true },
      });

      for (const course of coursesToUpdate) {
        // Check if certificationIds exists and doesn't already contain the certificationId
        const currentCertificationIds = course.certificationIds || [];

        if (!currentCertificationIds.includes(certificationId)) {
          await tx.course.update({
            where: { id: course.id },
            data: {
              certificationIds: {
                set: [...currentCertificationIds, certificationId],
              },
            },
          });
        }
      }
    }
  });
}

export async function updateCourseCertificationsBatch(
  courseId: string,
  newCertificationIds: string[],
  currentCertificationIds: string[] = []
) {
  const certificationsToAdd = newCertificationIds.filter(
    (id) => !currentCertificationIds.includes(id)
  );
  const certificationsToRemove = currentCertificationIds.filter(
    (id) => !newCertificationIds.includes(id)
  );

  await db.$transaction(async (tx) => {
    // Handle removals
    if (certificationsToRemove.length > 0) {
      const certificationsToUpdate = await tx.certification.findMany({
        where: {
          id: { in: certificationsToRemove },
          courseIds: { has: courseId },
        },
        select: { id: true, courseIds: true },
      });

      for (const cert of certificationsToUpdate) {
        await tx.certification.update({
          where: { id: cert.id },
          data: {
            courseIds: {
              set: cert.courseIds.filter((id) => id !== courseId),
            },
          },
        });
      }
    }

    // Handle additions
    if (certificationsToAdd.length > 0) {
      const certificationsToUpdate = await tx.certification.findMany({
        where: {
          id: { in: certificationsToAdd },
          NOT: { courseIds: { has: courseId } },
        },
        select: { id: true, courseIds: true },
      });

      for (const cert of certificationsToUpdate) {
        await tx.certification.update({
          where: { id: cert.id },
          data: {
            courseIds: {
              set: [...cert.courseIds, courseId],
            },
          },
        });
      }
    }
  });
}
