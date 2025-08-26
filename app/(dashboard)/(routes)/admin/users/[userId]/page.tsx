import { notFound } from "next/navigation";
import Link from "next/link";
import UserDetailForm from "./_components/UserDetailForm";
import { ArrowLeft } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Urls } from "@/constants/urls";
import { fetchCategories } from "@/services";
import { getRanks } from "@/services/teacher";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { clientApi } from "@/lib/utils/openai/client";

async function getUser(userId: string) {
  try {
    const response = await fetch(`${Urls.admin.users}/${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function getCourses(teacherProfileId: string) {
  try {
    const response = await db.course.findMany({
      where: {
        teacherProfile: {
          id: {
            not: teacherProfileId,
          },
        },
        isPublished: true,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default async function UserDetail({ params }: { params: any }) {
  const userId = params.userId;

  // Fetch data in parallel for better performance
  const [userData, categories, ranks] = await Promise.all([
    getUser(userId),
    fetchCategories(),
    getRanks(),
  ]);

  if (!userData) {
    notFound();
  }

  // Get courses with the teacher profile filtered out
  const courses = await getCourses(userData?.teacherProfile?.id);

  // subscription list
  const { body: subscriptionList } = await clientApi.getAllSubscriptionPlans({
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });
  return (
    <div className="w-full">
      <Link
        href="/admin/users"
        className="flex items-center text-sm hover:opacity-70 transition mb-6 w-fit"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to users
      </Link>
      <div className="w-full">
        <CardContent>
          <p className="text-sm text-gray-700">
            প্রোফাইল: {userData?.name}({userData?.email})
          </p>
          <UserDetailForm
            initialData={userData}
            categories={categories}
            courses={courses}
            ranks={ranks}
            userId={userId}
            subscriptionList={subscriptionList}
          />
        </CardContent>
      </div>
    </div>
  );
}
