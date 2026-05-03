"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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
import { isApiSuccess } from "@/lib/http/api-result";
import { createMyWithdrawal } from "@/lib/services/user-withdrawals";
import { withdrawalRequestSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof withdrawalRequestSchema>;

const textareaClass = cn(
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45",
);

const DEFAULT_FORM_ID = "withdrawal-request-form";

function destinationLabel(destination: Values["destination"]) {
  return destination === "bank" ? "Compte bancaire lié" : "Portefeuille numérique";
}

export function WithdrawalRequestForm({
  className,
  onSuccess,
  formId = DEFAULT_FORM_ID,
  submitPlacement = "in-form",
  onPendingChange,
}: {
  className?: string;
  onSuccess?: () => void;
  formId?: string;
  submitPlacement?: "in-form" | "footer";
  /** For footer submit: disable external primary while the request runs. */
  onPendingChange?: (pending: boolean) => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(withdrawalRequestSchema),
    defaultValues: { amount: 100, destination: "bank", note: "" },
  });

  const mut = useMutation({
    mutationFn: createMyWithdrawal,
  });

  return (
    <form
      id={formId}
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit(async (values) => {
        onPendingChange?.(true);
        try {
          const amountCents = Math.round(values.amount * 100);
          const res = await mut.mutateAsync({
            amount: amountCents,
            currency: "USD",
            destination: destinationLabel(values.destination),
            note: values.note?.trim() || undefined,
          });
          if (!isApiSuccess(res)) {
            toast.error(res.error.message);
            return;
          }
          toast.success("Demande de retrait soumise", {
            description: "Elle restera en attente jusqu'à ce qu'un administrateur l'approuve ou la rejette.",
          });
          form.reset({ amount: 100, destination: "bank", note: "" });
          onSuccess?.();
        } catch {
          toast.error("La demande a échoué. Réessayez.");
        } finally {
          onPendingChange?.(false);
        }
      })}
    >
      <p className="text-xs text-muted-foreground">
        Les montants sont examinés par un administrateur uniquement. Vous ne pouvez pas approuver votre propre retrait.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="wd-amount">Montant (USD)</Label>
          <Input
            id="wd-amount"
            type="number"
            step="0.01"
            min={0.01}
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <Label>Destination</Label>
          <Select
            value={form.watch("destination")}
            onValueChange={(v) =>
              form.setValue("destination", v as Values["destination"], { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Où envoyer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Compte bancaire lié</SelectItem>
              <SelectItem value="wallet">Portefeuille numérique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="wd-note">Note (optionnel)</Label>
        <textarea id="wd-note" className={textareaClass} {...form.register("note")} />
      </div>
      {submitPlacement === "in-form" ? (
        <Button type="submit" disabled={form.formState.isSubmitting || mut.isPending}>
          Demander le retrait
        </Button>
      ) : null}
    </form>
  );
}
