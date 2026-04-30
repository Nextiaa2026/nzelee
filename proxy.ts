import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin")) {
      if (!token?.emailVerified) {
        return NextResponse.redirect(new URL("/login?error=unverified_email", req.url));
      }
      if (!token?.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith("/dashboard") || path.startsWith("/kyc")) {
      if (!token?.emailVerified) {
        return NextResponse.redirect(new URL("/login?error=unverified_email", req.url));
      }
      if (!token?.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith("/onboarding") && token && !token.emailVerified) {
      return NextResponse.redirect(new URL("/login?error=unverified_email", req.url));
    }

    if (path === "/" && token) {
      if (!token.emailVerified) {
        return NextResponse.redirect(new URL("/login?error=unverified_email", req.url));
      }
      if (!token.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/onboarding")) {
          return !!token;
        }
        if (path.startsWith("/admin")) {
          return !!token;
        }
        if (path.startsWith("/dashboard") || path.startsWith("/kyc")) {
          return !!token;
        }
        if (path === "/") {
          return true;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/kyc", "/kyc/:path*", "/admin/:path*", "/onboarding"],
};
