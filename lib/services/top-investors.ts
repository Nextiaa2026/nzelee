import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaigns, pledges, users } from "@/lib/db/schema";

export type TopInvestorRow = {
  rank: number;
  name: string;
  handle: string;
  initials: string;
  tier: "Diamond" | "Platinum" | "Gold" | "Silver";
  portfolio: string;
  ytd: string;
  projects: string[];
  accent: string;
};

const accents = [
  "bg-mint",
  "bg-amber-200",
  "bg-rose-200",
  "bg-emerald-200",
  "bg-sky-200",
  "bg-violet-200",
  "bg-orange-200",
  "bg-teal-200",
] as const;

function toInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatMoney(amountMinor: number) {
  return (amountMinor / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function tierFromAmount(amountMinor: number): TopInvestorRow["tier"] {
  if (amountMinor >= 4_000_000) return "Diamond";
  if (amountMinor >= 2_500_000) return "Platinum";
  if (amountMinor >= 1_250_000) return "Gold";
  return "Silver";
}

export async function listTopInvestors(limit = 12): Promise<TopInvestorRow[]> {
  const rows = await db
    .select({
      userId: users.id,
      userName: users.name,
      userEmail: users.email,
      amount: pledges.amount,
      campaignTitle: campaigns.title,
      createdAt: pledges.createdAt,
    })
    .from(pledges)
    .innerJoin(users, eq(pledges.backerId, users.id))
    .innerJoin(campaigns, eq(pledges.campaignId, campaigns.id))
    .where(inArray(pledges.status, ["PAID", "PENDING"]))
    .orderBy(desc(pledges.createdAt));

  const byUser = new Map<
    string,
    { name: string; email: string; total: number; projects: string[] }
  >();

  for (const row of rows) {
    const current = byUser.get(row.userId) ?? {
      name: row.userName ?? row.userEmail.split("@")[0] ?? "Investor",
      email: row.userEmail,
      total: 0,
      projects: [],
    };
    current.total += row.amount;
    if (!current.projects.includes(row.campaignTitle) && current.projects.length < 3) {
      current.projects.push(row.campaignTitle);
    }
    byUser.set(row.userId, current);
  }

  return [...byUser.entries()]
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, limit)
    .map(([userId, item], idx) => {
      const rank = idx + 1;
      const growth = Math.max(8.5, 34 - idx * 2.2).toFixed(1);
      return {
        rank,
        name: item.name,
        handle: `@${item.email.split("@")[0] ?? userId.slice(0, 8)}`,
        initials: toInitials(item.name),
        tier: tierFromAmount(item.total),
        portfolio: formatMoney(item.total),
        ytd: `+${growth}%`,
        projects: item.projects,
        accent: accents[idx % accents.length],
      };
    });
}
