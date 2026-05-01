import { eq, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentTransactions, pledges } from "@/lib/db/schema";
import crypto from "crypto";

export interface CreateTransactionParams {
  campaignId: string;
  pledgeId: string;
  payerUserId: string;
  payeeUserId: string;
  amount: number;
  currency: string;
  reference: string;
  description?: string;
}

export interface TransactionRecord {
  id: string;
  campaignId: string;
  pledgeId: string | null;
  payerUserId: string | null;
  payeeUserId: string | null;
  type: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  providerRef: string | null;
  idempotencyKey: string | null;
  description: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentTransactionService {
  /**
   * Generate a unique idempotency key
   */
  private generateIdempotencyKey(reference: string): string {
    return `notchpay-${reference}-${crypto.randomBytes(8).toString("hex")}`;
  }

  /**
   * Create a new payment transaction
   */
  async createTransaction(
    params: CreateTransactionParams,
  ): Promise<TransactionRecord> {
    const idempotencyKey = this.generateIdempotencyKey(params.reference);

    const [transaction] = await db
      .insert(paymentTransactions)
      .values({
        campaignId: params.campaignId,
        pledgeId: params.pledgeId,
        payerUserId: params.payerUserId,
        payeeUserId: params.payeeUserId,
        type: "PLEDGE_CAPTURE",
        status: "PENDING",
        amount: params.amount,
        currency: params.currency,
        provider: "notchpay",
        providerRef: params.reference,
        idempotencyKey,
        description:
          params.description ?? `Payment for pledge ${params.pledgeId}`,
      })
      .returning();

    if (!transaction) {
      throw new Error("Failed to create payment transaction");
    }

    return transaction as TransactionRecord;
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    id: string,
    status:
      | "PENDING"
      | "PROCESSING"
      | "SUCCEEDED"
      | "FAILED"
      | "CANCELED"
      | "REVERSED",
    providerTransactionId?: string,
  ): Promise<TransactionRecord | null> {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (providerTransactionId) {
      const [existing] = await db
        .select({ metadata: paymentTransactions.metadata })
        .from(paymentTransactions)
        .where(eq(paymentTransactions.id, id))
        .limit(1);
      const meta =
        existing?.metadata && typeof existing.metadata === "object"
          ? (existing.metadata as Record<string, unknown>)
          : {};
      updateData.metadata = {
        ...meta,
        notchPayTransactionId: providerTransactionId,
      };
    }

    const [transaction] = await db
      .update(paymentTransactions)
      .set(updateData)
      .where(eq(paymentTransactions.id, id))
      .returning();

    return transaction ? (transaction as TransactionRecord) : null;
  }

  /**
   * Get transaction by reference (providerRef)
   */
  async getTransactionByReference(
    reference: string,
  ): Promise<TransactionRecord | null> {
    const [transaction] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.providerRef, reference))
      .limit(1);

    return transaction ? (transaction as TransactionRecord) : null;
  }

  /**
   * Resolve by our provider reference OR stored Notch transaction id.
   * Useful when callback/webhook sends either value.
   */
  async getTransactionByExternalRef(
    referenceOrTxnId: string,
  ): Promise<TransactionRecord | null> {
    const [transaction] = await db
      .select()
      .from(paymentTransactions)
      .where(
        or(
          eq(paymentTransactions.providerRef, referenceOrTxnId),
          sql`${paymentTransactions.metadata} ->> 'notchPayTransactionId' = ${referenceOrTxnId}`,
          sql`${paymentTransactions.metadata} ->> 'notchPayReference' = ${referenceOrTxnId}`,
        ),
      )
      .limit(1);

    return transaction ? (transaction as TransactionRecord) : null;
  }

  /**
   * Get all transactions for a pledge
   */
  async getTransactionsByPledge(
    pledgeId: string,
  ): Promise<TransactionRecord[]> {
    const transactions = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.pledgeId, pledgeId));

    return transactions as TransactionRecord[];
  }

  /**
   * Check if idempotency key exists
   */
  async idempotencyKeyExists(key: string): Promise<boolean> {
    const [transaction] = await db
      .select({ id: paymentTransactions.id })
      .from(paymentTransactions)
      .where(eq(paymentTransactions.idempotencyKey, key))
      .limit(1);

    return !!transaction;
  }
}
