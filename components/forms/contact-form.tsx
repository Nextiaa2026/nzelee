"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactFormSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof contactFormSchema>;

const textareaClass = cn(
  "min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45",
);

export function ContactForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit(async (values) => {
        setLoading(true);
        try {
          const response = await fetch("/api/v1/tickets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || "Failed to submit message");
          }

          toast.success("Merci — nous reviendrons vers vous bientôt.", {
            description: `${values.name} · ${values.email}`,
          });
          form.reset();
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Échec de l&apos;envoi du message. Veuillez réessayer.",
          );
        } finally {
          setLoading(false);
        }
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="contact-name">Nom</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <textarea
          id="contact-message"
          className={textareaClass}
          {...form.register("message")}
        />
        {form.formState.errors.message && (
          <p className="text-xs text-destructive">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={loading || form.formState.isSubmitting}>
        {loading ? "Envoi..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
