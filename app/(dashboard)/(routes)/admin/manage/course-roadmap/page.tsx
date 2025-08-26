// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { fetchCategories } from "@/services";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";

const AdminCourseRoadmap = async () => {
  let data = [];
  let teachers = [];
  try {
    const response = await clientApi.getCourseRoadmaps({
      extraHeaders: {
        cookie: cookies().toString(),
      },
    });

    data = convertData(response.body.data || []);
    const teacherResponse = await clientApi.getTeacherProfiles({});
    if (teacherResponse.status === 200) {
      teachers = teacherResponse.body;
    }
  } catch (err) {
    console.error("Failed to fetch course roadmap details:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} teachers={teachers} />
    </div>
  );
};

const convertData = (data) => {
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    category: item.category,
    estimatedDuration: item.estimatedDuration,
    targetDate: new Date(item.targetDate).toDateString(),
    difficulty: item.difficulty,
    prerequisites: item.prerequisites,
    courseLink: item.courseLink,
    teacherId: item.teacherId ? item.teacherId : null,
  }));
};

export default AdminCourseRoadmap;
