"use client";

import { useQuery } from "@tanstack/react-query";

import {
  investorTransactionsMock,
  investorWithdrawalsMock,
  mockNetworkDelay,
  mockQueryKeys,
} from "@/lib/mocks";

export function useMockInvestorTransactions() {
  return useQuery({
    queryKey: mockQueryKeys.investor.transactions,
    queryFn: async () => {
      await mockNetworkDelay();
      return investorTransactionsMock;
    },
  });
}

export function useMockInvestorWithdrawals() {
  return useQuery({
    queryKey: mockQueryKeys.investor.withdrawals,
    queryFn: async () => {
      await mockNetworkDelay();
      return investorWithdrawalsMock;
    },
  });
}
