"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { completeOnboardingSchema } from "@/lib/validations/onboarding";

export async function completeOnboarding(input: {
  displayName: string;
  country: string;
  organization?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = completeOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid profile data");
  }

  const { displayName, country, organization } = parsed.data;

  await db
    .update(users)
    .set({
      name: displayName,
      country,
      organization: organization ?? null,
      onboardingCompletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/");
}
