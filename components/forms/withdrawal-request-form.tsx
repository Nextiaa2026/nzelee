"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { withdrawalRequestSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof withdrawalRequestSchema>;

const textareaClass = cn(
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45",
);

export function WithdrawalRequestForm({ className }: { className?: string }) {
  const form = useForm<Values>({
    resolver: zodResolver(withdrawalRequestSchema),
    defaultValues: { amount: 100, destination: "bank", note: "" },
  });

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit((values) => {
        toast.success("Withdrawal request recorded (demo)", {
          description: `${values.destination} · $${values.amount.toFixed(2)}`,
        });
        form.reset({ amount: 100, destination: "bank", note: "" });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="wd-amount">Amount (USD)</Label>
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
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select
            value={form.watch("destination")}
            onValueChange={(v) =>
              form.setValue("destination", v as Values["destination"], { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Where to send" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Linked bank account</SelectItem>
              <SelectItem value="wallet">Digital wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="wd-note">Note (optional)</Label>
        <textarea id="wd-note" className={textareaClass} {...form.register("note")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Request withdrawal
      </Button>
    </form>
  );
}
