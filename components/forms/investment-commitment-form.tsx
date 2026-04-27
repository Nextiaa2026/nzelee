"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { investmentCommitmentSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof investmentCommitmentSchema>;

const textareaClass = cn(
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45",
);

export function InvestmentCommitmentForm({ className }: { className?: string }) {
  const form = useForm<Values>({
    resolver: zodResolver(investmentCommitmentSchema),
    defaultValues: { listingSlug: "", amount: 100, note: "" },
  });

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit((values) => {
        toast.success("Commitment submitted (demo)", {
          description: `${values.listingSlug} · $${values.amount.toFixed(2)}`,
        });
        form.reset({ listingSlug: "", amount: 100, note: "" });
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="inv-slug">Listing slug or ID</Label>
        <Input id="inv-slug" placeholder="e.g. solar-clinics" {...form.register("listingSlug")} />
        {form.formState.errors.listingSlug && (
          <p className="text-xs text-destructive">{form.formState.errors.listingSlug.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="inv-amount">Amount (USD)</Label>
        <Input
          id="inv-amount"
          type="number"
          step="0.01"
          min={0.01}
          {...form.register("amount", { valueAsNumber: true })}
        />
        {form.formState.errors.amount && (
          <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="inv-note">Note (optional)</Label>
        <textarea id="inv-note" className={textareaClass} placeholder="Risk notes, questions…" {...form.register("note")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Submit interest
      </Button>
    </form>
  );
}
