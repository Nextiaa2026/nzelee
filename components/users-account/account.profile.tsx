import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "Profile — Verdant" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="max-w-2xl space-y-8">
      <Section title="Personal information" desc="Used on your account, statements and tax documents.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First name" value="Amelia" />
          <Field id="lastName" label="Last name" value="Lange" />
          <Field id="dob" label="Date of birth" value="1989-04-12" type="date" />
          <Field id="phone" label="Phone" value="+1 (415) 555-0199" />
        </div>
      </Section>

      <Section title="Address" desc="Required for compliance and tax reporting.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="street" label="Street address" value="525 Market Street" className="sm:col-span-2" />
          <Field id="city" label="City" value="San Francisco" />
          <Field id="state" label="State / Region" value="California" />
          <Field id="zip" label="ZIP / Postal" value="94105" />
          <Field id="country" label="Country" value="United States" />
        </div>
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ id, label, value, type = "text", className = "" }: { id: string; label: string; value: string; type?: string; className?: string }) {
  return (
    <div className={"space-y-2 " + className}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={value} className="h-11" />
    </div>
  );
}
