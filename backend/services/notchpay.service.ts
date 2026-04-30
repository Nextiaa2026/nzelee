import crypto from "crypto";

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
  callback_url?: string;
}

export interface NotchPayPayment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "complete" | "failed" | "cancelled";
  customer?: string;
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
    this.config = {
      apiKey: config?.apiKey ?? process.env.NOTCHPAY_API_KEY ?? "",
      secretKey: config?.secretKey ?? process.env.NOTCHPAY_SECRET_KEY ?? "",
      baseUrl:
        config?.baseUrl ??
        process.env.NOTCHPAY_BASE_URL ??
        "https://api.notchpay.co",
      sandboxMode:
        config?.sandboxMode ?? process.env.NOTCHPAY_SANDBOX_MODE === "true",
    };

    if (!this.config.apiKey || !this.config.secretKey) {
      throw new Error("Notch Pay API key and secret key are required");
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

    const response = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        reference: params.reference,
        description: params.description,
        email: params.email,
        callback: params.callback_url,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Notch Pay API error: ${response.status} - ${errorData.message ?? "Unknown error"}`,
      );
    }

    const data = await response.json();
    return data as InitializePaymentResponse;
  }

  /**
   * Get payment status from Notch Pay
   */
  async getPaymentStatus(reference: string): Promise<GetPaymentResponse> {
    const url = this.buildUrl(`/payments/${reference}`);

    const response = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Notch Pay API error: ${response.status} - ${errorData.message ?? "Unknown error"}`,
      );
    }

    const data = await response.json();
    return data as GetPaymentResponse;
  }

  /**
   * Cancel a payment on Notch Pay
   */
  async cancelPayment(
    reference: string,
  ): Promise<{ success: boolean; message: string }> {
    const url = this.buildUrl(`/payments/${reference}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Notch Pay API error: ${response.status} - ${errorData.message ?? "Unknown error"}`,
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message ?? "Payment cancelled successfully",
    };
  }

  /**
   * Validate webhook signature using HMAC
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", this.config.secretKey)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  /**
   * Check if service is in sandbox mode
   */
  isSandboxMode(): boolean {
    return this.config.sandboxMode;
  }
}
