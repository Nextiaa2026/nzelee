"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  image: z.string().optional().nullable(),
});

export async function updateProfile(formData: z.infer<typeof profileSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedFields = profileSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, image } = validatedFields.data;

  try {
    await db
      .update(users)
      .set({
        name,
        email,
        phone,
        image,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      error: "Failed to update profile. Email might already be in use.",
    };
  }
}
