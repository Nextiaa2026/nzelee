import { VerifyEmailOtpForm } from "@/components/verify-email-otp-form";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function RegisterVerificationSentPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const displayEmail = email?.trim() ?? null;

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <p className="text-sm text-muted-foreground">
        We&apos;ve sent a 6-digit verification code to the address you used to sign
        up. Enter it below to confirm your account before you sign in.
      </p>

      <p className="text-sm text-muted-foreground">
        Didn&apos;t get it? Check spam, then use{" "}
        <span className="font-medium text-foreground">Resend code</span> in the form
        below, or{" "}
        <span className="font-medium text-foreground">Resend verification</span> on
        the sign-in page with the same email.
      </p>

      <VerifyEmailOtpForm initialEmail={displayEmail} />
    </div>
  );
}
