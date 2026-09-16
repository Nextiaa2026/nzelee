"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authHeroCtaClassName } from "@/components/auth-social";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { isApiSuccess, resetPassword } from "@/lib/services/auth";
import { getApiErrorMessage } from "@/lib/services/http-errors";
import { cn } from "@/lib/utils";
import { ResetPasswordInput, resetPasswordSchema } from "@/lib/validations/auth";

type ResetPasswordFormProps = React.ComponentProps<"div"> & {
  token: string;
};

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setSubmitError(null);
    setIsSuccess(false);
    setSuccessMessage(null);

    try {
      const result = await resetPassword(values);
      if (!isApiSuccess(result)) {
        setSubmitError(result.error.message);
        return;
      }
      setSuccessMessage(result.data.message);
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Impossible de réinitialiser le mot de passe."));
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" value={token} {...register("token")} />

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}
          {isSuccess && successMessage ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{successMessage}</p>
          ) : null}

          <Button
            className={cn(authHeroCtaClassName)}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>

      </div>
    </div>
  );
}
