"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { isApiFailure, isApiSuccess, type ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";

export interface InitializePaymentParams {
  pledgeId: string;
  callbackUrl?: string;
}

export interface PaymentData {
  transactionId: string;
  reference: string;
  authorizationUrl: string;
  paymentId: string;
}

export interface UseNotchPaymentReturn {
  loading: boolean;
  error: string | null;
  paymentData: PaymentData | null;
  initializePayment: (params: InitializePaymentParams) => Promise<void>;
  clearError: () => void;
}

async function postNotchInitialize(
  params: InitializePaymentParams,
): Promise<PaymentData> {
  try {
    const { data } = await httpClient.post<ApiResult<PaymentData>>(
      "/payments/notchpay/initialize",
      {
        pledgeId: params.pledgeId,
        callbackUrl: params.callbackUrl,
      },
    );

    if (!isApiSuccess(data)) {
      throw new Error(data.error?.message ?? "Failed to initialize payment");
    }

    if (!data.data.authorizationUrl) {
      throw new Error("Invalid response from payment service");
    }

    return data.data;
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response?.data && isApiFailure(err.response.data)) {
      throw new Error(err.response.data.error.message);
    }
    throw err instanceof Error ? err : new Error("Failed to initialize payment");
  }
}

/**
 * Notch Pay hosted checkout — initializes a session for an existing pledge.
 * Uses TanStack Query + axios (`httpClient`) like other app APIs.
 */
export function useNotchPayment(): UseNotchPaymentReturn {
  const mutation = useMutation({
    mutationFn: postNotchInitialize,
  });

  return {
    loading: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : String(mutation.error)
      : null,
    paymentData: mutation.data ?? null,
    initializePayment: async (params) => {
      mutation.reset();
      await mutation.mutateAsync(params);
    },
    clearError: () => {
      mutation.reset();
    },
  };
}
