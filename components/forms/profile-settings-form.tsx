"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileSettingsSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";

import { updateProfileSettings } from "@/app/dashboard/settings/actions";

type Values = z.infer<typeof profileSettingsSchema>;

export function ProfileSettingsForm({
  className,
  defaultName,
  defaultOrganization,
  email,
}: {
  className?: string;
  defaultName: string;
  defaultOrganization: string;
  email: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<Values>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: defaultName,
      organization: defaultOrganization,
    },
  });

  return (
    <form
      className={cn("max-w-md space-y-4", className)}
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          try {
            await updateProfileSettings(values);
            toast.success("Profile updated");
            router.refresh();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not save");
          }
        });
      })}
    >
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={email} disabled readOnly className="bg-muted/50" />
        <p className="text-xs text-muted-foreground">Email changes are not available here.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prof-name">Display name</Label>
        <Input id="prof-name" {...form.register("displayName")} autoComplete="name" />
        {form.formState.errors.displayName && (
          <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="prof-org">Organization (optional)</Label>
        <Input id="prof-org" {...form.register("organization")} />
        {form.formState.errors.organization && (
          <p className="text-xs text-destructive">{form.formState.errors.organization.message}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
