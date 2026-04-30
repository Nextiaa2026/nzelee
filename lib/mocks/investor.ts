import type { InvestorTransactionRow, InvestorWithdrawalRow } from "./types";

export const investorTransactionsMock: InvestorTransactionRow[] = [
  {
    id: "it1",
    type: "PLEDGE_CAPTURE",
    status: "SUCCEEDED",
    amount: "$500",
    listing: "Solar kits for rural clinics",
    date: "2026-02-14",
  },
  {
    id: "it2",
    type: "REFUND",
    status: "SUCCEEDED",
    amount: "$50",
    listing: "Youth coding bootcamp",
    date: "2026-03-01",
  },
  {
    id: "it3",
    type: "PLATFORM_FEE",
    status: "SUCCEEDED",
    amount: "$2.50",
    listing: "Solar kits for rural clinics",
    date: "2026-02-14",
  },
];

export const investorWithdrawalsMock: InvestorWithdrawalRow[] = [
  {
    id: "iw1",
    amount: "$200",
    status: "COMPLETED",
    destination: "Bank •••• 4242",
    requestedAt: "2026-03-10",
    completedAt: "2026-03-11",
  },
  {
    id: "iw2",
    amount: "$150",
    status: "PENDING",
    destination: "Bank •••• 4242",
    requestedAt: "2026-04-21",
    completedAt: "—",
  },
];
