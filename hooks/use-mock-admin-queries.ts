"use client";

import { useQuery } from "@tanstack/react-query";

import {
  adminCampaignsMock,
  adminInvestmentsMock,
  adminTransactionsMock,
  adminUsersMock,
  adminWithdrawalsMock,
  mockNetworkDelay,
  mockQueryKeys,
} from "@/lib/mocks";

export function useMockAdminUsers() {
  return useQuery({
    queryKey: mockQueryKeys.admin.users,
    queryFn: async () => {
      await mockNetworkDelay();
      return adminUsersMock;
    },
  });
}

export function useMockAdminCampaigns() {
  return useQuery({
    queryKey: mockQueryKeys.admin.campaigns,
    queryFn: async () => {
      await mockNetworkDelay();
      return adminCampaignsMock;
    },
  });
}

export function useMockAdminInvestments() {
  return useQuery({
    queryKey: mockQueryKeys.admin.investments,
    queryFn: async () => {
      await mockNetworkDelay();
      return adminInvestmentsMock;
    },
  });
}

export function useMockAdminTransactions() {
  return useQuery({
    queryKey: mockQueryKeys.admin.transactions,
    queryFn: async () => {
      await mockNetworkDelay();
      return adminTransactionsMock;
    },
  });
}

export function useMockAdminWithdrawals() {
  return useQuery({
    queryKey: mockQueryKeys.admin.withdrawals,
    queryFn: async () => {
      await mockNetworkDelay();
      return adminWithdrawalsMock;
    },
  });
}
