import { db } from "@/lib/db"; // Adjust import based on your setup

export async function fetchCourseTitle(slug: string): Promise<string> {
  try {
    const course = await db.course.findUnique({
      where: { slug },
      select: { title: true }, // Only fetch title for breadcrumb
    });

    return course?.title || "Course";
  } catch (error) {
    console.error("Error fetching course title:", error);
    return "Course";
  }
}
