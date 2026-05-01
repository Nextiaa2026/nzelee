import type { InferSelectModel } from "drizzle-orm";
import { isAxiosError } from "axios";

import { campaigns, pledges } from "@/lib/db/schema";
import { isApiFailure, type ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import type { UserCreateInvestmentBody } from "@/lib/validations/user-investment";

type PledgeRow = InferSelectModel<typeof pledges>;
type CampaignRow = InferSelectModel<typeof campaigns>;

export type UserInvestmentListRow = Pick<
  PledgeRow,
  "id" | "campaignId" | "amount" | "status" | "createdAt"
> & {
  campaignTitle: CampaignRow["title"];
  campaignSlug: CampaignRow["slug"];
  currency: CampaignRow["currency"];
  paymentStatus: string | null;
  canOpenCheckout: boolean;
};

export type InvestmentNotchCheckout = {
  authorizationUrl: string;
  reference: string;
  paymentTransactionId: string;
  notchPayTransactionId: string;
};

export type UserCreateInvestmentResponse = {
  pledge: PledgeRow;
  notch: InvestmentNotchCheckout;
};

export type InvestmentRepayCheckoutResponse = {
  notch: InvestmentNotchCheckout;
};

export type VerifyNotchPaymentResponse = {
  status: string;
  transactionId: string;
  amount: number;
  currency: string;
  completedAt?: string;
};

export function buildInvestmentCheckoutCallbackUrl() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/dashboard/investments?payment=callback`;
}

export async function startInvestmentRepayCheckout(
  pledgeId: string,
  callbackUrl?: string,
): Promise<ApiResult<InvestmentRepayCheckoutResponse>> {
  const { data } = await httpClient.post<ApiResult<InvestmentRepayCheckoutResponse>>(
    `/investments/${pledgeId}/checkout`,
    { callbackUrl: callbackUrl ?? buildInvestmentCheckoutCallbackUrl() },
  );
  return data;
}

export async function listMyInvestments(): Promise<ApiResult<UserInvestmentListRow[]>> {
  const { data } = await httpClient.get<ApiResult<UserInvestmentListRow[]>>("/investments");
  return data;
}

export async function verifyNotchPaymentStatus(
  reference: string,
): Promise<ApiResult<VerifyNotchPaymentResponse>> {
  try {
    const { data } = await httpClient.get<ApiResult<VerifyNotchPaymentResponse>>(
      `/payments/notchpay/${encodeURIComponent(reference)}/status`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data && isApiFailure(error.response.data)) {
      return error.response.data;
    }
    return {
      ok: false,
      error: {
        code: "NETWORK",
        message: "Unable to verify payment status right now.",
      },
    };
  }
}

export async function createMyInvestment(
  body: UserCreateInvestmentBody,
): Promise<ApiResult<UserCreateInvestmentResponse>> {
  const { data } = await httpClient.post<ApiResult<UserCreateInvestmentResponse>>(
    "/investments",
    body,
  );
  return data;
}
