"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileSettingsSchema } from "@/lib/validations/marketing-forms";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "@/hooks/use-profile";

type Values = z.infer<typeof profileSettingsSchema>;

export function ProfileSettingsForm({
  className,
  defaultName,
  defaultOrganization,
  defaultCountry,
  defaultDateOfBirth,
  email,
}: {
  className?: string;
  defaultName: string;
  defaultOrganization: string;
  defaultCountry: string;
  defaultDateOfBirth: string;
  email: string;
}) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const form = useForm<Values>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: defaultName,
      organization: defaultOrganization,
      country: defaultCountry,
      dateOfBirth: defaultDateOfBirth,
    },
  });

  return (
    <form
      className={cn("max-w-md space-y-4", className)}
      onSubmit={form.handleSubmit((values) => {
        updateProfile.mutate(values, {
          onSuccess: () => {
            toast.success("Profile updated");
            router.refresh();
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Could not save",
            );
          },
        });
      })}
    >
      <div className="space-y-1.5 sm:space-y-2">
        <Label>Email</Label>
        <Input value={email} disabled readOnly className="bg-muted/50" />
        <p className="text-xs text-muted-foreground">
          Email changes are not available here.
        </p>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-name">Display name</Label>
        <Input
          id="prof-name"
          {...form.register("displayName")}
          autoComplete="name"
        />
        {form.formState.errors.displayName && (
          <p className="text-xs text-destructive">
            {form.formState.errors.displayName.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-org">Organization (optional)</Label>
        <Input id="prof-org" {...form.register("organization")} />
        {form.formState.errors.organization && (
          <p className="text-xs text-destructive">
            {form.formState.errors.organization.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-country">Country (ISO-2, optional)</Label>
        <Input
          id="prof-country"
          {...form.register("country")}
          placeholder="US"
          maxLength={2}
          className="uppercase"
        />
        {form.formState.errors.country && (
          <p className="text-xs text-destructive">
            {form.formState.errors.country.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-dob">Date of birth (optional)</Label>
        <Input id="prof-dob" type="date" {...form.register("dateOfBirth")} />
        {form.formState.errors.dateOfBirth && (
          <p className="text-xs text-destructive">
            {form.formState.errors.dateOfBirth.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
