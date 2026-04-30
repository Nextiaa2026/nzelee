import { Elysia, t } from "elysia";
import { auth } from "@/lib/auth";
import { apiFail, apiOk } from "@/lib/http/api-result";
import { NotchPayService } from "../services/notchpay.service";
import { PaymentTransactionService } from "../services/payment-transaction.service";
import { PledgeService } from "../services/pledge.service";

const notchPayService = new NotchPayService();
const transactionService = new PaymentTransactionService();
const pledgeService = new PledgeService();

/**
 * Notch Pay payment integration controller
 */
export const notchpayController = new Elysia({ prefix: "/payments/notchpay" })
  // Initialize payment
  .post(
    "/initialize",
    async ({ body, set }) => {
      const session = await auth();
      if (!session?.user?.id) {
        set.status = 401;
        return apiFail("UNAUTHORIZED", "Sign in required");
      }

      const { pledgeId, amount, currency, email, callbackUrl } = body;

      // Validate inputs
      if (!pledgeId || !amount || !currency) {
        set.status = 400;
        return apiFail(
          "VALIDATION",
          "Missing required fields: pledgeId, amount, currency",
        );
      }

      if (amount <= 0) {
        set.status = 400;
        return apiFail("VALIDATION", "Amount must be greater than 0");
      }

      if (!["XAF", "USD", "EUR"].includes(currency)) {
        set.status = 400;
        return apiFail(
          "VALIDATION",
          "Invalid currency. Supported: XAF, USD, EUR",
        );
      }

      try {
        // Get pledge details
        const pledge = await pledgeService.getPledgeById(pledgeId);
        if (!pledge) {
          set.status = 404;
          return apiFail("NOT_FOUND", "Pledge not found");
        }

        // Verify user owns the pledge
        if (pledge.backerId !== session.user.id) {
          set.status = 403;
          return apiFail("FORBIDDEN", "You do not own this pledge");
        }

        // Generate unique reference
        const reference = `pledge-${pledgeId}-${Date.now()}`;

        // Create transaction record
        const transaction = await transactionService.createTransaction({
          campaignId: pledge.campaignId,
          pledgeId: pledge.id,
          payerUserId: session.user.id,
          payeeUserId: pledge.campaignId, // Will be updated with actual creator ID
          amount,
          currency,
          reference,
          description: `Payment for pledge ${pledgeId}`,
        });

        // Initialize payment with Notch Pay
        const paymentResponse = await notchPayService.initializePayment({
          amount,
          currency,
          reference,
          description: `Payment for pledge ${pledgeId}`,
          email: email ?? session.user.email ?? "",
          callback_url: callbackUrl,
        });

        // Update transaction with provider data
        await transactionService.updateTransactionStatus(
          transaction.id,
          "PENDING",
          paymentResponse.transaction.id,
        );

        set.status = 201;
        return apiOk({
          transactionId: transaction.id,
          reference,
          authorizationUrl: paymentResponse.authorization_url,
          paymentId: paymentResponse.transaction.id,
        });
      } catch (error) {
        console.error("Payment initialization error:", error);
        set.status = 500;
        return apiFail(
          "SERVER_ERROR",
          error instanceof Error
            ? error.message
            : "Failed to initialize payment",
        );
      }
    },
    {
      body: t.Object({
        pledgeId: t.String(),
        amount: t.Number(),
        currency: t.String(),
        email: t.Optional(t.String()),
        callbackUrl: t.Optional(t.String()),
      }),
    },
  )
  // Get payment status
  .get("/:reference/status", async ({ params, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      // Get transaction from database
      const transaction = await transactionService.getTransactionByReference(
        params.reference,
      );
      if (!transaction) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction not found");
      }

      // Verify user owns the transaction
      if (transaction.payerUserId !== session.user.id) {
        set.status = 403;
        return apiFail("FORBIDDEN", "You do not own this transaction");
      }

      // Get status from Notch Pay
      const paymentResponse = await notchPayService.getPaymentStatus(
        params.reference,
      );

      // Update transaction status
      const newStatus =
        paymentResponse.transaction.status === "complete"
          ? "SUCCEEDED"
          : paymentResponse.transaction.status === "failed"
            ? "FAILED"
            : paymentResponse.transaction.status === "cancelled"
              ? "CANCELED"
              : "PENDING";

      await transactionService.updateTransactionStatus(
        transaction.id,
        newStatus,
      );

      // Update pledge status if payment completed or failed
      if (transaction.pledgeId) {
        const pledgeStatus = pledgeService.mapPaymentStatusToPledgeStatus(
          paymentResponse.transaction.status,
        );
        if (pledgeStatus) {
          await pledgeService.updatePledgeStatus(
            transaction.pledgeId,
            pledgeStatus,
          );
        }
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
  // Webhook handler
  .post("/webhook", async ({ body, request, set }) => {
    try {
      // Get signature from headers
      const signature = request.headers.get("x-notchpay-signature") ?? "";
      const payload = JSON.stringify(body);

      // Validate signature
      if (!notchPayService.validateWebhookSignature(payload, signature)) {
        set.status = 401;
        return apiFail("UNAUTHORIZED", "Invalid webhook signature");
      }

      // Extract payment data
      const bodyData = body as {
        reference?: string;
        status?: string;
        transaction?: { id?: string };
      };
      const { reference, status, transaction } = bodyData;

      if (!reference) {
        set.status = 400;
        return apiFail("VALIDATION", "Missing reference in webhook payload");
      }

      // Get transaction
      const dbTransaction =
        await transactionService.getTransactionByReference(reference);
      if (!dbTransaction) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction not found");
      }

      // Check idempotency
      if (
        dbTransaction.status === "SUCCEEDED" ||
        dbTransaction.status === "FAILED"
      ) {
        // Already processed
        return apiOk({ message: "Webhook already processed" });
      }

      // Update transaction status
      const newStatus =
        status === "complete"
          ? "SUCCEEDED"
          : status === "failed"
            ? "FAILED"
            : status === "cancelled"
              ? "CANCELED"
              : "PENDING";

      await transactionService.updateTransactionStatus(
        dbTransaction.id,
        newStatus,
        transaction?.id,
      );

      // Update pledge status
      if (dbTransaction.pledgeId && status) {
        const pledgeStatus =
          pledgeService.mapPaymentStatusToPledgeStatus(status);
        if (pledgeStatus) {
          await pledgeService.updatePledgeStatus(
            dbTransaction.pledgeId,
            pledgeStatus,
          );
        }
      }

      return apiOk({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error("Webhook processing error:", error);
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to process webhook",
      );
    }
  })
  // Cancel payment
  .post("/:reference/cancel", async ({ params, set }) => {
    const session = await auth();
    if (!session?.user?.id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required");
    }

    try {
      // Get transaction
      const transaction = await transactionService.getTransactionByReference(
        params.reference,
      );
      if (!transaction) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Transaction not found");
      }

      // Verify user owns the transaction
      if (transaction.payerUserId !== session.user.id) {
        set.status = 403;
        return apiFail("FORBIDDEN", "You do not own this transaction");
      }

      // Check if payment is pending
      if (transaction.status !== "PENDING") {
        set.status = 400;
        return apiFail("VALIDATION", "Only pending payments can be cancelled");
      }

      // Cancel payment with Notch Pay
      await notchPayService.cancelPayment(params.reference);

      // Update transaction status
      await transactionService.updateTransactionStatus(
        transaction.id,
        "CANCELED",
      );

      // Update pledge status
      if (transaction.pledgeId) {
        await pledgeService.updatePledgeStatus(transaction.pledgeId, "FAILED");
      }

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
