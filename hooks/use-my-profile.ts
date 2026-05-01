"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiSuccess } from "@/lib/http/api-result";
import { userQueryKeys } from "@/lib/query-keys/user";
import { getMyProfileDetails } from "@/lib/services/user-profile-details";

export function useMyProfile() {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: async () => {
      const r = await getMyProfileDetails();
      if (!isApiSuccess(r)) {
        throw new Error(r.error?.message ?? "Failed to load profile");
      }
      return r.data;
    },
  });
}
