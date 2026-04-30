"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { WithdrawalRequestForm } from "@/components/forms/withdrawal-request-form";
import { Button } from "@/components/ui/button";
import {
  FullTopSheet,
  FullTopSheetCancelButton,
} from "@/components/ui/full-top-sheet";
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
        Request withdrawal
      </Button>
      <FullTopSheet
        open={open}
        onOpenChange={setOpen}
        title="Request a withdrawal"
        description="Submit a payout request. Only an administrator can approve, reject, or complete it."
        bodyClassName="gap-4"
        bodyInnerClassName="max-w-2xl"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <FullTopSheetCancelButton onClick={() => setOpen(false)} disabled={formBusy}>
              Cancel
            </FullTopSheetCancelButton>
            <Button type="submit" form={WITHDRAWAL_FORM_ID} disabled={formBusy}>
              {formBusy ? "Submitting…" : "Request withdrawal"}
            </Button>
          </div>
        }
      >
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
      </FullTopSheet>
    </>
  );
}
