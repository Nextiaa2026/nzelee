"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { httpClient } from "@/lib/http/client";

type ApiQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>;

/**
 * GET helper: `queryFn` uses Axios; pass any `useQuery` option (staleTime, enabled, etc.).
 * Call `queryClient.invalidateQueries` from your component when mutations succeed.
 */
export function useApiQuery<
  TQueryFnData = unknown,
  TError = AxiosError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  url: string,
  axiosConfig?: Omit<AxiosRequestConfig, "url" | "method">,
  queryOptions?: ApiQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...queryOptions,
    queryKey,
    queryFn: async ({ signal }) => {
      const { data } = await httpClient.get<TQueryFnData>(url, {
        ...axiosConfig,
        signal,
      });
      return data;
    },
  });
}
