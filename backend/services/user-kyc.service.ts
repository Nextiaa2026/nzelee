import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { kycSubmissions, userEligibilityProfiles } from "@/lib/db/schema";
import type { UserKycSubmitBody } from "@/lib/validations/user-kyc";
import { createNotification, notifyAdmins } from "@/lib/services/notifications";

type DbDocType = "PASSPORT" | "NATIONAL_ID" | "DRIVERS_LICENSE";

function mapIdTypeToDocumentType(idType: UserKycSubmitBody["idType"]): DbDocType {
  if (idType === "ID_CARD") return "NATIONAL_ID";
  return idType;
}

/**
 * Sends a message to the admin/system about the new KYC submission.
 */
async function sendKycSubmissionMessage(userId: string, submissionId: string) {
  await notifyAdmins({
    type: "KYC",
    title: "New KYC Submission",
    body: `User ${userId} has submitted identity documents for review. Submission ID: ${submissionId}`,
    href: "/admin/kyc",
  });
}


export async function submitUserKyc(userId: string, body: UserKycSubmitBody) {
  const [profile] = await db
    .select({ isKycApproved: userEligibilityProfiles.isKycApproved })
    .from(userEligibilityProfiles)
    .where(eq(userEligibilityProfiles.userId, userId))
    .limit(1);

  if (profile?.isKycApproved) {
    throw new Error("Your identity is already verified.");
  }

  const inProgress = await db
    .select({ id: kycSubmissions.id })
    .from(kycSubmissions)
    .where(
      and(
        eq(kycSubmissions.userId, userId),
        inArray(kycSubmissions.status, ["PENDING", "UNDER_REVIEW"]),
      ),
    )
    .limit(1);

  if (inProgress.length > 0) {
    throw new Error("You already have a verification in progress. Please wait for a decision.");
  }

  const documentType = mapIdTypeToDocumentType(body.idType);
  const backUrl =
    body.idType === "PASSPORT" ? null : (body.backIdUrl?.trim() || null);

  const [row] = await db
    .insert(kycSubmissions)
    .values({
      userId,
      status: "PENDING",
      documentType,
      documentFrontUrl: body.frontIdUrl.trim(),
      documentBackUrl: backUrl,
      selfieUrl: body.selfieUrl.trim(),
      metadata: {
        idDocumentNumber: body.idNumber.trim(),
        submittedIdType: body.idType,
      },
    })
    .returning();

  if (row) {
    // Create a notification for the user
    await createNotification({
      userId,
      type: "KYC",
      title: "Verification Submitted",
      body: "We have received your identity documents and are currently reviewing them. This usually takes 24-48 hours.",
      href: "/dashboard/kyc",
    });

    // Send message to system/admins
    await sendKycSubmissionMessage(userId, row.id);
  }

  return row;
}

