import type {
  AdminCampaignRow,
  AdminPledgeRow,
  AdminTransactionRow,
  AdminUserRow,
  AdminWithdrawalRow,
} from "./types";

export const adminUsersMock: AdminUserRow[] = [
  {
    id: "u1",
    name: "Amina Okoro",
    email: "amina@example.com",
    role: "ADMIN",
    createdAt: "2026-01-12",
  },
  {
    id: "u2",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "CREATOR",
    createdAt: "2026-02-03",
  },
  {
    id: "u3",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "USER",
    createdAt: "2026-03-18",
  },
];

export const adminCampaignsMock: AdminCampaignRow[] = [
  {
    id: "c1",
    title: "Solar kits for rural clinics",
    slug: "solar-clinics",
    status: "LIVE",
    goal: "$50,000",
    raised: "$32,400",
  },
  {
    id: "c2",
    title: "Community recording studio",
    slug: "studio-downtown",
    status: "DRAFT",
    goal: "$18,000",
    raised: "$0",
  },
  {
    id: "c3",
    title: "Youth coding bootcamp",
    slug: "youth-code",
    status: "FUNDED",
    goal: "$12,000",
    raised: "$14,200",
  },
];

export const adminPledgesMock: AdminPledgeRow[] = [
  {
    id: "p1",
    campaign: "Solar kits for rural clinics",
    backer: "sam@example.com",
    amount: "$120",
    status: "PAID",
  },
  {
    id: "p2",
    campaign: "Solar kits for rural clinics",
    backer: "jordan@example.com",
    amount: "$500",
    status: "PENDING",
  },
  {
    id: "p3",
    campaign: "Youth coding bootcamp",
    backer: "amina@example.com",
    amount: "$75",
    status: "PAID",
  },
];

/** Same rows as pledges; admin “Investments” view. */
export const adminInvestmentsMock = adminPledgesMock;

export const adminWithdrawalsMock: AdminWithdrawalRow[] = [
  {
    id: "w1",
    user: "jordan@example.com",
    amount: "$4,200",
    status: "COMPLETED",
    destination: "Bank •••• 4242",
    requestedAt: "2026-03-02",
    completedAt: "2026-03-03",
  },
  {
    id: "w2",
    user: "amina@example.com",
    amount: "$800",
    status: "PENDING",
    destination: "Bank •••• 9012",
    requestedAt: "2026-04-18",
    completedAt: "—",
  },
  {
    id: "w3",
    user: "sam@example.com",
    amount: "$250",
    status: "PROCESSING",
    destination: "Wallet USDC",
    requestedAt: "2026-04-20",
    completedAt: "—",
  },
];

export const adminTransactionsMock: AdminTransactionRow[] = [
  {
    id: "t1",
    type: "PLEDGE_CAPTURE",
    status: "SUCCEEDED",
    amount: "$120",
    campaign: "Solar kits for rural clinics",
    provider: "stripe",
  },
  {
    id: "t2",
    type: "PLATFORM_FEE",
    status: "SUCCEEDED",
    amount: "$6",
    campaign: "Solar kits for rural clinics",
    provider: "stripe",
  },
  {
    id: "t3",
    type: "REFUND",
    status: "SUCCEEDED",
    amount: "$50",
    campaign: "Youth coding bootcamp",
    provider: "stripe",
  },
];
