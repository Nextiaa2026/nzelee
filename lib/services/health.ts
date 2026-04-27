import { httpClient } from "@/lib/http/client";

export type HealthResponse = { ok: true };

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await httpClient.get<HealthResponse>("/health");
  return data;
}
