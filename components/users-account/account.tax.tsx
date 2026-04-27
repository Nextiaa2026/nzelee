import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/account/tax")({
  head: () => ({ meta: [{ title: "Tax info — Verdant" }] }),
  component: TaxPage,
});

function TaxPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Tax classification</h2>
            <p className="mt-1 text-sm text-muted-foreground">Used to generate the correct tax forms (W-9, W-8BEN, etc.).</p>
          </div>
          <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Form W-9 on file</Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tin">Taxpayer ID (SSN / EIN)</Label>
            <Input id="tin" defaultValue="•••-••-1234" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxCountry">Country of tax residence</Label>
            <Input id="taxCountry" defaultValue="United States" className="h-11" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="entity">Tax classification</Label>
            <select id="entity" className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option>Individual / sole proprietor</option>
              <option>C corporation</option>
              <option>S corporation</option>
              <option>Partnership</option>
              <option>Trust / estate</option>
              <option>LLC</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline">Replace W-9</Button>
          <Button>Save</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm text-foreground">
        <div className="font-display text-base font-semibold">Backup withholding</div>
        <p className="mt-2 text-muted-foreground">
          You are <span className="font-medium text-foreground">not</span> currently subject to backup withholding.
          If your status changes, please update this section to avoid 24% withholding on distributions.
        </p>
      </section>
    </div>
  );
}
