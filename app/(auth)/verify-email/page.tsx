export default function VerifyEmailPage() {
  return (
    <div className="flex w-full flex-col gap-4 text-left">
      <p className="text-sm text-black/65">
        Enter the 6-digit code from your email. Need a new one? Use{" "}
        <span className="font-medium text-black">Resend verification</span> on sign-in with the same
        address.
      </p>
    </div>
  );
}
