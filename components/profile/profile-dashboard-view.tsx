"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  History,
  Mail,
  PencilLine,
  Phone,
  Plus,
  Shield,
  TrendingUp,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Save,
  X
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type ProfileDashboardViewProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
    phone?: string;
    organization?: string;
  };
  summary: {
    campaigns: number;
    investments: number;
    investedAmount: number;
  };
  wallet: {
    currency: string;
    availableCents: number;
  };
  transactions: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    type?: string;
  }>;
  kycStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";
};

export function ProfileDashboardView({
  user,
  summary,
  wallet,
  transactions,
  kycStatus,
}: ProfileDashboardViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.name,
    email: user.email,
    phone: user.phone || "",
    organization: user.organization || "",
  });

  const formatCurrency = (amountCents: number) => {
    return (amountCents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: wallet.currency || "USD",
      maximumFractionDigits: 0,
    });
  };

  const getKycStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { 
          icon: CheckCircle2, 
          color: "text-emerald-500", 
          bg: "bg-emerald-500/10", 
          label: "Verified Identity",
          desc: "Full access to investment features"
        };
      case "UNDER_REVIEW":
        return { 
          icon: Clock, 
          color: "text-amber-500", 
          bg: "bg-amber-500/10", 
          label: "Identity Under Review",
          desc: "Usually processed within 24 hours"
        };
      case "REJECTED":
        return { 
          icon: XCircle, 
          color: "text-red-500", 
          bg: "bg-red-500/10", 
          label: "Identity Rejected",
          desc: "Please check your email for details"
        };
      default:
        return { 
          icon: AlertCircle, 
          color: "text-blue-500", 
          bg: "bg-blue-500/10", 
          label: "Pending Verification",
          desc: "Required for investing"
        };
    }
  };

  const kycConfig = getKycStatusConfig(kycStatus);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
      {/* Profile Header & Wallet Summary Section */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 h-full"
        >
          <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-foreground/5 bg-white p-8 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-mint/20 shadow-md transition-transform group-hover:scale-105 duration-300">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback className="bg-mint/10 text-2xl font-bold text-deep-green">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 rounded-full bg-deep-green p-2 text-white shadow-lg ring-4 ring-white hover:bg-mint hover:text-deep-green transition-all duration-200">
                  <PencilLine className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                    {user.name}
                  </h1>
                  {kycStatus === "APPROVED" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm" title="Verified">
                      <CheckCircle2 className="h-3 w-3 fill-white text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 text-sm font-medium text-foreground/60">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/5 text-foreground/40">
                      <Mail className="h-3 w-3" />
                    </div>
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/5 text-foreground/40">
                        <Phone className="h-3 w-3" />
                      </div>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0">
              <Button 
                onClick={() => setIsEditing(true)}
                className="h-12 rounded-2xl bg-deep-green px-8 font-bold text-white shadow-lg shadow-deep-green/10 hover:bg-deep-green/90 active:scale-95 transition-all"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Premium Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 h-full"
        >
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#004D40] p-8 text-white shadow-xl">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <Wallet className="h-4 w-4 text-mint" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                    Account Balance
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="font-display text-4xl font-bold tracking-tight">
                  {formatCurrency(wallet.availableCents)}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-mint">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.5% this month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                    Invested
                  </p>
                  <p className="text-sm font-bold tracking-tight">
                    {formatCurrency(summary.investedAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                    Projects
                  </p>
                  <p className="text-sm font-bold tracking-tight">{summary.investments} Assets</p>
                </div>
              </div>

              <Button className="h-12 w-full rounded-2xl bg-[#FFB300] font-bold text-[#004D40] shadow-lg shadow-black/5 hover:bg-[#FFC107] active:scale-95 transition-all">
                <Plus className="mr-2 h-4 w-4 stroke-[3]" />
                Deposit Funds
              </Button>
            </div>
            
            {/* Visual Flair */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mint/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-mint/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />
          </div>
        </motion.div>
      </div>

      {/* Stats & KYC Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* KYC Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[2rem] border border-foreground/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner", kycConfig.bg, kycConfig.color)}>
              <kycConfig.icon className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-0.5">Compliance</p>
              <h4 className={cn("font-display text-base font-bold", kycConfig.color)}>{kycConfig.label}</h4>
              <p className="text-[10px] font-medium text-foreground/50">{kycConfig.desc}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[2rem] border border-foreground/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-deep-green shadow-inner">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-0.5">Performance</p>
              <h4 className="font-display text-lg font-bold">Active Projects</h4>
              <p className="text-[10px] font-medium text-foreground/50">{summary.campaigns} campaigns currently live</p>
            </div>
            <div className="ml-auto text-2xl font-bold font-display text-deep-green">{summary.campaigns}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-[2rem] border border-foreground/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/40 shadow-inner">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-0.5">Activity</p>
              <h4 className="font-display text-lg font-bold">Transaction Count</h4>
              <p className="text-[10px] font-medium text-foreground/50">Last activity 2 days ago</p>
            </div>
            <div className="ml-auto text-2xl font-bold font-display text-foreground/60">{transactions.length}</div>
          </div>
        </motion.div>
      </div>

      {/* Middle Section: Security & Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[2.5rem] border border-foreground/5 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-green text-white shadow-lg shadow-deep-green/10">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">Security</h2>
            </div>
          </div>

          <div className="space-y-4">
            <button className="group flex w-full items-center justify-between rounded-2xl bg-foreground/5 p-5 text-left transition-all hover:bg-foreground/[0.08] active:scale-[0.99]">
              <div className="space-y-1">
                <p className="text-sm font-bold">Account Password</p>
                <p className="text-[11px] font-medium text-foreground/40">
                  Last changed 3 months ago
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-foreground/20 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between rounded-2xl bg-foreground/5 p-5">
              <div className="space-y-1">
                <p className="text-sm font-bold">Two-Factor Auth</p>
                <p className="text-[11px] font-medium text-foreground/40">
                  Verify logins via SMS or App
                </p>
              </div>
              <div className="h-6 w-11 cursor-pointer rounded-full bg-mint p-1 flex items-center justify-end shadow-inner">
                <div className="h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-[2.5rem] border border-foreground/5 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-green text-white shadow-lg shadow-deep-green/10">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">Notifications</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl p-2 px-4">
              <div className="space-y-1">
                <p className="text-sm font-bold">New Project Alerts</p>
                <p className="text-[11px] font-medium text-foreground/40">
                  Notify me of new opportunities
                </p>
              </div>
              <div className="h-6 w-11 cursor-pointer rounded-full bg-mint p-1 flex items-center justify-end shadow-inner">
                <div className="h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300" />
              </div>
            </div>
            
            <div className="h-px bg-foreground/5 mx-4" />
            
            <div className="flex items-center justify-between rounded-2xl p-2 px-4">
              <div className="space-y-1">
                <p className="text-sm font-bold">Market Reports</p>
                <p className="text-[11px] font-medium text-foreground/40">
                  Monthly investment summaries
                </p>
              </div>
              <div className="h-6 w-11 cursor-pointer rounded-full bg-mint p-1 flex items-center justify-end shadow-inner">
                <div className="h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-[2.5rem] border border-foreground/5 bg-white overflow-hidden shadow-sm"
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground/40">
                <History className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">
                Activity History
              </h2>
            </div>
            <Link
              href="/dashboard/transactions"
              className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mint hover:text-deep-green transition-colors"
            >
              See everything
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-foreground/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-foreground/[0.02]">
                <TableRow className="hover:bg-transparent border-foreground/5">
                  <TableHead className="h-12 px-6 font-bold text-foreground/40 text-[10px] uppercase tracking-widest">Date</TableHead>
                  <TableHead className="h-12 px-6 font-bold text-foreground/40 text-[10px] uppercase tracking-widest">Description</TableHead>
                  <TableHead className="h-12 px-6 font-bold text-foreground/40 text-[10px] uppercase tracking-widest">Asset</TableHead>
                  <TableHead className="h-12 px-6 font-bold text-foreground/40 text-[10px] uppercase tracking-widest">Amount</TableHead>
                  <TableHead className="h-12 px-6 font-bold text-foreground/40 text-[10px] uppercase tracking-widest text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className="border-foreground/5 hover:bg-foreground/[0.01] transition-colors"
                    >
                      <TableCell className="px-6 py-4 text-xs font-semibold text-foreground/70">
                        {tx.createdAt.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-sm font-bold">Investment Deposit</span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="rounded-lg border-foreground/10 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider text-foreground/50 bg-foreground/[0.02]">
                          Asset {tx.id.slice(0, 4)}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("px-6 py-4 font-display font-bold tabular-nums", tx.amount < 0 ? "text-red-500" : "text-emerald-600")}>
                        {tx.amount < 0 ? "-" : "+"}{formatCurrency(Math.abs(tx.amount))}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="h-3 w-3" />
                          Settled
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-16 text-center text-foreground/30 font-medium italic"
                    >
                      No activity to display yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-[2.5rem] border-0 p-0 overflow-hidden bg-white/95 backdrop-blur-2xl">
          <div className="mx-auto max-w-2xl h-full flex flex-col p-8">
            <div className="flex justify-center mb-4">
              <div className="h-1.5 w-12 rounded-full bg-foreground/10" />
            </div>
            
            <SheetHeader className="text-left mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="font-display text-3xl font-bold">Edit Profile</SheetTitle>
                  <SheetDescription className="text-sm text-foreground/50 font-medium mt-1">
                    Keep your personal information up to date.
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon-sm" className="rounded-full bg-foreground/5 h-10 w-10">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>

            <form onSubmit={handleUpdateProfile} className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 px-1">Display Name</Label>
                  <Input 
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="h-14 rounded-2xl border-foreground/10 bg-white/50 px-5 font-medium focus-visible:ring-deep-green/20"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 px-1">Email Address</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-14 rounded-2xl border-foreground/10 bg-white/50 px-5 font-medium focus-visible:ring-deep-green/20"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 px-1">Phone Number</Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-14 rounded-2xl border-foreground/10 bg-white/50 px-5 font-medium focus-visible:ring-deep-green/20"
                    placeholder="+221 00 000 00 00"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 px-1">Organization</Label>
                  <Input 
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="h-14 rounded-2xl border-foreground/10 bg-white/50 px-5 font-medium focus-visible:ring-deep-green/20"
                    placeholder="Company or Individual"
                  />
                </div>
              </div>

              <div className="pt-4 pb-12">
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="h-14 w-full rounded-2xl bg-deep-green text-lg font-bold text-white shadow-xl shadow-deep-green/20 hover:bg-deep-green/90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
