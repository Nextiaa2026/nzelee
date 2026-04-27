"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { profileSettingsSchema } from "@/lib/validations/marketing-forms";

export async function updateProfileSettings(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = profileSettingsSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid profile");
  }

  const { displayName, organization } = parsed.data;

  await db
    .update(users)
    .set({
      name: displayName,
      organization: organization?.trim() ? organization.trim() : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
