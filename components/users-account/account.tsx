import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Verdant" }] }),
  component: AccountLayout,
});

const tabs = [
  { to: "/account/profile", label: "Profile" },
  { to: "/account/security", label: "Security" },
  { to: "/account/notifications", label: "Notifications" },
  { to: "/account/banking", label: "Banking & payouts" },
  { to: "/account/tax", label: "Tax info" },
] as const;

function AccountLayout() {
  const { pathname } = useLocation();
  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Settings</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">Account</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile, security, payments and tax information.</p>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex flex-wrap gap-6">
          {tabs.map((t) => {
            const active = pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  "border-b-2 px-1 pb-3 text-sm transition " +
                  (active
                    ? "border-primary font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground")
                }
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </AppShell>
  );
}
