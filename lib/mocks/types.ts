export type InvestorTransactionRow = {
  id: string;
  type: string;
  status: string;
  amount: string;
  listing: string;
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
