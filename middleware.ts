// middleware.ts
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

    // Set pathname to headers
    requestHeaders.set("x-pathname", path);

    if (path === "/signup") {
      const referralCode = req.nextUrl.searchParams.get("ref");

      if (!referralCode) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      try {
        // Make API call to validate referral code
        const response = await fetch(
          `${req.nextUrl.origin}/api/referrals/validate?code=${referralCode}`
        );
        const data = await response.json();

        if (!data.valid) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
      } catch (error) {
        console.error("Error validating referral code:", error);
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // All protected routes require authentication
    if (!user) {
      const redirectUrl = encodeURIComponent(path);
      return NextResponse.redirect(
        new URL(`/signin?redirect=${redirectUrl}`, req.url)
      );
    }

    // Check if account is active
    if (user?.accountStatus !== "ACTIVE") {
      return NextResponse.redirect(
        new URL(
          `/signin?error=${encodeURIComponent(
            "Your account is not active. Please contact support."
          )}`,
          req.url
        )
      );
    }

    // Teacher route protection - Check for VERIFIED teacher status
    if (path.startsWith("/teacher")) {
      const teacherStatus = user?.info?.teacherProfile?.teacherStatus;

      if (teacherStatus !== "VERIFIED") {
        return NextResponse.redirect(
          new URL(
            `/dashboard?error=${encodeURIComponent(
              "You need to be a verified teacher to access this page."
            )}`,
            req.url
          )
        );
      }
    }

    // Admin route protection
    if (path.startsWith("/admin")) {
      if (!user?.isAdmin && !user?.isSuperAdmin) {
        return NextResponse.redirect(
          new URL(
            `/dashboard?error=${encodeURIComponent(
              "You do not have permission to access this page."
            )}`,
            req.url
          )
        );
      }
    }

    // Affiliate route protection (if you have affiliate routes)
    if (path.startsWith("/affiliate")) {
      const affiliateStatus = user?.info?.affiliateProfile?.affiliateStatus;

      if (affiliateStatus !== "ACTIVE") {
        return NextResponse.redirect(
          new URL(
            `/dashboard?error=${encodeURIComponent(
              "You need to be an active affiliate to access this page."
            )}`,
            req.url
          )
        );
      }
    }

    // Subscription-based route protection (example)
    if (path.startsWith("/premium")) {
      const currentPlan = user?.currentPlan;
      const subscriptionStatus =
        user?.info?.studentProfile?.subscription?.status;

      if (currentPlan === "NONE" || subscriptionStatus !== "ACTIVE") {
        return NextResponse.redirect(
          new URL(
            `/dashboard?error=${encodeURIComponent(
              "You need an active subscription to access this content."
            )}`,
            req.url
          )
        );
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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
    "/affiliate/:path*",
    "/premium/:path*",
    "/signup",
  ],
};
