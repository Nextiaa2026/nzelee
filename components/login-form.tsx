"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AuthGoogleButton,
  AuthOAuthDivider,
  authHeroCtaClassName,
} from "@/components/auth-social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { isApiSuccess, resendVerificationEmail } from "@/lib/services/auth";
import { cn } from "@/lib/utils";
import { LoginInput, loginSchema } from "@/lib/validations/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const [unverifiedFromSubmit, setUnverifiedFromSubmit] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendPending, setResendPending] = useState(false);

  const verifiedBanner = searchParams.get("verified") === "1";
  const errorCode = searchParams.get("error");
  const prefilledEmail = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (prefilledEmail) {
      setValue("email", prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  const onSubmit = async (values: LoginInput) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    const dest = result?.url ?? "";
    if (dest.includes("error=unverified_email")) {
      setUnverifiedFromSubmit(true);
      toast.error(
        "Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception pour le code ou renvoyez-le ci-dessous.",
      );
      return;
    }

    if (result?.error) {
      toast.error("Email ou mot de passe invalide.");
      return;
    }

    if (dest) {
      window.location.assign(dest);
    } else {
      window.location.assign("/dashboard");
    }
  };

  async function onResend() {
    const email = prefilledEmail || getValues("email");
    if (!email?.trim()) {
      toast.error("Entrez votre email ci-dessus, puis renvoyez la vérification.");
      return;
    }
    setResendMessage(null);
    setResendPending(true);
    try {
      const out = await resendVerificationEmail({ email: email.trim() });
      if (isApiSuccess(out)) {
        const code = out.data.devVerificationCode;
        setResendMessage(
          code ? `${out.data.message} Dev code: ${code}` : out.data.message,
        );
      } else {
        setResendMessage(out.error.message);
      }
    } catch {
      setResendMessage("Impossible d&apos;envoyer l&apos;email. Réessayez plus tard.");
    } finally {
      setResendPending(false);
    }
  }

  const showResend =
    errorCode === "unverified_email" || unverifiedFromSubmit;

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <div className="space-y-5">
        {verifiedBanner ? (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-800 dark:text-emerald-200">
            Email vérifié. Vous pouvez vous connecter ci-dessous.
          </p>
        ) : null}
        {errorCode === "unverified_email" && !unverifiedFromSubmit ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-950 dark:text-amber-100">
            Vérifiez votre email pour continuer. Utilisez le code à 6 chiffres que nous vous avons envoyé, ou
            renvoyez-le ci-dessous.
          </p>
        ) : null}

        <AuthGoogleButton
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        />

        <AuthOAuthDivider />

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                className="shrink-0 text-[11px] font-medium text-deep-green/80 hover:text-deep-green hover:underline sm:text-xs"
                href="/forgot-password"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {resendMessage ? (
            <p className="text-sm text-black/55 dark:text-white/60">{resendMessage}</p>
          ) : null}

          <Button
            className={cn(authHeroCtaClassName)}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {showResend ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-full border-deep-green/20 bg-transparent hover:bg-mint/10"
            disabled={resendPending}
            onClick={() => void onResend()}
          >
            {resendPending ? "Envoi…" : "Renvoyer le code de vérification"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
