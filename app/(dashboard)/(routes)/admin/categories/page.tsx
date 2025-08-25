// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { fetchCategories } from "@/services";

// Server component
const Categories = async () => {
  let data = [];

  try {
    const response = await fetchCategories();
    data = convertData(response);
  } catch (err) {
    console.error("Failed to fetch teachers details:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} categories={data} />
    </div>
  );
};

const convertData = (data) => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    courses: item?._count?.courses || 0,
    parentCategoryId: item.parentCategoryId,
    isChild: item.isChild,
    categories: data,
  }));
};

export default Categories;
