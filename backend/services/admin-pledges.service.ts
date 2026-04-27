import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db";
import { campaigns, pledges, users } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type PledgeRow = InferSelectModel<typeof pledges>;

export type AdminPledgeListRow = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  backerId: string;
  backerEmail: string;
  backerName: string | null;
  amount: number;
  status: PledgeRow["status"];
  createdAt: Date;
};

export async function listPledges(): Promise<AdminPledgeListRow[]> {
  const backer = alias(users, "backer");

  const rows = await db
    .select({
      id: pledges.id,
      campaignId: pledges.campaignId,
      campaignTitle: campaigns.title,
      backerId: pledges.backerId,
      backerEmail: backer.email,
      backerName: backer.name,
      amount: pledges.amount,
      status: pledges.status,
      createdAt: pledges.createdAt,
    })
    .from(pledges)
    .innerJoin(campaigns, eq(pledges.campaignId, campaigns.id))
    .innerJoin(backer, eq(pledges.backerId, backer.id))
    .orderBy(desc(pledges.createdAt));

  return rows;
}

export async function getPledgeById(id: string) {
  const backer = alias(users, "backer");
  const [row] = await db
    .select({
      id: pledges.id,
      campaignId: pledges.campaignId,
      campaignTitle: campaigns.title,
      backerId: pledges.backerId,
      backerEmail: backer.email,
      backerName: backer.name,
      amount: pledges.amount,
      status: pledges.status,
      createdAt: pledges.createdAt,
      rewardTierId: pledges.rewardTierId,
    })
    .from(pledges)
    .innerJoin(campaigns, eq(pledges.campaignId, campaigns.id))
    .innerJoin(backer, eq(pledges.backerId, backer.id))
    .where(eq(pledges.id, id))
    .limit(1);
  return row ?? null;
}

export async function updatePledgeStatus(id: string, status: PledgeRow["status"]) {
  const [row] = await db
    .update(pledges)
    .set({ status })
    .where(eq(pledges.id, id))
    .returning();
  return row ?? null;
}
