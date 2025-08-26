// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { cookies } from "next/headers";
import { Urls } from "@/constants/urls";
import { getCoursesByAdmin } from "@/services/admin";
import { fetchCategories } from "@/services";
import { clientApi } from "@/lib/utils/openai/client";

// Server component
const CoursesList = async ({ searchParams }) => {
  let data = [];

  const [{ body: response }, { body: categories }, authors]: any =
    await Promise.all([
      clientApi.getCoursesByAdminQuery({
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
      clientApi.getCategories(),
      db.user.findMany({
        where: {
          teacherProfile: {
            isNot: null,
          },
        },
      }),
    ]);

  data = convertData(response?.courses);

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable
        data={data}
        columns={columns}
        categories={categories || []}
        authors={authors || []}
        pagination={response?.pagination}
      />
    </div>
  );
};

const convertData = (data) => {
  return data?.map((item) => ({
    id: item.id,
    title: item?.title,
    category: item?.category ? item?.category?.name : "N/A",
    price: item?.prices.length > 0 ? item?.prices[0]?.regularAmount : 0,
    discountPrice:
      item?.prices.length > 0 ? item.prices[0]?.discountedAmount : 0,
    enrolledStudents: item?.enrolledStudents
      ? item?.enrolledStudents.length
      : 0,
    isPublished: item?.isPublished,
    isUnderSubscription: item.isUnderSubscription,
    author: item?.teacherProfile?.user?.name || "N/A",
    authorId: item?.teacherProfile?.user?.id || "N/A",
  }));
};

export default CoursesList;
