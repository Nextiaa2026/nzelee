import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/account/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Verdant" }] }),
  component: NotificationsPage,
});

const groups = [
  {
    title: "Investment activity",
    items: [
      { label: "New opportunities matching my profile", email: true, push: true },
      { label: "Distributions received", email: true, push: true },
      { label: "Capital calls", email: true, push: true },
      { label: "Investment status updates", email: true, push: false },
    ],
  },
  {
    title: "Account & compliance",
    items: [
      { label: "KYC status changes", email: true, push: true },
      { label: "Sign-in from a new device", email: true, push: false },
      { label: "Tax documents available", email: true, push: false },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Product updates and newsletters", email: false, push: false },
      { label: "Educational content", email: true, push: false },
    ],
  },
];

function NotificationsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-foreground">{g.title}</h2>
          </div>
          <div className="divide-y divide-border">
            {g.items.map((it) => (
              <div key={it.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-8 px-6 py-4">
                <div className="text-sm text-foreground">{it.label}</div>
                <ToggleCol label="Email" defaultChecked={it.email} />
                <ToggleCol label="Push" defaultChecked={it.push} />
              </div>
            ))}
          </div>
        </section>
      ))}
      <div className="flex justify-end"><Button>Save preferences</Button></div>
    </div>
  );
}

function ToggleCol({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
