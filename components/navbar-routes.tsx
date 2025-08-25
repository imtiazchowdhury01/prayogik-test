// @ts-nocheck

"use client";

import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SearchInput } from "./search-input";
import UserProfileMenus from "./userProfileMenus";
import { useEffect, useState } from "react";
import { isTeacher } from "@/lib/teacher";
import useRedirect from "@/hooks/useRedirect";
import { fetchUserProfile } from "@/services/user";

export const dynamic = "force-dynamic";

export const NavbarRoutes = ({ session, status }) => {
  const userId = session?.user?.id;
  const [userRole, setUserRole] = useState(
    session?.user?.role ? session?.user?.role : "STUDENT"
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifiedTeacher, setIsVerifiedTeacher] = useState(false);
  const [teacherLoading, setTeacherLoading] = useState(false);

  // Separate loading states for different role transitions
  const [adminSwitchLoading, setAdminSwitchLoading] = useState(false);
  const [teacherSwitchLoading, setTeacherSwitchLoading] = useState(false);
  const [studentSwitchLoading, setStudentSwitchLoading] = useState(false);

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";
  const isAdminPage = pathname?.includes("/admin");
  const router = useRouter();
  const { loading, redirect } = useRedirect();

  const handleSwitchRole = async (newRole) => {
    // Set the appropriate loading state based on the role
    if (newRole === "ADMIN") {
      setAdminSwitchLoading(true);
    } else if (newRole === "TEACHER") {
      setTeacherSwitchLoading(true);
    } else if (newRole === "STUDENT") {
      setStudentSwitchLoading(true);
    }

    try {
      const response = await fetch("/api/auth/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch role");
      }

      const data = await response.json();
      setUserRole(data.role);

      if (data.role === "TEACHER") {
        router.push("/teacher/courses");
      } else if (data.role === "ADMIN") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Failed to switch role. Please try again.");
    } finally {
      // Reset the appropriate loading state
      if (newRole === "ADMIN") {
        setAdminSwitchLoading(false);
      } else if (newRole === "TEACHER") {
        setTeacherSwitchLoading(false);
      } else if (newRole === "STUDENT") {
        setStudentSwitchLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchUserState = async () => {
      if (!userId) return;
      try {
        setTeacherLoading(true);
        const data = await fetchUserProfile(userId);

        setIsAdmin(data.isAdmin);
        setIsVerifiedTeacher(
          data?.teacherProfile?.teacherStatus === "VERIFIED"
        );
      } catch (error) {
        console.error("Error fetching users state:", error);
      } finally {
        setTeacherLoading(false);
      }
    };

    fetchUserState();
  }, [userId]);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex items-center gap-x-2 ml-auto">
        {isAdmin &&
          (isAdminPage ? (
            <div
              className="cursor-pointer"
              onClick={() => handleSwitchRole("STUDENT")}
              disabled={studentSwitchLoading}
            >
              <Button
                title="Exit Admin mode"
                size="sm"
                variant="outline"
                className="text-nowrap"
              >
                {studentSwitchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Exit</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="cursor-pointer" disabled={adminSwitchLoading}>
              <Button
                title="Switch To Admin"
                size="sm"
                variant="outline"
                className="text-nowrap"
                onClick={() => handleSwitchRole("ADMIN")}
                disabled={adminSwitchLoading}
              >
                {adminSwitchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div>
                    <span className="hidden lg:block">
                      Switch To Admin Mode
                    </span>
                    <span className="lg:hidden">Admin</span>
                  </div>
                )}
              </Button>
            </div>
          ))}

        {!teacherLoading && (
          <>
            {isVerifiedTeacher ? (
              isTeacherPage && userRole === "TEACHER" ? (
                <Button
                  onClick={() => handleSwitchRole("STUDENT")}
                  size="sm"
                  variant="outline"
                  disabled={studentSwitchLoading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {studentSwitchLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Exit"
                  )}
                </Button>
              ) : (
                <div className="cursor-pointer" disabled={teacherSwitchLoading}>
                  <Button
                    title="Switch To Teacher"
                    size="sm"
                    variant="outline"
                    className="text-nowrap"
                    onClick={() => handleSwitchRole("TEACHER")}
                    disabled={teacherSwitchLoading}
                  >
                    {teacherSwitchLoading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <div>
                        <span className="hidden lg:block">
                          Switch To Teacher Mode
                        </span>
                        <span className="lg:hidden">Teacher</span>
                      </div>
                    )}
                  </Button>
                </div>
              )
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => router.push("/apply-for-teaching")}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="text-nowrap"
                  data-testid="apply-teaching-button"
                >
                  Apply for Teaching
                </Button>
              </div>
            )}
          </>
        )}

        <UserProfileMenus session={session} />
      </div>
    </>
  );
};
