import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  const token = req.auth?.user;
  const path = req.nextUrl.pathname;

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!token.emailVerified) {
      return NextResponse.redirect(
        new URL("/login?error=unverified_email", req.url),
      );
    }
    if (!token.onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  // ── Dashboard / KYC routes ────────────────────────────────────────────────
  if (path.startsWith("/dashboard") || path.startsWith("/kyc")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!token.emailVerified) {
      return NextResponse.redirect(
        new URL("/login?error=unverified_email", req.url),
      );
    }
    if (!token.onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }

  // ── Onboarding — must be authenticated ───────────────────────────────────
  if (path.startsWith("/onboarding")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!token.emailVerified) {
      return NextResponse.redirect(
        new URL("/login?error=unverified_email", req.url),
      );
    }
    return NextResponse.next();
  }

  // ── Home page — redirect authenticated + complete users ──────────────────
  if (path === "/" && token) {
    if (!token.emailVerified) {
      return NextResponse.redirect(
        new URL("/login?error=unverified_email", req.url),
      );
    }
    if (!token.onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/kyc",
    "/kyc/:path*",
    "/admin/:path*",
    "/onboarding",
  ],
};
