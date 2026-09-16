"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AuthGoogleButton,
  AuthOAuthDivider,
  authHeroCtaClassName,
} from "@/components/auth-social";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isApiSuccess, registerAccount } from "@/lib/services/auth";
import { getApiErrorMessage } from "@/lib/services/http-errors";
import { cn } from "@/lib/utils";
import { RegisterFormInput, registerFormSchema } from "@/lib/validations/auth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormInput) => {
    setSubmitError(null);

    try {
      const result = await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (!isApiSuccess(result)) {
        setSubmitError(result.error.message);
        toast.error(result.error.message);
        return;
      }
      if (result.data.devVerificationCode) {
        toast.success(`Dev: votre code est ${result.data.devVerificationCode}`);
      } else {
        toast.success("Code de vérification envoyé. Vérifiez votre boîte de réception.");
      }
      const q = new URLSearchParams({ email: values.email });
      router.push(`/register/verification-sent?${q.toString()}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Impossible de créer le compte.");
      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <div className="space-y-5">
        <AuthGoogleButton
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        />

        <AuthOAuthDivider />

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Jane Founder" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-3 pt-1 text-left">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="mt-0.5"
                  aria-invalid={errors.acceptTerms ? true : undefined}
                />
                <span className="text-[11px] leading-snug text-black/75 sm:text-xs md:text-[13px] dark:text-white/75">
                  J&apos;accepte les{" "}
                  <Link
                    href="/terms-of-service"
                    className="font-medium text-deep-green underline hover:opacity-90"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Conditions d&apos;utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-deep-green underline hover:opacity-90"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Politique de confidentialité
                  </Link>
                  .
                </span>
              </label>
            )}
          />
          {errors.acceptTerms ? (
            <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
          ) : null}

          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}

          <Button
            className={cn(authHeroCtaClassName)}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Création du compte..." : "Créer un compte"}
          </Button>
        </form>

      </div>
    </div>
  );
}
