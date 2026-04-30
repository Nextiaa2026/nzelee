import { useState, useEffect, useCallback, useRef } from "react";

export interface PaymentStatus {
  status: "pending" | "complete" | "failed" | "cancelled";
  transactionId: string;
  amount: number;
  currency: string;
  completedAt?: string;
}

export interface UsePaymentStatusReturn {
  status: PaymentStatus | null;
  loading: boolean;
  error: string | null;
  checkStatus: (reference: string) => Promise<void>;
  startPolling: (reference: string, interval?: number) => void;
  stopPolling: () => void;
}

export function usePaymentStatus(): UsePaymentStatusReturn {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const checkStatus = useCallback(async (reference: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/payments/notchpay/${reference}/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check payment status");
      }

      if (data.status === "success" && data.data) {
        setStatus(data.data);
        retryCountRef.current = 0; // Reset retry count on success
      } else {
        throw new Error("Invalid response from payment service");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

      // Implement retry logic for network failures
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        console.warn(
          `Payment status check failed, retrying (${retryCountRef.current}/${maxRetries})...`,
        );
        // Retry after a delay
        setTimeout(() => checkStatus(reference), 2000 * retryCountRef.current);
      } else {
        setError(errorMessage);
        retryCountRef.current = 0;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const startPolling = useCallback(
    (reference: string, interval: number = 5000) => {
      // Clear any existing polling
      stopPolling();

      // Initial check
      checkStatus(reference);

      // Start polling
      pollingIntervalRef.current = setInterval(() => {
        checkStatus(reference);
      }, interval);
    },
    [checkStatus],
  );

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Auto-stop polling when payment is complete or failed
  useEffect(() => {
    if (
      status &&
      (status.status === "complete" ||
        status.status === "failed" ||
        status.status === "cancelled")
    ) {
      stopPolling();
    }
  }, [status, stopPolling]);

  return {
    status,
    loading,
    error,
    checkStatus,
    startPolling,
    stopPolling,
  };
}
