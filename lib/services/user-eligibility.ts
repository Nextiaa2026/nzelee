import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { userEligibilityProfiles } from "@/lib/db/schema";

export async function getUserEligibilityProfile(userId: string) {
  const [row] = await db
    .select({
      userId: userEligibilityProfiles.userId,
      kycStatus: userEligibilityProfiles.kycStatus,
      isKycApproved: userEligibilityProfiles.isKycApproved,
      isEligibleToInvest: userEligibilityProfiles.isEligibleToInvest,
      lastEvaluatedAt: userEligibilityProfiles.lastEvaluatedAt,
    })
    .from(userEligibilityProfiles)
    .where(eq(userEligibilityProfiles.userId, userId))
    .limit(1);

  return row ?? null;
}
