"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authHeroCtaClassName } from "@/components/auth-social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isApiSuccess, requestPasswordReset } from "@/lib/services/auth";
import { getApiErrorMessage } from "@/lib/services/http-errors";
import { cn } from "@/lib/utils";
import { ForgotPasswordInput, forgotPasswordSchema } from "@/lib/validations/auth";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setSubmitError(null);
    setServerMessage(null);

    try {
      const result = await requestPasswordReset(values);
      if (!isApiSuccess(result)) {
        setSubmitError(result.error.message);
        return;
      }
      setServerMessage(result.data.message);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Impossible de traiter la demande."));
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}
          {serverMessage ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{serverMessage}</p>
          ) : null}

          <Button
            className={cn(authHeroCtaClassName)}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Génération..." : "Envoyer le lien de réinitialisation"}
          </Button>
        </form>

      </div>
    </div>
  );
}
