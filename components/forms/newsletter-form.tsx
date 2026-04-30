"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterFormSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof newsletterFormSchema>;

export function NewsletterForm({
  className,
  compact,
}: {
  className?: string;
  /** Single-row layout for footer. */
  compact?: boolean;
}) {
  const fieldId = useId();
  const form = useForm<Values>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "" },
  });

  if (compact) {
    return (
      <form
        className={cn("flex flex-col gap-2 sm:flex-row sm:items-end", className)}
        onSubmit={form.handleSubmit((values) => {
          toast.success("You are on the list.", { description: values.email });
          form.reset();
        })}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <label htmlFor={`${fieldId}-email`} className="text-xs font-medium text-zinc-600">
            Email
          </label>
          <Input
            id={`${fieldId}-email`}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            className="bg-white"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="shrink-0 sm:mb-0.5" disabled={form.formState.isSubmitting}>
          Subscribe
        </Button>
      </form>
    );
  }

  return (
    <form
      className={cn("space-y-3", className)}
      onSubmit={form.handleSubmit((values) => {
        toast.success("Subscribed", { description: values.email });
        form.reset();
      })}
    >
      <div className="space-y-1.5 sm:space-y-2">
        <Input
          id={`${fieldId}-inline`}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
        Subscribe
      </Button>
    </form>
  );
}
