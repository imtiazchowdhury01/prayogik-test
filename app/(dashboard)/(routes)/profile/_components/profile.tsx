// @ts-nocheck
import { getServerSession } from "next-auth/next";
import { fetchUserProfile } from "@/services/user";
import { fetchCategories } from "@/services";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileFormWrapper from "./profile-form-wrapper";
import { Suspense } from "react";
import ProfileSkeleton from "./profile-skeleton";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin"); // Redirect if not authenticated
  }

  const userId = session.user.id;
  // Fetch data on server side
  const [profileData, categoriesData] = await Promise.all([
    fetchUserProfile(userId),
    fetchCategories(),
  ]);

  return (
    <ProfileFormWrapper
      initialProfileData={profileData}
      initialCategories={categoriesData}
      userId={userId}
    />
  );
}
