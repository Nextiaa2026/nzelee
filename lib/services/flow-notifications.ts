import { createNotification, notifyAdmins } from "@/lib/services/notifications";

function formatMoney(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

/** After a user submits a withdrawal (always pending until an admin acts). */
export async function onUserWithdrawalSubmitted(params: {
  userId: string;
  userEmail: string;
  withdrawalId: string;
  amountCents: number;
  currency: string;
}) {
  const amt = formatMoney(params.amountCents, params.currency);
  await createNotification({
    userId: params.userId,
    type: "WITHDRAWAL",
    title: "Withdrawal request received",
    body: `We received your request for ${amt}. An administrator will approve or reject it.`,
    href: "/dashboard/withdrawals",
    metadata: { withdrawalId: params.withdrawalId },
  });
  await notifyAdmins({
    type: "WITHDRAWAL",
    title: "New withdrawal request",
    body: `${params.userEmail} requested ${amt}.`,
    href: "/admin/withdrawals",
    metadata: { withdrawalId: params.withdrawalId },
  });
}

/** After an admin changes withdrawal status (notifies requester + acting admin). */
export async function onWithdrawalStatusUpdatedByAdmin(params: {
  requestUserId: string;
  userEmail: string;
  actorAdminId: string;
  withdrawalId: string;
  previousStatus: string;
  newStatus: string;
  amountCents: number;
  currency: string;
  adminNote: string | null;
}) {
  if (params.previousStatus === params.newStatus) return;

  const amt = formatMoney(params.amountCents, params.currency);
  const note = params.adminNote?.trim();

  if (params.newStatus === "APPROVED") {
    await createNotification({
      userId: params.requestUserId,
      type: "WITHDRAWAL",
      title: "Withdrawal approved",
      body: [
        `Your withdrawal of ${amt} was approved.`,
        note ? `Note: ${note}` : null,
      ]
        .filter(Boolean)
        .join(" "),
      href: "/dashboard/withdrawals",
      metadata: { withdrawalId: params.withdrawalId },
    });
  } else if (params.newStatus === "REJECTED") {
    await createNotification({
      userId: params.requestUserId,
      type: "WITHDRAWAL",
      title: "Withdrawal rejected",
      body: [
        `Your withdrawal of ${amt} was rejected.`,
        note ? `Reason: ${note}` : null,
      ]
        .filter(Boolean)
        .join(" "),
      href: "/dashboard/withdrawals",
      metadata: { withdrawalId: params.withdrawalId },
    });
  } else if (params.newStatus === "COMPLETED") {
    await createNotification({
      userId: params.requestUserId,
      type: "WITHDRAWAL",
      title: "Withdrawal completed",
      body: `Your withdrawal of ${amt} has been marked completed.`,
      href: "/dashboard/withdrawals",
      metadata: { withdrawalId: params.withdrawalId },
    });
  } else if (params.newStatus === "CANCELLED") {
    await createNotification({
      userId: params.requestUserId,
      type: "WITHDRAWAL",
      title: "Withdrawal cancelled",
      body: `Your withdrawal of ${amt} was cancelled.${note ? ` Note: ${note}` : ""}`,
      href: "/dashboard/withdrawals",
      metadata: { withdrawalId: params.withdrawalId },
    });
  }

  await createNotification({
    userId: params.actorAdminId,
    type: "SYSTEM",
    title: "Withdrawal updated",
    body: `You set withdrawal ${params.withdrawalId.slice(0, 8)}… for ${params.userEmail} to ${params.newStatus}.`,
    href: "/admin/withdrawals",
    metadata: { withdrawalId: params.withdrawalId },
  });
}

/** After KYC is approved or rejected (notifies applicant + reviewer). */
export async function onKycDecisionFinalized(params: {
  applicantUserId: string;
  applicantEmail: string;
  actorAdminId: string;
  submissionId: string;
  newStatus: "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  previousStatus: string;
}) {
  if (params.previousStatus === params.newStatus) return;

  if (params.newStatus === "APPROVED") {
    await createNotification({
      userId: params.applicantUserId,
      type: "KYC",
      title: "Identity verification approved",
      body: "Your documents were approved. You can invest according to your eligibility.",
      href: "/dashboard/kyc",
      metadata: { submissionId: params.submissionId },
    });
  } else {
    await createNotification({
      userId: params.applicantUserId,
      type: "KYC",
      title: "Identity verification rejected",
      body:
        params.rejectionReason?.trim() ||
        "Please review the requirements and submit updated documents.",
      href: "/dashboard/kyc",
      metadata: { submissionId: params.submissionId },
    });
  }

  await createNotification({
    userId: params.actorAdminId,
    type: "SYSTEM",
    title: "KYC decision recorded",
    body: `You marked ${params.applicantEmail}'s submission as ${params.newStatus}.`,
    href: "/admin/kyc",
    metadata: { submissionId: params.submissionId },
  });
}
