import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  userEligibilityProfiles,
} from "@/lib/db/schema";
import type { AppUserRole } from "@/types/app-user";
import { verifyPassword } from "@/lib/security/password";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  trustHost: true,
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
      /**
       * If this email already exists (e.g. email/password signup) but no Google
       * row is in `accounts`, link the Google account to that user instead of
       * OAuthAccountNotLinked. Safe here because Google verifies email ownership.
       */
      allowDangerousEmailAccountLinking: true,
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

        // Block unverified email addresses for credentials login.
        // Google OAuth users are always considered verified.
        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const valid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) {
          throw new Error("INVALID_CREDENTIALS");
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
          token.emailVerified =
            token.provider !== "credentials" || Boolean(row.emailVerified);
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
        // Cast: v5 base type is `Date | null`; we intentionally store a boolean
        (session.user as unknown as { emailVerified: boolean }).emailVerified =
          Boolean(token.emailVerified);
        session.user.onboardingComplete = Boolean(token.onboardingComplete);
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
        // Cast: v5 JWT uses `{}` for unknown fields; narrow to our declared type
        session.user.organization =
          (token.organization as string | null | undefined) ?? null;
        session.user.kycStatus = token.kycStatus as
          | "PENDING"
          | "UNDER_REVIEW"
          | "APPROVED"
          | "REJECTED"
          | "EXPIRED"
          | undefined;
      }
      return session;
    },
  },
});
