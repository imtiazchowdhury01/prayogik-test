import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req: NextRequest) {
    const user: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const path = req.nextUrl.pathname;
    const requestHeaders = new Headers(req.headers);

    // pathname set to headers
    requestHeaders.set("x-pathname", path);
    // All other protected routes require authentication
    if (!user) {
      // console.log("Redirecting unauthenticated user to signin");
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Teacher route protection
    if (
      path.startsWith("/teacher") &&
      !(user?.info?.teacherProfile?.teacherStatus === "VERIFIED")
    ) {
      // console.log("Redirecting non-teacher from teacher route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin route protection
    if (
      path.startsWith("/admin") &&
      !user?.info?.isAdmin &&
      !user?.info?.isSuperAdmin
    ) {
      // console.log("Redirecting non-admin from admin route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // SuperAdmin Report route protection - Check this BEFORE general admin check
    if (path.startsWith("/admin/manage") && !user?.info?.isSuperAdmin) {
      // console.log("Redirecting non-superadmin from report route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signin",
    },
    callbacks: {
      authorized: () => true, // Bypass default auth handling
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/teacher/:path*",
  ],
};
