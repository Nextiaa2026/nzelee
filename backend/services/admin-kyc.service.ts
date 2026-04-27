import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db";
import { kycSubmissions, userEligibilityProfiles, users } from "@/lib/db/schema";

type KycStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";

export async function listKycSubmissions() {
  const u = alias(users, "u");
  return db
    .select({
      id: kycSubmissions.id,
      userId: kycSubmissions.userId,
      status: kycSubmissions.status,
      documentType: kycSubmissions.documentType,
      documentFrontUrl: kycSubmissions.documentFrontUrl,
      documentBackUrl: kycSubmissions.documentBackUrl,
      selfieUrl: kycSubmissions.selfieUrl,
      dateOfBirth: kycSubmissions.dateOfBirth,
      nationality: kycSubmissions.nationality,
      countryOfResidence: kycSubmissions.countryOfResidence,
      submittedAt: kycSubmissions.submittedAt,
      reviewedAt: kycSubmissions.reviewedAt,
      reviewerUserId: kycSubmissions.reviewerUserId,
      rejectionReason: kycSubmissions.rejectionReason,
      createdAt: kycSubmissions.createdAt,
      updatedAt: kycSubmissions.updatedAt,
      userEmail: u.email,
      userName: u.name,
    })
    .from(kycSubmissions)
    .innerJoin(u, eq(kycSubmissions.userId, u.id))
    .orderBy(desc(kycSubmissions.submittedAt));
}

export async function updateKycSubmissionDecision(input: {
  id: string;
  reviewerUserId: string;
  status: KycStatus;
  rejectionReason?: string | null;
}) {
  const reviewedAt = new Date();
  const [row] = await db
    .update(kycSubmissions)
    .set({
      status: input.status,
      reviewedAt,
      reviewerUserId: input.reviewerUserId,
      rejectionReason:
        input.status === "REJECTED" ? input.rejectionReason?.trim() || "Rejected by admin" : null,
      updatedAt: reviewedAt,
    })
    .where(eq(kycSubmissions.id, input.id))
    .returning();

  if (!row) return null;

  await db
    .insert(userEligibilityProfiles)
    .values({
      userId: row.userId,
      kycStatus: row.status,
      country: row.countryOfResidence ?? null,
      dateOfBirth: row.dateOfBirth ?? null,
      isKycApproved: row.status === "APPROVED",
      isEligibleToInvest: row.status === "APPROVED",
      lastEvaluatedAt: reviewedAt,
      updatedAt: reviewedAt,
    })
    .onConflictDoUpdate({
      target: userEligibilityProfiles.userId,
      set: {
        kycStatus: row.status,
        country: row.countryOfResidence ?? null,
        dateOfBirth: row.dateOfBirth ?? null,
        isKycApproved: row.status === "APPROVED",
        isEligibleToInvest: row.status === "APPROVED",
        lastEvaluatedAt: reviewedAt,
        updatedAt: reviewedAt,
      },
    });

  return row;
}
