import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export type CampaignCardProps = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl: string | null;
  raisedAmount: number;
  goalAmount: number;
  currency: string;
  status: string;
  isFeatured?: boolean;
  isDemo?: boolean;
};

export function CampaignCard({
  title,
  slug,
  summary,
  coverImageUrl,
  raisedAmount,
  goalAmount,
  currency,
  status,
  isFeatured,
  isDemo,
}: CampaignCardProps) {
  const pct =
    goalAmount > 0
      ? Math.min(100, Math.round((raisedAmount / goalAmount) * 100))
      : 0;
  const href = slug ? `/campaigns/${slug}` : "#";

  return (
    <Link
      href={href}
      className="group block active:scale-[0.98] transition-all duration-200 overflow-hidden rounded-[2.5rem] border border-foreground/5 bg-surface md:hover:-translate-y-1.5 md:hover:shadow-xl md:hover:shadow-deep-green/5"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-deep-green/10 to-mint/10">
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-20 w-20 text-deep-green/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-deep-green/90 px-3 py-1 text-xs text-deep-green-foreground backdrop-blur">
            {status}
          </span>
          {isDemo && (
            <span className="rounded-full bg-foreground/90 px-3 py-1 text-xs text-background backdrop-blur">
              Demo
            </span>
          )}
        </div>
        {isFeatured && (
          <span className="absolute right-3 top-3 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-mint-foreground">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 font-display text-xl">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-foreground/55">
          {summary}
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-foreground/60">
            <span>{pct}% funded</span>
            <span>
              {(goalAmount / 100).toLocaleString(undefined, {
                style: "currency",
                currency: currency || "USD",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-deep-green transition-[width] duration-1000 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4">
          <div>
            <p className="text-xs text-foreground/55">Raised</p>
            <p className="font-display text-lg">
              {(raisedAmount / 100).toLocaleString(undefined, {
                style: "currency",
                currency: currency || "USD",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-deep-green px-4 py-2 text-xs font-medium text-deep-green-foreground transition hover:opacity-90">
            Invest
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
