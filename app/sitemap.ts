import { MetadataRoute } from "next";
import { db } from "@/lib/db";

// Define interfaces based on your Prisma models
// interface Teacher {
//   id: string;
//   user: {
//     username: string;
//   };
//   updatedAt?: Date | null; // allow null from Prisma
// }

interface Course {
  id: string;
  slug: string;
  isPublished: boolean;
  updatedAt?: Date | null; // allow null from Prisma
}

interface Event {
  id: string;
  slug: string;
  isPublished: boolean;
  updatedAt?: Date | null; // allow null from Prisma
}

interface Category {
  id: string;
  slug: string;
  updatedAt?: Date | null; // allow null from Prisma
}

// Fetch all verified teachers with published courses
// async function getAllTeachers(): Promise<Teacher[]> {
//   try {
//     const teachers = await db.teacherProfile.findMany({
//       select: {
//         id: true,
//         user: {
//           select: {
//             username: true,
//           },
//         },
//         updatedAt: true,
//       },
//       where: {
//         teacherStatus: "VERIFIED",
//         createdCourses: {
//           some: {
//             isPublished: true,
//           },
//         },
//       },
//     });

//     return teachers;
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     return [];
//   }
// }

// Fetch all published courses
async function getAllCourses(): Promise<Course[]> {
  try {
    const courses = await db.course.findMany({
      select: {
        id: true,
        slug: true,
        isPublished: true,
        updatedAt: true,
      },
      where: {
        isPublished: true,
      },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Fetch all published events
async function getAllEvents(): Promise<Event[]> {
  try {
    const events = await db.event.findMany({
      select: {
        id: true,
        slug: true,
        isPublished: true,
        updatedAt: true,
      },
      where: {
        isPublished: true,
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Fetch categories for additional SEO coverage
async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      where: {
        courses: {
          some: {
            isPublished: true,
          },
        },
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // Static pages with their priorities and change frequencies
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/become-a-teacher`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/course-ideas`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/course-roadmap`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/prime`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/submit-course-proposal`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/live`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
    ];

    // Fetch dynamic content
    // const [teachers, courses, events, categories] = await Promise.all([
    const [courses, events, categories] = await Promise.all([
      //   getAllTeachers(),
      getAllCourses(),
      getAllEvents(),
      getAllCategories(),
    ]);

    // Generate teacher URLs (using username)
    // const teacherUrls = teachers.map((teacher) => ({
    //   url: `${baseUrl}/teachers/${teacher.user.username}`,
    //   lastModified: teacher.updatedAt || new Date(),
    //   changeFrequency: "weekly" as const,
    //   priority: 0.8,
    // }));

    // Generate course URLs
    const courseUrls = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    // Generate event URLs
    const eventUrls = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // Generate category URLs (additional SEO benefit)
    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/courses/category/${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Add main category/listing pages
    const categoryPages = [
      {
        url: `${baseUrl}/teachers`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];

    // Combine all URLs
    const allUrls: MetadataRoute.Sitemap = [
      ...staticPages,
      ...categoryPages,
      //   ...teacherUrls,
      ...courseUrls,
      ...eventUrls,
      ...categoryUrls,
    ];

    console.log(`Generated sitemap with ${allUrls.length} URLs`);
    return allUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return at least static pages if dynamic content fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/become-a-teacher`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/course-ideas`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/course-roadmap`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/prime`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/submit-course-proposal`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/live`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/teachers`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];
  }
}
