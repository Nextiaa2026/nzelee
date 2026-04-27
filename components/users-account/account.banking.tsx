import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/account/banking")({
  head: () => ({ meta: [{ title: "Banking & payouts — Verdant" }] }),
  component: BankingPage,
});

const accounts = [
  { name: "Bank of America Checking", number: "••4592", type: "ACH", primary: true, verified: true },
  { name: "Chase Savings", number: "••0182", type: "Wire", primary: false, verified: true },
];

function BankingPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Linked bank accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">Where we'll send distributions and pull funds for new investments.</p>
          </div>
          <Button>Link new account</Button>
        </div>

        <div className="mt-6 space-y-3">
          {accounts.map((a) => (
            <div key={a.number} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-sage text-sage-foreground font-semibold text-sm">$</div>
                <div>
                  <div className="font-medium text-foreground">{a.name} {a.number}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="border-border">{a.type}</Badge>
                    {a.primary && <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">Primary</Badge>}
                    {a.verified && <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Verified</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!a.primary && <Button size="sm" variant="outline">Make primary</Button>}
                <Button size="sm" variant="ghost" className="text-destructive">Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Payout preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose how you'd like to receive distributions.</p>
        <div className="mt-5 space-y-3">
          {[
            { v: "auto", t: "Auto-deposit to primary bank", d: "Distributions are sent to your primary linked account within 2 business days." },
            { v: "reinvest", t: "Auto-reinvest where eligible", d: "Eligible distributions are automatically reinvested into the same opportunity." },
            { v: "hold", t: "Hold in Verdant balance", d: "Distributions accrue in your Verdant balance. Withdraw anytime." },
          ].map((o) => (
            <label key={o.v} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="radio" name="payout" defaultChecked={o.v === "auto"} className="mt-1" />
              <div>
                <div className="font-medium text-foreground">{o.t}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{o.d}</div>
              </div>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
