import crypto from "crypto";
import axios from "axios";

export interface NotchPayConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  sandboxMode: boolean;
}

export interface InitializePaymentParams {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  email: string;
  customerName?: string;
  customerPhone?: string;
  callback_url?: string;
}

export interface NotchPayPayment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "complete" | "failed" | "cancelled";
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  payment_method?: string;
  description?: string;
  created_at: string;
  completed_at?: string;
}

export interface InitializePaymentResponse {
  status: string;
  message: string;
  code: number;
  transaction: NotchPayPayment;
  authorization_url: string;
}

export interface GetPaymentResponse {
  status: string;
  message: string;
  code: number;
  transaction: NotchPayPayment;
}

export class NotchPayService {
  private config: NotchPayConfig;

  constructor(config?: Partial<NotchPayConfig>) {
    const apiKeyFromEnv = process.env.NOTCHPAY_PUBLIC_KEY ?? "";
    const secretKeyFromEnv = process.env.NOTCHPAY_HASH_KEY ?? "";
    const baseUrlFromEnv =
      process.env.NOTCHPAY_ENDPOINT ?? "https://api.notchpay.co";
    const sandboxModeFromEnv = process.env.NOTCHPAY_PUBLIC_KEY ?? "";

    this.config = {
      apiKey: config?.apiKey ?? apiKeyFromEnv,
      secretKey: config?.secretKey ?? secretKeyFromEnv,
      baseUrl: config?.baseUrl ?? baseUrlFromEnv,
      sandboxMode: config?.sandboxMode ?? sandboxModeFromEnv.includes("_test."),
    };

    if (!this.config.apiKey || !this.config.secretKey) {
      throw new Error("Notch Pay public key and hash key are required");
    }
  }

  /**
   * Build HTTP headers with authentication
   */
  private buildHeaders(): Record<string, string> {
    return {
      Authorization: this.config.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Construct URL for Notch Pay API endpoints
   */
  private buildUrl(path: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");
    return `${baseUrl}/${cleanPath}`;
  }

  /**
   * Initialize a payment with Notch Pay
   */
  async initializePayment(
    params: InitializePaymentParams,
  ): Promise<InitializePaymentResponse> {
    const url = this.buildUrl("/payments");

    try {
      const { data } = await axios.post<InitializePaymentResponse>(
        url,
        {
          amount: params.amount,
          currency: params.currency,
          reference: params.reference,
          description: params.description,
          customer: {
            name: params.customerName ?? "Investor",
            email: params.email,
            ...(params.customerPhone ? { phone: params.customerPhone } : {}),
          },
          callback: params.callback_url,
        },
        { headers: this.buildHeaders() },
      );
      return data;
    } catch (error) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      throw new Error(
        `Notch Pay API error: ${err.response?.status ?? 500} - ${err.response?.data?.message ?? "Unknown error"}`,
      );
    }
  }

  /**
   * Get payment status from Notch Pay
   */
  async getPaymentStatus(reference: string): Promise<GetPaymentResponse> {
    const url = this.buildUrl(`/payments/${reference}`);

    try {
      const { data } = await axios.get<GetPaymentResponse>(url, {
        headers: this.buildHeaders(),
      });
      return data;
    } catch (error) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      throw new Error(
        `Notch Pay API error: ${err.response?.status ?? 500} - ${err.response?.data?.message ?? "Unknown error"}`,
      );
    }
  }

  /**
   * Cancel a payment on Notch Pay
   */
  async cancelPayment(
    reference: string,
  ): Promise<{ success: boolean; message: string }> {
    const url = this.buildUrl(`/payments/${reference}`);

    try {
      const { data } = await axios.delete<{ message?: string }>(url, {
        headers: this.buildHeaders(),
      });
      return {
        success: true,
        message: data.message ?? "Payment cancelled successfully",
      };
    } catch (error) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      throw new Error(
        `Notch Pay API error: ${err.response?.status ?? 500} - ${err.response?.data?.message ?? "Unknown error"}`,
      );
    }
  }

  /**
   * Validate webhook signature using HMAC
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", this.config.secretKey)
      .update(payload)
      .digest("hex");

    const sig = signature.trim();
    if (!sig) {
      return false;
    }

    try {
      // Preferred path: Notch sends a hex digest.
      if (
        /^[a-f0-9]+$/i.test(sig) &&
        sig.length === expectedSignature.length &&
        crypto.timingSafeEqual(
          Buffer.from(sig.toLowerCase(), "hex"),
          Buffer.from(expectedSignature, "hex"),
        )
      ) {
        return true;
      }

      // Compatibility path for integrations that compare as plain UTF-8.
      if (
        sig.length === expectedSignature.length &&
        crypto.timingSafeEqual(
          Buffer.from(sig, "utf8"),
          Buffer.from(expectedSignature, "utf8"),
        )
      ) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Check if service is in sandbox mode
   */
  isSandboxMode(): boolean {
    return this.config.sandboxMode;
  }
}
