"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, UsersIcon, FileStackIcon, WalletIcon, InboxIcon } from "lucide-react"

type SectionCardsProps = {
  totalUsers: number
  totalCampaigns: number
  paidPledgeDisplay: string
  pendingPipeline: number
  pendingDetail: string
}

/**
 * If props are omitted, shows placeholder (legacy demo). Use `AdminDashboardStats` to pass real values.
 */
export function SectionCards(props?: Partial<SectionCardsProps>) {
  const totalUsers = props?.totalUsers ?? 1234
  const totalCampaigns = props?.totalCampaigns ?? 0
  const paidPledgeDisplay = props?.paidPledgeDisplay ?? "—"
  const pendingPipeline = props?.pendingPipeline ?? 0
  const pendingDetail = props?.pendingDetail ?? "Pending items"

  const hasLive = props?.totalUsers !== undefined

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {hasLive ? totalUsers.toLocaleString() : totalUsers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <UsersIcon className="size-3.5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered accounts
            <UsersIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">All roles</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Campaigns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {hasLive ? totalCampaigns.toLocaleString() : 12}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <FileStackIcon className="size-3.5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Listings on platform</div>
          <div className="text-muted-foreground">All statuses</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Paid pledge volume</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {hasLive ? paidPledgeDisplay : "$0.00"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <WalletIcon className="size-3.5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sum of PAID pledges
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Smallest currency unit in DB</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pipeline</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {hasLive ? pendingPipeline : 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <InboxIcon className="size-3.5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">Pending work</div>
          <div className="text-muted-foreground">{hasLive ? pendingDetail : "—"}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
