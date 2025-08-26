import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
// For server actions
import TeacherForm from "./_components/teacher-form";
import { Urls } from "@/constants/urls";
import { fetchCategories } from "@/services";
import { getRanks } from "@/services/teacher";

// Fetch teacher details server-side
async function getTeacherDetails(teacherId: string) {
  try {
    const response = await fetch(Urls.admin.teacherById(teacherId), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch teacher details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    throw error;
  }
}

export default async function TeacherDetail({ params }: any) {
  const teacherId = params.teacherId;

  // Fetch data server-side
  const [teacherData, categories, ranks] = await Promise.all([
    getTeacherDetails(teacherId),
    fetchCategories(),
    getRanks(),
  ]);

  return (
    <div className="w-full">
      <Link
        href={`/admin/teachers`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to teachers
      </Link>
      <h4 className="text-lg font-semibold mb-5">
        Details of <span>{teacherData?.name}</span>
      </h4>

      <Card className="w-full md:w-full">
        <CardHeader />
        <CardContent>
          <TeacherForm
            teacherId={teacherId}
            initialData={teacherData}
            ranks={ranks}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
