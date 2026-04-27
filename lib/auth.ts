import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { AppUserRole } from "@/types/app-user";
import { verifyPassword } from "@/lib/security/password";
import { loginSchema } from "@/lib/validations/auth";

/**
 * next-auth/react calls `new URL(data.url)` when `signIn(..., { redirect: false })`.
 * Relative paths throw in the browser — redirect strings from `signIn` must be absolute.
 */
function authAbsoluteUrl(pathnameAndQuery: string): string {
  const path = pathnameAndQuery.startsWith("/")
    ? pathnameAndQuery
    : `/${pathnameAndQuery}`;
  const base = (
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    ""
  ).replace(/\/$/, "");
  if (!base) {
    console.warn(
      "[auth] Set NEXTAUTH_URL (or NEXT_PUBLIC_APP_URL) to your app origin, e.g. http://localhost:3002 — required for email-verification redirects and OAuth callbacks.",
    );
  }
  const origin = base || "http://localhost:3000";
  return `${origin}${path}`;
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email))
          .limit(1);

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.id) {
        const raw = (profile as { email_verified?: boolean } | undefined)
          ?.email_verified;
        const googleVerified = raw !== false;
        if (googleVerified) {
          await db
            .update(users)
            .set({ emailVerified: new Date(), updatedAt: new Date() })
            .where(eq(users.id, user.id));
        }
        return true;
      }

      if (account?.provider === "credentials" && user.id) {
        const [row] = await db
          .select({ emailVerified: users.emailVerified })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        if (!row?.emailVerified) {
          const email = encodeURIComponent(user.email ?? "");
          return authAbsoluteUrl(`/login?error=unverified_email&email=${email}`);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (token.sub) {
        const [row] = await db
          .select({
            role: users.role,
            emailVerified: users.emailVerified,
            onboardingCompletedAt: users.onboardingCompletedAt,
            name: users.name,
            organization: users.organization,
          })
          .from(users)
          .where(eq(users.id, token.sub))
          .limit(1);

        if (row) {
          token.role = (row.role ?? "USER") as AppUserRole;
          token.emailVerified = Boolean(row.emailVerified);
          token.onboardingComplete = Boolean(row.onboardingCompletedAt);
          token.name = row.name ?? undefined;
          token.organization = row.organization ?? null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role ?? "USER") as AppUserRole;
        session.user.emailVerified = Boolean(token.emailVerified);
        session.user.onboardingComplete = Boolean(token.onboardingComplete);
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
        session.user.organization = token.organization ?? null;
      }
      return session;
    },
  },
};

/**
 * Current session in the App Router / Route Handlers (same cookies as the incoming request).
 * NextAuth v4: implemented with `getServerSession`; aligns with the v5-style `auth()` API.
 */
export async function auth() {
  return getServerSession(authOptions);
}
