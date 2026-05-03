"use client";

import * as React from "react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { Camera, Loader2 } from "lucide-react";

type Values = z.infer<typeof profileSettingsSchema>;

export function ProfileSettingsForm({
  className,
  defaultName,
  defaultOrganization,
  defaultCountry,
  defaultDateOfBirth,
  defaultImage,
  email,
}: {
  className?: string;
  defaultName: string;
  defaultOrganization: string;
  defaultCountry: string;
  defaultDateOfBirth: string;
  defaultImage: string;
  email: string;
}) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: defaultName,
      organization: defaultOrganization,
      country: defaultCountry,
      dateOfBirth: defaultDateOfBirth,
      image: defaultImage,
      email: email,
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image trop volumineuse (max 2Mo)");
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Échec du téléchargement de l'image");
      }

      const data = await res.json();
      if (data.url) {
        form.setValue("image", data.url, { shouldDirty: true });
        toast.success("Image de profil mise à jour localement. Enregistrez les modifications pour les appliquer.");
      }
    } catch {
      toast.error("Échec du téléchargement de l'image de profil");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <form
      className={cn("max-w-md space-y-4", className)}
      onSubmit={form.handleSubmit((values) => {
        updateProfile.mutate(values, {
          onSuccess: () => {
            toast.success("Profil mis à jour");
            router.refresh();
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Impossible d'enregistrer",
            );
          },
        });
      })}
    >
      <div className="flex items-center gap-6 pb-2">
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-muted shadow-sm">
            <AvatarImage src={form.watch("image") || undefined} />
            <AvatarFallback className="text-2xl">
              {defaultName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            {uploadingAvatar ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
          </label>
        </div>
        <div className="text-sm">
          <p className="font-medium">Image de profil</p>
          <p className="text-muted-foreground text-xs mt-1 max-w-[200px]">
            Cliquez sur l&apos;image pour télécharger un nouvel avatar. JPG, PNG ou WEBP (max 2Mo).
          </p>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label>Email</Label>
        <Input {...form.register("email")} disabled readOnly className="bg-muted/50" />
        <p className="text-xs text-muted-foreground">
          La modification de l&apos;email n&apos;est pas disponible ici.
        </p>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-name">Nom d&apos;affichage</Label>
        <Input
          id="prof-name"
          {...form.register("displayName")}
          autoComplete="name"
          className="h-12 rounded-2xl bg-black/5 border-0 focus-visible:ring-deep-green/20 px-5"
        />
        {form.formState.errors.displayName && (
          <p className="text-xs font-medium text-red-500 px-1">
            {form.formState.errors.displayName.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-org">Organisation (optionnel)</Label>
        <Input 
          id="prof-org" 
          {...form.register("organization")} 
          className="h-12 rounded-2xl bg-black/5 border-0 focus-visible:ring-deep-green/20 px-5"
        />
        {form.formState.errors.organization && (
          <p className="text-xs font-medium text-red-500 px-1">
            {form.formState.errors.organization.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-country">Pays (ISO-2, optionnel)</Label>
        <Input
          id="prof-country"
          {...form.register("country")}
          placeholder="US"
          maxLength={2}
          className="h-12 rounded-2xl bg-black/5 border-0 focus-visible:ring-deep-green/20 px-5 uppercase"
        />
        {form.formState.errors.country && (
          <p className="text-xs font-medium text-red-500 px-1">
            {form.formState.errors.country.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="prof-dob">Date de naissance (optionnel)</Label>
        {(() => {
          const dob = form.watch("dateOfBirth");
          return (
            <DatePicker
              date={dob ? new Date(dob) : undefined}
              onDateChange={(date) =>
                form.setValue("dateOfBirth", date ? date.toISOString().slice(0, 10) : "", {
                  shouldDirty: true,
                })
              }
              className="h-12 rounded-2xl bg-black/5 border-0 focus-visible:ring-deep-green/20 px-5"
              placeholder="Choisir une date"
            />
          );
        })()}
        {form.formState.errors.dateOfBirth && (
          <p className="text-xs font-medium text-red-500 px-1">
            {form.formState.errors.dateOfBirth.message}
          </p>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={updateProfile.isPending}
        className="w-full h-12 rounded-2xl bg-deep-green font-bold text-white shadow-lg shadow-deep-green/10 hover:bg-deep-green/90 active:scale-95 transition-all"
      >
        {updateProfile.isPending ? "Enregistrement…" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
