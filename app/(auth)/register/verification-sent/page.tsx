import { VerifyEmailOtpForm } from "@/components/verify-email-otp-form";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function RegisterVerificationSentPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const displayEmail = email?.trim() ?? null;

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <p className="text-sm text-black/65">
        We sent a 6-digit code to your email—enter it below to finish signup. Check spam, or use{" "}
        <span className="font-medium text-black">Resend code</span> here or{" "}
        <span className="font-medium text-black">Resend verification</span> on sign-in.
      </p>

      <VerifyEmailOtpForm initialEmail={displayEmail} />
    </div>
  );
}
