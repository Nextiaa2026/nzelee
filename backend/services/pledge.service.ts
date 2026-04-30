import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pledges } from "@/lib/db/schema";

export type PledgeStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface PledgeRecord {
  id: string;
  campaignId: string;
  backerId: string;
  rewardTierId: string | null;
  amount: number;
  status: PledgeStatus;
  createdAt: Date;
}

export class PledgeService {
  /**
   * Validate status transition
   */
  private isValidStatusTransition(
    currentStatus: PledgeStatus,
    newStatus: PledgeStatus,
  ): boolean {
    const validTransitions: Record<PledgeStatus, PledgeStatus[]> = {
      PENDING: ["PAID", "FAILED"],
      PAID: ["REFUNDED"],
      FAILED: ["PENDING"], // Allow retry
      REFUNDED: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  /**
   * Update pledge status
   */
  async updatePledgeStatus(
    pledgeId: string,
    newStatus: PledgeStatus,
  ): Promise<PledgeRecord | null> {
    // Get current pledge
    const [currentPledge] = await db
      .select()
      .from(pledges)
      .where(eq(pledges.id, pledgeId))
      .limit(1);

    if (!currentPledge) {
      throw new Error(`Pledge ${pledgeId} not found`);
    }

    // Validate transition
    if (
      !this.isValidStatusTransition(
        currentPledge.status as PledgeStatus,
        newStatus,
      )
    ) {
      throw new Error(
        `Invalid status transition from ${currentPledge.status} to ${newStatus}`,
      );
    }

    // Update status
    const [updatedPledge] = await db
      .update(pledges)
      .set({ status: newStatus })
      .where(eq(pledges.id, pledgeId))
      .returning();

    return updatedPledge ? (updatedPledge as PledgeRecord) : null;
  }

  /**
   * Get pledge by ID
   */
  async getPledgeById(pledgeId: string): Promise<PledgeRecord | null> {
    const [pledge] = await db
      .select()
      .from(pledges)
      .where(eq(pledges.id, pledgeId))
      .limit(1);

    return pledge ? (pledge as PledgeRecord) : null;
  }

  /**
   * Map payment status to pledge status
   */
  mapPaymentStatusToPledgeStatus(paymentStatus: string): PledgeStatus | null {
    const statusMap: Record<string, PledgeStatus> = {
      complete: "PAID",
      pending: "PENDING",
      failed: "FAILED",
      cancelled: "FAILED",
    };

    return statusMap[paymentStatus] ?? null;
  }
}
