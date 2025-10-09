export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  totalDuration?: number;
  courseType: string;
  courseMode: string;
  category?: {
    name: string;
    slug: string;
  };
  teacherProfile: {
    user: {
      name: string;
      email: string;
    };
  };
  prices: Array<{
    regularAmount: number;
    discountedAmount?: number;
    isFree: boolean;
  }>;
  _count: {
    lessons: number;
    enrolledStudents: number;
  };
  isPurchased?: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RegularCoursesResponse {
  courses: Course[];
  pagination: Pagination;
}

export interface SearchApiResponse {
  success: boolean;
  data: {
    courses: Course[];
    pagination: Pagination;
    searchType: string;
  };
}
