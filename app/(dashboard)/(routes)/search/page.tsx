// @ts-nocheck
import { getCourses } from "@/actions/get-courses";
import { CategoryPagination } from "@/app/(course)/courses/category/_components/CategoryPagination";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SearchInput } from "@/components/search-input";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Categories } from "./_components/categories";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { fetchCategories } from "@/services";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    page?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const [{ body: response }, categories]: any = await Promise.all([
    clientApi.getCoursesQuery({
      query: {
        title: searchParams.title,
        category: searchParams.category,
        page: searchParams.page,
        sort: searchParams.sort,
        limit: searchParams.limit || 10,
      },
      extraHeaders: {
        cookie: cookies().toString(),
      },
    }),
    fetchCategories(),
  ]);

  const courses = response?.courses;
  const pagination = response?.pagination;

  return (
    <>
      <div
        className="block px-6 pt-6 md:hidden mb-8 md:mb-0"
        data-testid="search-input-wrapper"
      >
        <SearchInput />
      </div>
      <div className="space-y-6">
        <Categories items={categories} />

        <CategoryPagination
          items={courses?.data}
          searchParams={searchParams}
          courses={courses}
          pagination={pagination}
          userId={userId}
          url="/search"
        />
      </div>
    </>
  );
};

export default SearchPage;
