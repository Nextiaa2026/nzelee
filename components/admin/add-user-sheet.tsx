"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  role: z.enum(["USER", "CREATOR", "ADMIN"]),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddUserSheet({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      password: "",
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = form;
  const currentRole = watch("role");

  async function onSubmit(values: FormValues) {
    setIsPending(true);
    try {
      const response = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Une erreur est survenue");
      }

      toast.success("Utilisateur créé avec succès");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-white">
        <SheetHeader>
          <SheetTitle>Nouvel utilisateur</SheetTitle>
          <SheetDescription>
            Créez un nouveau compte utilisateur manuellement.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="user-name">Nom complet</Label>
            <Input id="user-name" placeholder="Jean Dupont" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" placeholder="jean@exemple.com" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <Select 
              value={currentRole} 
              onValueChange={(val) => setValue("role", val as "USER" | "CREATOR" | "ADMIN", { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="USER">Utilisateur (USER)</SelectItem>
                <SelectItem value="CREATOR">Créateur (CREATOR)</SelectItem>
                <SelectItem value="ADMIN">Administrateur (ADMIN)</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password">Mot de passe</Label>
            <Input id="user-password" placeholder="••••••••" type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending} className="bg-mint text-mint-foreground hover:bg-mint/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer l&apos;utilisateur
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

