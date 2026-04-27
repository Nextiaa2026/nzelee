export default function VerifyEmailPage() {
  return (
    <div className="flex w-full flex-col gap-4 text-left">
      <p className="text-sm text-muted-foreground">
        Email verification uses a 6-digit code instead of a magic link. Open the
        message we sent you, or request a new code from the sign-in page with the
        same email.
      </p>
    </div>
  );
}
