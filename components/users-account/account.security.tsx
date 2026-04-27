import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/account/security")({
  head: () => ({ meta: [{ title: "Security — Verdant" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">Use a strong password you don't reuse anywhere else.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" className="h-11" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button>Update password</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-foreground">Two-factor authentication</h2>
              <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Enabled</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Authenticator app · Backup codes generated Jan 5, 2026.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Regenerate backup codes</Button>
          <Button variant="outline" size="sm">Replace authenticator</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Active sessions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Devices currently signed in to your account.</p>
        <div className="mt-5 divide-y divide-border">
          {[
            { device: "MacBook Pro · San Francisco, CA", ip: "73.118.•.•", current: true, when: "Active now" },
            { device: "iPhone 15 · San Francisco, CA", ip: "10.0.•.•", current: false, when: "2 hours ago" },
            { device: "Chrome on Windows · New York, NY", ip: "204.45.•.•", current: false, when: "Yesterday" },
          ].map((s) => (
            <div key={s.device} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div>
                <div className="font-medium text-foreground">{s.device}</div>
                <div className="text-xs text-muted-foreground">{s.ip} · {s.when}</div>
              </div>
              {s.current ? (
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Current</Badge>
              ) : (
                <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
