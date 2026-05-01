import { Elysia, t } from "elysia";

import { auth } from "@/lib/auth";
import { apiFail, apiOk } from "@/lib/http/api-result";
import {
  applyNotchWebhookOrPollStatus,
  startNotchCheckoutForPledge,
} from "@/backend/services/investment-checkout.service";
import { NotchPayService } from "@/backend/services/notchpay.service";
import { PaymentTransactionService } from "@/backend/services/payment-transaction.service";

const notchPayService = new NotchPayService();
const transactionService = new PaymentTransactionService();

function resolveNotchLookupRef(tx: {
  providerRef: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const notchReference =
    tx.metadata &&
    typeof tx.metadata === "object" &&
    typeof tx.metadata.notchPayReference === "string"
      ? tx.metadata.notchPayReference
      : null;
  const notchId =
    tx.metadata &&
    typeof tx.metadata === "object" &&
    typeof tx.metadata.notchPayTransactionId === "string"
      ? tx.metadata.notchPayTransactionId
      : null;
  return notchReference ?? notchId ?? tx.providerRef ?? null;
}

/**
 * Notch Pay payment integration (hosted checkout).
 * Configure Notch Pay webhooks to POST the **raw JSON body** to:
 * `POST /api/webhooks/notchpay` (Next route — required for correct HMAC verification).
 */
export const notchpayController = new Elysia({ prefix: "/payments/notchpay" })
  .post(
    "/initialize",
    async ({ body, set }) => {
      const session = await auth();
      if (!session?.user?.id) {
        set.status = 401;
        return apiFail("UNAUTHORIZED", "Sign in required");
      }

      try {
        const checkout = await startNotchCheckoutForPledge(
          session.user.id,
          body.pledgeId,
          { callbackUrl: body.callbackUrl },
        );
        set.status = 201;
        return apiOk({
          transactionId: checkout.paymentTransactionId,
          reference: checkout.reference,
          authorizationUrl: checkout.authorizationUrl,
          paymentId: checkout.notchPayTransactionId,
        });
      } catch (error) {
        console.error("Payment initialization error:", error);
        set.status = 400;
        return apiFail(
          "VALIDATION",
          error instanceof Error ? error.message : "Failed to initialize payment",
        );
      }
    },
    {
      body: t.Object({
        pledgeId: t.String(),
        callbackUrl: t.Optional(t.String({ maxLength: 2048 })),
      }),
    },
  )
  .get("/:reference/status", async ({ params, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      const transaction = await transactionService.getTransactionByExternalRef(
        params.reference,
      );
      if (!transaction) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction not found");
      }

      if (transaction.payerUserId !== session.user.id) {
        set.status = 403;
        return apiFail("FORBIDDEN", "You do not own this transaction");
      }

      const notchLookupRef = resolveNotchLookupRef(transaction);
      if (!notchLookupRef) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction reference missing");
      }

      const paymentResponse = await notchPayService.getPaymentStatus(
        notchLookupRef,
      );

      const applied = await applyNotchWebhookOrPollStatus(
        transaction.providerRef ?? params.reference,
        paymentResponse.transaction.status,
        paymentResponse.transaction.id,
      );
      if (!applied.ok) {
        set.status = 500;
        return apiFail("SERVER_ERROR", applied.message);
      }

      return apiOk({
        status: paymentResponse.transaction.status,
        transactionId: transaction.id,
        amount: paymentResponse.transaction.amount,
        currency: paymentResponse.transaction.currency,
        completedAt: paymentResponse.transaction.completed_at,
      });
    } catch (error) {
      console.error("Payment status check error:", error);
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error
          ? error.message
          : "Failed to check payment status",
      );
    }
  })
  .post("/:reference/cancel", async ({ params, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      const transaction = await transactionService.getTransactionByExternalRef(
        params.reference,
      );
      if (!transaction) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction not found");
      }

      if (transaction.payerUserId !== session.user.id) {
        set.status = 403;
        return apiFail("FORBIDDEN", "You do not own this transaction");
      }

      if (transaction.status !== "PENDING") {
        set.status = 400;
        return apiFail("VALIDATION", "Only pending payments can be cancelled");
      }

      const notchLookupRef = resolveNotchLookupRef(transaction);
      if (!notchLookupRef) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction reference missing");
      }

      await notchPayService.cancelPayment(notchLookupRef);

      await applyNotchWebhookOrPollStatus(
        transaction.providerRef ?? params.reference,
        "cancelled",
        undefined,
      );

      return apiOk({ message: "Payment cancelled successfully" });
    } catch (error) {
      console.error("Payment cancellation error:", error);
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to cancel payment",
      );
    }
  });
