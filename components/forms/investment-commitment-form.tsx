"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userInvestmentQueryKeys } from "@/lib/query-keys/admin";
import { currencyMinorExponent } from "@/lib/services/exchange-rate";
import { createMyInvestment } from "@/lib/services/user-investments";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";
import type { UserCreateInvestmentBody } from "@/lib/validations/user-investment";
import { investmentCommitmentSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof investmentCommitmentSchema>;

const textareaClass = cn(
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45",
);

const currencyFlagLabel: Record<
  (typeof investmentCurrencyCodes)[number],
  string
> = {
  USD: "🇺🇸 USD",
  XAF: "🇨🇲 XAF",
  EUR: "🇪🇺 EUR",
  GBP: "🇬🇧 GBP",
  NGN: "🇳🇬 NGN",
  GHS: "🇬🇭 GHS",
  KES: "🇰🇪 KES",
  ZAR: "🇿🇦 ZAR",
  CAD: "🇨🇦 CAD",
  JPY: "🇯🇵 JPY",
  CNY: "🇨🇳 CNY",
};

type InvestmentCommitmentFormProps = {
  className?: string;
  /** When set with lockSlug, slug field is hidden and prefilled. */
  slug?: string;
  lockSlug?: boolean;
  redirectAfterSuccess?: string;
};

export function InvestmentCommitmentForm({
  className,
  slug,
  lockSlug,
  redirectAfterSuccess = "/dashboard/investments",
}: InvestmentCommitmentFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const form = useForm<Values>({
    resolver: zodResolver(investmentCommitmentSchema) as any,
    defaultValues: {
      listingSlug: slug ?? "",
      amount: 10000,
      currency: "XAF",
      paymentMethod: "MOBILE_MONEY",
      note: "",
    },
  });
  const { setValue } = form;
  const selectedCurrency =
    useWatch({ control: form.control, name: "currency" }) ?? "XAF";
  const paymentMethod =
    useWatch({ control: form.control, name: "paymentMethod" }) ??
    "MOBILE_MONEY";
  const selectedExponent = currencyMinorExponent(selectedCurrency);

  useEffect(() => {
    if (slug && lockSlug) {
      setValue("listingSlug", slug, { shouldValidate: true });
    }
  }, [slug, lockSlug, setValue]);
  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      const body: UserCreateInvestmentBody = {
        campaignRef: values.listingSlug.trim(),
        amount: Math.round(
          values.amount * 10 ** currencyMinorExponent(values.currency),
        ),
        sourceCurrency: values.currency,
        paymentMethod: values.paymentMethod,
        note: values.note?.trim() || undefined,
      };
      return createMyInvestment(body);
    },
    onSuccess: async (res, values) => {
      if (!("ok" in res) || !res.ok) {
        toast.error(res.error?.message ?? "Failed to submit commitment");
        return;
      }
      toast.success("Investment commitment submitted", {
        description: `${values.listingSlug} · ${values.amount.toLocaleString()} ${values.currency}`,
      });
      const slugVal = slug && lockSlug ? slug : "";
      form.reset({
        listingSlug: slugVal,
        amount: 10000,
        currency: "XAF",
        paymentMethod: "MOBILE_MONEY",
        note: "",
      });
      await qc.invalidateQueries({ queryKey: userInvestmentQueryKeys.list() });
      await qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      router.push(redirectAfterSuccess);
    },
    onError: () => toast.error("Failed to submit commitment"),
  });

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      {!lockSlug ? (
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="inv-slug">Listing slug or ID</Label>
          <Input
            id="inv-slug"
            placeholder="e.g. solar-clinics"
            {...form.register("listingSlug")}
          />
          {form.formState.errors.listingSlug && (
            <p className="text-xs text-destructive">
              {form.formState.errors.listingSlug.message}
            </p>
          )}
        </div>
      ) : (
        <input type="hidden" {...form.register("listingSlug")} />
      )}
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="inv-amount">Amount</Label>
          <Input
            id="inv-amount"
            type="number"
            step={selectedExponent === 0 ? "1" : "0.01"}
            min={selectedExponent === 0 ? 1 : 0.01}
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <p className="text-xs text-destructive">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <Label>Currency</Label>
          <Select
            value={selectedCurrency}
            onValueChange={(v) =>
              form.setValue("currency", v as Values["currency"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {investmentCurrencyCodes.map((code) => (
                <SelectItem key={code} value={code}>
                  {currencyFlagLabel[code]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label>Payment method</Label>
        <Select
          value={paymentMethod}
          onValueChange={(v) =>
            form.setValue("paymentMethod", v as Values["paymentMethod"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
            <SelectItem value="ORANGE_MONEY">Orange Money</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="inv-note">Note (optional)</Label>
        <textarea
          id="inv-note"
          className={textareaClass}
          placeholder="Risk notes, questions…"
          {...form.register("note")}
        />
      </div>
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || mutation.isPending}
      >
        {mutation.isPending ? "Submitting..." : "Invest now"}
      </Button>
    </form>
  );
}
