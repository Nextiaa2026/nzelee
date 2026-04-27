"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ResetPasswordForm } from "@/components/reset-password-form";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] w-full items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
