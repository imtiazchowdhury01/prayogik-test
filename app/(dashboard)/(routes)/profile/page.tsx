// @ts-nocheck
import { getServerSession } from "next-auth/next";
import { fetchUserProfile } from "@/services/user";
import { fetchCategories } from "@/services";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileFormWrapper from "./_components/profile-form-wrapper";
import { Suspense } from "react";
import ProfileSkeleton from "./_components/profile-skeleton";
import Profile from "./_components/profile";

export default async function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile />
    </Suspense>
  );
}
