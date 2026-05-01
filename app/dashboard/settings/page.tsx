import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserAccountSummary } from "@/lib/services/user-account-summary";
import { getUserWalletSnapshot } from "@/lib/services/user-wallet-snapshot";
import { paymentTransactions, campaigns, users } from "@/lib/db/schema";
import { eq, desc, or } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, History, PlusCircle, Edit2, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const [user] = await db
    .select({
      dateOfBirth: users.dateOfBirth,
      country: users.country,
      image: users.image,
      phone: users.phone,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const summary = await getUserAccountSummary(session.user.id);
  const wallet = await getUserWalletSnapshot(session.user.id);

  const dbTransactions = await db
    .select({
      id: paymentTransactions.id,
      amount: paymentTransactions.amount,
      type: paymentTransactions.type,
      status: paymentTransactions.status,
      createdAt: paymentTransactions.createdAt,
      campaignTitle: campaigns.title,
    })
    .from(paymentTransactions)
    .leftJoin(campaigns, eq(paymentTransactions.campaignId, campaigns.id))
    .where(
      or(
        eq(paymentTransactions.payerUserId, session.user.id),
        eq(paymentTransactions.payeeUserId, session.user.id),
      ),
    )
    .orderBy(desc(paymentTransactions.createdAt))
    .limit(10);

  const transactions = dbTransactions.map((tx) => ({
    id: tx.id,
    date: tx.createdAt.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    title: tx.campaignTitle || (tx.type === "ADJUSTMENT" ? "Ajustement de solde" : "Transaction système"),
    category: tx.type === "PLEDGE_CAPTURE" ? "Investissement" : "Portefeuille",
    amount: `${tx.amount > 0 ? "+" : ""} ${(tx.amount / 100).toLocaleString("fr-FR")} FCFA`,
    isPositive: tx.amount > 0,
    status: tx.status === "SUCCEEDED" ? "Complété" : tx.status,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:space-y-8 md:p-8">
      {/* Top Section: Profile & Wallet */}
      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        {/* Profile Card */}
        <div className="flex flex-col justify-center rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={user?.image ?? session.user.image ?? ""} />
                  <AvatarFallback className="bg-mint text-3xl font-bold text-deep-green">
                    {(session.user.name ?? "M D")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-deep-green p-1.5 text-white">
                  <Edit2 className="h-3 w-3" />
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {session.user.name ?? "Moussa Diop"}
                </h2>
                <div className="flex flex-col space-y-0.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {session.user.email}
                  </span>
                  {user?.phone ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user.phone}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +221 77 123 45 67
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full rounded-xl bg-deep-green px-6 font-semibold hover:bg-deep-green/90 sm:w-auto">
                  Modifier le profil
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100%-2rem)] max-w-[425px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Modifier le profil</DialogTitle>
                  <DialogDescription>
                    Mettez à jour vos informations personnelles. Cliquez sur enregistrer quand vous avez terminé.
                  </DialogDescription>
                </DialogHeader>
                <ProfileSettingsForm
                  email={session.user.email ?? ""}
                  defaultName={session.user.name ?? ""}
                  defaultOrganization={session.user.organization ?? ""}
                  defaultCountry={user?.country ?? ""}
                  defaultDateOfBirth={
                    user?.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : ""
                  }
                  defaultImage={user?.image ?? ""}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="flex flex-col justify-between rounded-3xl bg-deep-green p-6 md:p-8 text-white shadow-lg">
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">
              Solde Actuel
            </p>
            <h3 className="mt-2 font-display text-4xl font-semibold">
              {(wallet.availableCents / 100).toLocaleString("fr-FR")} FCFA
            </h3>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase">Total Investi</p>
              <p className="text-sm font-semibold mt-0.5">
                {(summary.investedAmount / 100).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase">Projets</p>
              <p className="text-sm font-semibold mt-0.5">{summary.investments} Projets</p>
            </div>
          </div>
          <Button className="mt-6 w-full rounded-xl bg-amber-500 text-black hover:bg-amber-400 font-bold shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" />
            Déposer des fonds
          </Button>
        </div>
      </div>

      {/* Middle Section: Security & Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Card */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/20 text-deep-green">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">Sécurité</h3>
          </div>
          <div className="space-y-4">
            <div className="flex cursor-pointer items-center justify-between rounded-2xl bg-foreground/[0.02] p-4 transition-colors hover:bg-foreground/[0.04]">
              <div>
                <p className="font-medium text-foreground">Mot de passe</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dernière modification il y a 3 mois
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-foreground/[0.02] p-4">
              <div>
                <p className="font-medium text-foreground">Authentification à deux facteurs</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Protégez votre compte avec un code SMS
                </p>
              </div>
              <Switch checked={true} className="data-[state=checked]:bg-deep-green" />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/20 text-deep-green">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">Préférences de Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-transparent p-4 pl-2">
              <div>
                <p className="font-medium text-foreground">Nouveaux Projets</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Être alerté dès qu&apos;une opportunité se présente
                </p>
              </div>
              <Switch checked={true} className="data-[state=checked]:bg-deep-green" />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-transparent p-4 pl-2">
              <div>
                <p className="font-medium text-foreground">Mises à jour d&apos;investissements</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rapports mensuels et actualités des projets soutenus
                </p>
              </div>
              <Switch checked={true} className="data-[state=checked]:bg-deep-green" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Transactions */}
      <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/20 text-deep-green">
              <History className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">Historique des transactions</h3>
          </div>
          <Button variant="link" className="text-deep-green font-medium">
            Voir tout
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-0 bg-foreground/[0.02] text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="rounded-l-2xl py-4 pl-6 pr-4 font-bold whitespace-nowrap">Date</th>
                <th className="py-4 px-4 font-bold whitespace-nowrap">Transaction</th>
                <th className="py-4 px-4 font-bold whitespace-nowrap">Catégorie</th>
                <th className="py-4 px-4 font-bold whitespace-nowrap">Montant</th>
                <th className="rounded-r-2xl py-4 pr-6 pl-4 font-bold text-right sm:text-left whitespace-nowrap">Statut</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.01]">
                  <td className="py-4 pl-6 pr-4 font-semibold text-foreground whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground min-w-[200px]">
                    {tx.title}
                  </td>
                  <td className="py-4 px-4">
                    <span className={tx.category === "Portefeuille" ? "rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-600" : "rounded-full bg-mint/20 px-3 py-1 text-[10px] font-bold text-deep-green"}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-semibold text-foreground">
                      {tx.amount}
                    </span>
                  </td>
                  <td className="py-4 pr-6 pl-4 whitespace-nowrap text-right sm:text-left">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-foreground text-xs sm:text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-deep-green"></span>
                      {tx.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
