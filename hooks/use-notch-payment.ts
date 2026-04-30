import { useState } from "react";

export interface InitializePaymentParams {
  pledgeId: string;
  amount: number;
  currency: string;
  email?: string;
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

export function useNotchPayment(): UseNotchPaymentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const initializePayment = async (params: InitializePaymentParams) => {
    setLoading(true);
    setError(null);
    setPaymentData(null);

    try {
      const response = await fetch("/api/v1/payments/notchpay/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      if (data.status === "success" && data.data) {
        setPaymentData(data.data);
      } else {
        throw new Error("Invalid response from payment service");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    paymentData,
    initializePayment,
    clearError,
  };
}
