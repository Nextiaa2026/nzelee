import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

function LoginFormFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
      Loading sign-in…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
