"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isApiSuccess, registerAccount } from "@/lib/services/auth";
import { getApiErrorMessage } from "@/lib/services/http-errors";
import { cn } from "@/lib/utils";
import { RegisterInput, registerSchema } from "@/lib/validations/auth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setSubmitError(null);

    try {
      const result = await registerAccount(values);
      if (!isApiSuccess(result)) {
        setSubmitError(result.error.message);
        toast.error(result.error.message);
        return;
      }
      if (result.data.devVerificationCode) {
        toast.success(`Dev: your code is ${result.data.devVerificationCode}`);
      } else {
        toast.success("Verification code sent. Check your inbox.");
      }
      const q = new URLSearchParams({ email: values.email });
      router.push(`/register/verification-sent?${q.toString()}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Unable to create account.");
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
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Founder" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}

          <Button
            className={cn(authHeroCtaClassName)}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

      </div>
    </div>
  );
}
