import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/lib/db";
import { users, userEligibilityProfiles } from "@/lib/db/schema";
import type { AppUserRole } from "@/types/app-user";
import { verifyPassword } from "@/lib/security/password";
import { loginSchema } from "@/lib/validations/auth";

/**
 * next-auth/react calls `new URL(data.url)` when `signIn(..., { redirect: false })`.
 * Relative paths throw in the browser — redirect strings from `signIn` must be absolute.
 */


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
    async signIn({ account }) {
      // OAuth providers like Google already verify emails.
      // We only enforce manual verification for Credentials provider.
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.sub = user.id;
      }
      
      if (account) {
        token.provider = account.provider;
      }

      if (token.sub) {
        const [row] = await db
          .select({
            role: users.role,
            emailVerified: users.emailVerified,
            onboardingCompletedAt: users.onboardingCompletedAt,
            name: users.name,
            organization: users.organization,
            kycStatus: userEligibilityProfiles.kycStatus,
          })
          .from(users)
          .leftJoin(
            userEligibilityProfiles,
            eq(users.id, userEligibilityProfiles.userId),
          )
          .where(eq(users.id, token.sub))
          .limit(1);

        if (row) {
          token.role = (row.role ?? "USER") as AppUserRole;
          // If the user used OAuth, we treat them as verified. 
          // If credentials, we check the database timestamp.
          token.emailVerified = token.provider !== "credentials" || Boolean(row.emailVerified);
          token.onboardingComplete = Boolean(row.onboardingCompletedAt);
          token.name = row.name ?? undefined;
          token.organization = row.organization ?? null;
          token.kycStatus = row.kycStatus ?? "PENDING";
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
        session.user.kycStatus = token.kycStatus;
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
