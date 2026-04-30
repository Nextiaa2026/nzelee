import Link from "next/link";

import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const adminSections = [
  {
    title: "Users",
    description: "Accounts, roles, and access.",
    href: "/admin/users",
  },
  {
    title: "Listings",
    description: "Campaigns and investable projects.",
    href: "/admin/campaigns",
  },
  {
    title: "Investments",
    description: "Investor commitments across listings.",
    href: "/admin/investments",
  },
  {
    title: "Transactions",
    description: "Charges, refunds, payouts, and fees.",
    href: "/admin/transactions",
  },
  {
    title: "Withdrawals",
    description: "Payout requests and withdrawal pipeline.",
    href: "/admin/withdrawals",
  },
  {
    title: "KYC Reviews",
    description: "Approve or reject investor verification submissions.",
    href: "/admin/kyc",
  },
  {
    title: "Notifications",
    description: "Send in-app notices to one user or all users.",
    href: "/admin/notifications",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          </div>
          <AdminDashboardStats />
          <div className="px-4 lg:px-6">
            <h2 className="mb-3 text-lg font-medium">Admin directories</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {adminSections.map((section) => (
                <Card key={section.href} className="shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={section.href}>Open</Link>
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
