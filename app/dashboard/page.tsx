import Link from "next/link";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function UserDashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review your activity: transactions, investments in listings, and withdrawal requests.
          Data below is illustrative until backend endpoints are connected.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transactions</CardTitle>
            <CardDescription>Ledger entries for your wallet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard/transactions">Open</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Investments</CardTitle>
            <CardDescription>Amounts you have put into listings.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard/investments">Open</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Withdrawals</CardTitle>
            <CardDescription>Outbound transfers to your bank or wallet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard/withdrawals">Open</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
            <CardDescription>Profile name and organization.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard/settings">Open</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isAdmin ? (
        <p className="text-sm text-muted-foreground">
          You have admin access:{" "}
          <Link
            href="/admin"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Open admin console
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
