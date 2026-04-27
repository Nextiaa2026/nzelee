import type { AppUserRole } from "@/types/app-user";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  createdAt: string;
};

export type AdminCampaignRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  goal: string;
  raised: string;
};

export type AdminPledgeRow = {
  id: string;
  campaign: string;
  backer: string;
  amount: string;
  status: string;
};

export type AdminTransactionRow = {
  id: string;
  type: string;
  status: string;
  amount: string;
  campaign: string;
  provider: string;
};

export type AdminWithdrawalRow = {
  id: string;
  user: string;
  amount: string;
  status: string;
  destination: string;
  requestedAt: string;
  completedAt: string;
};

export type InvestorTransactionRow = {
  id: string;
  type: string;
  status: string;
  amount: string;
  listing: string;
  date: string;
};

export type InvestorInvestmentRow = {
  id: string;
  listing: string;
  amount: string;
  status: string;
  date: string;
};

export type InvestorWithdrawalRow = {
  id: string;
  amount: string;
  status: string;
  destination: string;
  requestedAt: string;
  completedAt: string;
};
