"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

import { authHeroCtaClassName } from "@/components/auth-social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  isApiSuccess,
  resendVerificationEmail,
  verifyEmailWithOtp,
} from "@/lib/services/auth";
import { cn } from "@/lib/utils";
import { verifyEmailOtpSchema } from "@/lib/validations/auth";

type Props = {
  initialEmail: string | null;
};

export function VerifyEmailOtpForm({ initialEmail }: Props) {
  const router = useRouter();
  const trimmedInitial = initialEmail?.trim() ?? "";
  const [email, setEmail] = useState(() =>
    trimmedInitial ? trimmedInitial.toLowerCase() : "",
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);

  async function submit(overrideCode?: string) {
    if (pending) return;
    setError(null);
    const effectiveCode = overrideCode ?? code;
    const parsed = verifyEmailOtpSchema.safeParse({ email, code: effectiveCode });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the code and email.");
      return;
    }
    setPending(true);
    try {
      const result = await verifyEmailWithOtp(parsed.data);
      if (!isApiSuccess(result)) {
        setError(result.error.message);
        return;
      }
      toast.success("Email verified. You can sign in.");
      router.push("/login?verified=1");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function onResend() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Enter your email first.");
      return;
    }
    setResendPending(true);
    try {
      const out = await resendVerificationEmail({ email: trimmed });
      if (isApiSuccess(out)) {
        const code = out.data.devVerificationCode;
        toast.success(
          code ? `${out.data.message} (dev code: ${code})` : out.data.message,
        );
      } else {
        toast.error(out.error.message);
      }
    } catch {
      toast.error("Could not resend. Try again later.");
    } finally {
      setResendPending(false);
    }
  }

  return (
    <div className="space-y-5">
      {!trimmedInitial ? (
        <div className="space-y-1.5 text-left sm:space-y-2">
          <Label htmlFor="verify-email">Email</Label>
          <Input
            id="verify-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      ) : (
        <p className="text-center text-sm text-black/65">
          Code sent to <span className="font-medium text-black">{trimmedInitial}</span>
        </p>
      )}

      <div className="space-y-1.5 sm:space-y-2">
        <Label className="block text-center">6-digit code</Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={setCode}
            disabled={pending}
            onComplete={(value) => void submit(value)}
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

      <Button
        type="button"
        className={cn(authHeroCtaClassName)}
        disabled={pending || code.length !== 6}
        onClick={() => void submit()}
      >
        {pending ? "Verifying…" : "Verify email"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-full border-deep-green/20 hover:bg-mint/10"
        disabled={resendPending}
        onClick={() => void onResend()}
      >
        {resendPending ? "Sending…" : "Resend code"}
      </Button>
    </div>
  );
}
