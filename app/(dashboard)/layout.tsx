// @ts-nocheck
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import Loading from "./stoploading";
import TopProgressProvider from "@/components/providers/progress-provider";
import NextNProgress from "nextjs-progressbar";
import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";
import ProgressProvider from "@/components/providers/progressbar-provider";
import NextTopLoader from "nextjs-toploader";
import { Banner } from "@/components/banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status, router]);

  // Handle session loading
  if (status === "loading") {
    return <Loading />;
  }

  // Safely handle session and avoid accessing undefined session properties
  if (status === "authenticated" && session) {
    return (
      <div className="h-full">
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <Navbar session={session} status={status} />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-56 pt-[80px] h-full">
          <div className="w-full p-4 md:p-12">
            {session?.user?.info?.teacherProfile?.teacherStatus ===
              "PENDING" && (
              <div className="pb-6">
                <Banner label="Your teaching application is pending for admin approval!" />
              </div>
            )}
            <NextTopLoader showSpinner={false} color="#0F9886" />
            <>{children}</>
          </div>
        </main>
      </div>
    );
  }

  // Redirecting state or handling undefined session
  return <div className="text-center py-16">Redirecting to login...</div>;
}
