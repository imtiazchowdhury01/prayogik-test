// @ts-nocheck
import { getServerSession } from "next-auth/next";
import { fetchUserProfile } from "@/services/user";
import { fetchCategories } from "@/services";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileFormWrapper from "./_components/profile-form-wrapper";

export default async function ProfilePage() {
  // Get session on server side
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login"); // Redirect if not authenticated
  }

  const userId = session.user.id;
  // Fetch data on server side
  const [profileData, categoriesData] = await Promise.all([
    fetchUserProfile(userId),
    fetchCategories(),
  ]);

  // Pass data to client component
  return (
    <ProfileFormWrapper
      initialProfileData={profileData}
      initialCategories={categoriesData}
      userId={userId}
    />
  );
}
