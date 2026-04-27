"use client";

import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { httpClient } from "@/lib/http/client";

type MutationOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  "mutationFn"
>;

/**
 * Full `useMutation` control: you supply `mutationFn` (often using `httpClient`).
 * Spread **your** `onSuccess` / `onSettled` / etc. here and run `invalidateQueries` there.
 */
export function useApiMutation<
  TData = unknown,
  TVariables = void,
  TError = AxiosError,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TError, TVariables, TContext>,
) {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn,
  });
}

/** POST — passes all mutation options through; no built-in invalidation. */
export function useApiPostMutation<
  TData = unknown,
  TBody = unknown,
  TError = AxiosError,
  TContext = unknown,
>(
  url: string | ((body: TBody) => string),
  options?: MutationOptions<TData, TError, TBody, TContext>,
) {
  return useMutation<TData, TError, TBody, TContext>({
    ...options,
    mutationFn: async (body) => {
      const resolvedUrl = typeof url === "function" ? url(body) : url;
      const { data } = await httpClient.post<TData>(resolvedUrl, body);
      return data;
    },
  });
}

/** PUT */
export function useApiPutMutation<
  TData = unknown,
  TBody = unknown,
  TError = AxiosError,
  TContext = unknown,
>(
  url: string | ((body: TBody) => string),
  options?: MutationOptions<TData, TError, TBody, TContext>,
) {
  return useMutation<TData, TError, TBody, TContext>({
    ...options,
    mutationFn: async (body) => {
      const resolvedUrl = typeof url === "function" ? url(body) : url;
      const { data } = await httpClient.put<TData>(resolvedUrl, body);
      return data;
    },
  });
}

/** PATCH */
export function useApiPatchMutation<
  TData = unknown,
  TBody = unknown,
  TError = AxiosError,
  TContext = unknown,
>(
  url: string | ((body: TBody) => string),
  options?: MutationOptions<TData, TError, TBody, TContext>,
) {
  return useMutation<TData, TError, TBody, TContext>({
    ...options,
    mutationFn: async (body) => {
      const resolvedUrl = typeof url === "function" ? url(body) : url;
      const { data } = await httpClient.patch<TData>(resolvedUrl, body);
      return data;
    },
  });
}

/** DELETE — variables can carry query params via URL builder. */
export function useApiDeleteMutation<
  TData = unknown,
  TVariables = void,
  TError = AxiosError,
  TContext = unknown,
>(
  url: string | ((vars: TVariables) => string),
  axiosConfig?: Omit<AxiosRequestConfig, "url" | "method" | "data">,
  options?: MutationOptions<TData, TError, TVariables, TContext>,
) {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables) => {
      const resolvedUrl =
        typeof url === "function" ? url(variables) : url;
      const { data } = await httpClient.delete<TData>(resolvedUrl, axiosConfig);
      return data;
    },
  });
}
