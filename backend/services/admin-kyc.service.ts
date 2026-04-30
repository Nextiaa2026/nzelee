import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db";
import {
  kycSubmissions,
  userEligibilityProfiles,
  users,
} from "@/lib/db/schema";

type KycStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export async function listKycSubmissions(params: {
  page: number;
  pageSize: number;
}) {
  const u = alias(users, "u");
  const offset = (params.page - 1) * params.pageSize;
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(kycSubmissions);
  const rows = await db
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
      userCountry: u.country,
      userDateOfBirth: u.dateOfBirth,
      userOrganization: u.organization,
      userOnboardingCompletedAt: u.onboardingCompletedAt,
    })
    .from(kycSubmissions)
    .innerJoin(u, eq(kycSubmissions.userId, u.id))
    .orderBy(desc(kycSubmissions.submittedAt))
    .limit(params.pageSize)
    .offset(offset);
  return {
    rows,
    total: countRow?.count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function updateKycSubmissionDecision(input: {
  id: string;
  reviewerUserId: string;
  status: KycStatus;
  rejectionReason?: string | null;
}) {
  const u = alias(users, "kyc_u");
  const [existing] = await db
    .select({
      status: kycSubmissions.status,
      userId: kycSubmissions.userId,
      userEmail: u.email,
    })
    .from(kycSubmissions)
    .innerJoin(u, eq(kycSubmissions.userId, u.id))
    .where(eq(kycSubmissions.id, input.id))
    .limit(1);
  if (!existing) {
    return null;
  }
  const previousStatus = existing.status;

  const reviewedAt = new Date();
  const [row] = await db
    .update(kycSubmissions)
    .set({
      status: input.status,
      reviewedAt,
      reviewerUserId: input.reviewerUserId,
      rejectionReason:
        input.status === "REJECTED"
          ? input.rejectionReason?.trim() || "Rejected by admin"
          : null,
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

  if (
    (row.status === "APPROVED" || row.status === "REJECTED") &&
    row.status !== previousStatus
  ) {
    try {
      const { onKycDecisionFinalized } =
        await import("@/lib/services/flow-notifications");
      await onKycDecisionFinalized({
        applicantUserId: row.userId,
        applicantEmail: existing.userEmail,
        actorAdminId: input.reviewerUserId,
        submissionId: row.id,
        newStatus: row.status,
        rejectionReason: row.rejectionReason,
        previousStatus,
      });
    } catch (e) {
      console.error("[kyc] notification side-effect failed", e);
    }
  }

  return row;
}
