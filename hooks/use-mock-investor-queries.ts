"use client";

import { useQuery } from "@tanstack/react-query";

import {
  investorInvestmentsMock,
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

export function useMockInvestorInvestments() {
  return useQuery({
    queryKey: mockQueryKeys.investor.investments,
    queryFn: async () => {
      await mockNetworkDelay();
      return investorInvestmentsMock;
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
