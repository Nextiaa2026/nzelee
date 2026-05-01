"use client";

import { useQuery } from "@tanstack/react-query";

import {
  investorTransactionsMock,
  investorWithdrawalsMock,
  mockNetworkDelay,
  mockQueryKeys,
} from "@/lib/mocks";

export function useMockInvestorTransactions() {
  return useMockInvestorTransactionsPaginated({ page: 1, pageSize: 10 });
}

export function useMockInvestorTransactionsPaginated({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: [...mockQueryKeys.investor.transactions, page, pageSize],
    queryFn: async () => {
      await mockNetworkDelay();
      const total = investorTransactionsMock.length;
      const offset = (page - 1) * pageSize;
      const items = investorTransactionsMock.slice(offset, offset + pageSize);
      return { items, total, page, pageSize };
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
