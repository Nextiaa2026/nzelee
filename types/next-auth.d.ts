import type { AppUserRole } from "./app-user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppUserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      organization?: string | null;
      emailVerified: boolean;
      onboardingComplete: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole;
    emailVerified?: boolean;
    onboardingComplete?: boolean;
    name?: string | null;
    organization?: string | null;
  }
}
