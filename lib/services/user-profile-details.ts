import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";

export interface UserProfileDetails {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  country: string | null;
  dateOfBirth: Date | null;
  organization: string | null;
  onboardingCompletedAt: Date | null;
}

export async function getMyProfileDetails(): Promise<ApiResult<UserProfileDetails>> {
  const { data } = await httpClient.get<ApiResult<UserProfileDetails>>("/profile");
  return data;
}
