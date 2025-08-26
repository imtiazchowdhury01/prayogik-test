// Create this file: app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getCategoriesDBCall,
  getCategoryCoursesDBCall,
  getCategoryCoursesCountDBCall,
} from "@/lib/data-access-layer/categories";
import { getPrimeCoursesDBCall, getPrimeCoursesByCategoryDBCall, getCoursesDbCall } from "@/lib/data-access-layer/course";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const type = searchParams.get('type'); // 'category', 'filter', 'category-filter'
  const categorySlug = searchParams.get('categorySlug');
  const filter = searchParams.get('filter');

  try {
    let courses: any[] = [];

    if (type === 'category' && categorySlug) {
      // Category page pagination
      courses = await getCategoryCoursesDBCall(categorySlug, page);
    } else if (type === 'filter' && filter) {
      // Filter page pagination
      switch (filter) {
        case "recent":
          const recentCoursesResponse = await getCoursesDbCall({
            page: page,
            limit: page === 1 ? 24 : 6,
            sort: "desc",
          });
          courses = recentCoursesResponse?.courses ?? [];
          break;

        case "older":
          const olderCoursesResponse = await getCoursesDbCall({
            page: page,
            limit: page === 1 ? 24 : 6,
            sort: "asc",
          });
          courses = olderCoursesResponse?.courses ?? [];
          break;

        case "prime":
          courses = await getPrimeCoursesDBCall(page);
          break;

        default:
          courses = [];
      }
    } else if (type === 'category-filter' && categorySlug && filter) {
      // Category-filter page pagination
      switch (filter) {
        case "recent":
          const recentCourses = await getCategoryCoursesDBCall(categorySlug, page);
          courses = recentCourses.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
          
        case "older":
          const olderCourses = await getCategoryCoursesDBCall(categorySlug, page);
          courses = olderCourses.sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
          
        case "prime":
          courses = await getPrimeCoursesByCategoryDBCall(categorySlug, page);
          break;
          
        default:
          courses = [];
      }
    }

    // Check if there are more courses available
    const hasMore = courses.length === (page === 1 ? 24 : 6);

    return NextResponse.json({
      courses,
      hasMore,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}