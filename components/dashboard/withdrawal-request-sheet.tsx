"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { WithdrawalRequestForm } from "@/components/forms/withdrawal-request-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userWalletQueryKeys } from "@/lib/query-keys/user-wallet";
import { userWithdrawalsQueryKeys } from "@/lib/query-keys/user-withdrawals";

const WITHDRAWAL_FORM_ID = "withdrawal-request-form";

export function WithdrawalRequestSheet() {
  const [open, setOpen] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <Button type="button" variant="default" onClick={() => setOpen(true)}>
        Demander un retrait
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-lg">
          <DialogHeader className="border-b px-6 py-4 text-left">
            <DialogTitle>Demander un retrait</DialogTitle>
            <DialogDescription>
              Soumettez une demande de paiement. Seul un administrateur peut
              l&apos;approuver, la rejeter ou la finaliser.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-4">
            <WithdrawalRequestForm
              formId={WITHDRAWAL_FORM_ID}
              submitPlacement="footer"
              onPendingChange={setFormBusy}
              onSuccess={() => {
                setOpen(false);
                void queryClient.invalidateQueries({
                  queryKey: userWalletQueryKeys.snapshot(),
                });
                void queryClient.invalidateQueries({
                  queryKey: userWithdrawalsQueryKeys.list(),
                });
              }}
            />
          </div>
          <DialogFooter className="border-t px-6 py-4 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={formBusy}
            >
              Annuler
            </Button>
            <Button type="submit" form={WITHDRAWAL_FORM_ID} disabled={formBusy}>
              {formBusy ? "Envoi en cours…" : "Demander le retrait"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
