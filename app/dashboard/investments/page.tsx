"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { InvestorInvestmentsTable } from "@/components/dashboard/tables/investor-investments-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { useUserInvestments } from "@/hooks/use-user-investments";
import {
  verifyNotchPaymentStatus,
} from "@/lib/services/user-investments";

export default function DashboardInvestmentsPage() {
  const { data, isPending, isError, refetch } = useUserInvestments();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackToastDone = useRef(false);

  useEffect(() => {
    if (searchParams.get("payment") !== "callback" || callbackToastDone.current) {
      return;
    }
    callbackToastDone.current = true;
    const candidates = [
      searchParams.get("reference"),
      searchParams.get("trxref"),
      searchParams.get("notchpay_trxref"),
      searchParams.get("transaction_ref"),
    ].filter((v): v is string => Boolean(v && v.trim()));

    if (candidates.length === 0) {
      toast.warning("Retour de paiement reçu sans référence.");
      void refetch();
      router.replace("/dashboard/investments");
      return;
    }
    void (async () => {
      const ordered = [
        ...candidates.filter((r) => r.startsWith("trx.")),
        ...candidates.filter((r) => !r.startsWith("trx.")),
      ];

      let result: Awaited<ReturnType<typeof verifyNotchPaymentStatus>> | null = null;
      for (const ref of ordered) {
        const attempt = await verifyNotchPaymentStatus(ref);
        if (attempt.ok || attempt.error.code !== "NOT_FOUND") {
          result = attempt;
          break;
        }
      }
      if (!result) {
        result = {
          ok: false,
          error: { code: "NOT_FOUND", message: "Transaction not found" },
        };
      }

      if (!result.ok) {
        toast.error("Impossible de vérifier le paiement.", {
          description: result.error.message,
        });
      } else if (result.data.status === "complete") {
        toast.success("Paiement confirmé.");
      } else if (
        result.data.status === "failed" ||
        result.data.status === "cancelled"
      ) {
        toast.error("Paiement échoué ou annulé. Vous pouvez réessayer.");
      } else {
        toast.message("Paiement en cours de confirmation.");
      }
      await refetch();
      router.replace("/dashboard/investments");
    })();
  }, [searchParams, refetch, router]);

  return (
    <DashboardPageShell
      eyebrow="Portefeuille"
      title="Investissements"
      description="Vos engagements à travers les campagnes actives dans votre compte."
      actions={
        <Button className="shrink-0 bg-mint text-mint-foreground hover:bg-mint/90" asChild>
          <Link href="/campaigns">Nouvel investissement</Link>
        </Button>
      }
    >
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorInvestmentsTable data={data} /> : null}
    </DashboardPageShell>
  );
}
