import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { apiFail, apiOk } from "@/lib/http/api-result";
import { profileSettingsSchema } from "@/lib/validations/marketing-forms";
import { completeOnboardingSchema } from "@/lib/validations/onboarding";
import {
  listNotificationsForUser,
  countUnreadNotificationsForUser,
  markNotificationReadForUser,
} from "@/lib/services/notifications";
import {
  listFavoriteCampaignSummaries,
  addCampaignFavorite,
  removeCampaignFavorite,
} from "@/lib/services/campaign-favorites";
import { executeImageUpload } from "@/lib/services/image-upload";

/**
 * User profile and related endpoints (profile, notifications, favorites, onboarding)
 */
export const userProfileController = new Elysia()
  // Update profile settings
  .put("/profile", async ({ body, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    const parsed = profileSettingsSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid profile data",
      );
    }

    try {
      const { displayName, email, phone, organization, country, dateOfBirth, image } = parsed.data;

      const updateData: Partial<typeof users.$inferInsert> = {
        name: displayName,
        email,
        phone: phone?.trim() ? phone.trim() : null,
        organization: organization?.trim() ? organization.trim() : null,
        country: country?.trim() ? country.trim().toUpperCase() : null,
        dateOfBirth: dateOfBirth?.trim() ? new Date(dateOfBirth) : null,
        updatedAt: new Date(),
      };

      if (image !== undefined) {
        updateData.image = image?.trim() ? image.trim() : null;
      }

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, session.user.id));

      return apiOk({ updated: true });
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  })
  // Upload profile avatar
  .post("/avatar", async ({ request, set }) => {
    const { status, result } = await executeImageUpload(request, {
      folder: "nexiaa/avatars",
      adminOnly: false,
    });
    set.status = status;
    return result;
  })
  // List notifications
  .get("/notifications", async ({ set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      const notifications = await listNotificationsForUser(session.user.id);
      return apiOk(notifications);
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications",
      );
    }
  })
  // Get unread notification count
  .get("/notifications/unread-count", async ({ set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      return apiOk({ count: 0 });
    }

    try {
      const count = await countUnreadNotificationsForUser(session.user.id);
      return apiOk({ count });
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to fetch unread count",
      );
    }
  })
  // Mark notification as read
  .patch("/notifications/:id/read", async ({ params, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      const ok = await markNotificationReadForUser(session.user.id, params.id);
      if (!ok) {
        set.status = 403;
        return apiFail("FORBIDDEN", "Notification does not belong to you");
      }
      return apiOk({ ok: true });
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read",
      );
    }
  })
  // List favorite campaigns
  .get("/favorites", async ({ set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      const favorites = await listFavoriteCampaignSummaries(session.user.id);
      return apiOk(favorites);
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to fetch favorites",
      );
    }
  })
  // Add campaign to favorites
  .post(
    "/favorites",
    async ({ body, set }) => {
      const session = await auth();
      if (!session?.user?.id) {
        set.status = 401;
        return apiFail("UNAUTHORIZED", "Sign in required");
      }

      const { campaignId } = body;
      if (!campaignId) {
        set.status = 400;
        return apiFail("VALIDATION", "campaignId is required");
      }

      try {
        const result = await addCampaignFavorite(session.user.id, campaignId);
        if (!result.ok) {
          set.status = 400;
          return apiFail(
            "VALIDATION",
            result.message ?? "Failed to add favorite",
          );
        }
        set.status = 201;
        return apiOk({ added: true });
      } catch (error) {
        set.status = 500;
        return apiFail(
          "SERVER_ERROR",
          error instanceof Error ? error.message : "Failed to add favorite",
        );
      }
    },
    {
      body: t.Object({
        campaignId: t.String(),
      }),
    },
  )
  // Remove campaign from favorites
  .delete("/favorites/:campaignId", async ({ params, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      await removeCampaignFavorite(session.user.id, params.campaignId);
      return apiOk({ removed: true });
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to remove favorite",
      );
    }
  })
  // Complete onboarding
  .post("/onboarding/complete", async ({ body, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    const parsed = completeOnboardingSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid onboarding data",
      );
    }

    try {
      const { displayName, country, dateOfBirth, organization } = parsed.data;

      await db
        .update(users)
        .set({
          name: displayName,
          country,
          dateOfBirth,
          organization: organization ?? null,
          onboardingCompletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      set.status = 201;
      return apiOk({ completed: true });
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding",
      );
    }
  });
