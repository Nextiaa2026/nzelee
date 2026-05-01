import Link from "next/link";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <CompanyBrandMark variant="horizontalLightBg" href="/" />
          </div>
          <CardTitle>Admin only</CardTitle>
          <CardDescription>
            This area is restricted to administrator accounts. If you should have
            access, ask an admin to set your role to{" "}
            <span className="font-mono text-foreground">ADMIN</span> in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
