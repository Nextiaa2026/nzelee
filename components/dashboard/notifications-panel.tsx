"use client";

import Link from "next/link";

import { useMarkNotificationRead, useMyNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function NotificationsPanel() {
  const { data, isPending, isError, error } = useMyNotifications();
  const markRead = useMarkNotificationRead();

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Chargement des notifications…
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error instanceof Error ? error.message : "Impossible de charger les notifications."}
      </p>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucune notification pour le moment</CardTitle>
          <CardDescription>
            Lorsqu&apos;il y aura des mises à jour sur votre compte, votre KYC ou vos investissements, elles apparaîtront ici.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((n) => (
        <li key={n.id}>
          <Card
            className={cn(
              "transition-colors",
              n.readAt ? "border-border/80 bg-card/60" : "border-primary/25 bg-card",
            )}
          >
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {n.type.replaceAll("_", " ")}
                </p>
                <CardTitle className="mt-1 text-base font-semibold leading-snug">
                  {n.href ? (
                    <Link href={n.href} className="hover:underline">
                      {n.title}
                    </Link>
                  ) : (
                    n.title
                  )}
                </CardTitle>
                {n.body ? (
                  <CardDescription className="mt-2 text-pretty">{n.body}</CardDescription>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.readAt ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={markRead.isPending}
                  onClick={() => markRead.mutate(n.id)}
                >
                  Marquer comme lu
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Lu</span>
              )}
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}
