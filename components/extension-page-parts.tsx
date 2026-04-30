import { cn } from "@/lib/utils";

export type ExtensionPageTone = "green" | "white";

/** Page shell: default green (legal, etc.); `white` for marketing surfaces like /campaigns. */
export function ExtensionPageRoot({
  children,
  variant = "green",
}: {
  children: React.ReactNode;
  variant?: ExtensionPageTone;
}) {
  return (
    <div
      className={cn("min-h-svh", variant === "white" ? "bg-white" : "bg-hero-bg")}
    >
      {children}
    </div>
  );
}

export type ExtensionHeroTone = "dark" | "light";

export function ExtensionPageHero({
  badge,
  title,
  meta,
  intro,
  tone = "dark",
}: {
  badge?: string;
  title: string;
  meta?: string;
  intro?: React.ReactNode;
  /** `dark` = white text on green (default). `light` = black text on white (e.g. browse campaigns). */
  tone?: ExtensionHeroTone;
}) {
  const isLight = tone === "light";
  return (
    <header
      className={cn(
        "border-b",
        isLight
          ? "border-black/10 bg-white"
          : "border-white/10 bg-deep-green/80",
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {badge ? (
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
              isLight
                ? "bg-mint/20 text-deep-green"
                : "bg-mint text-mint-foreground",
            )}
          >
            {badge}
          </span>
        ) : null}
        <h1
          className={cn(
            "mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl",
            isLight ? "text-black" : "text-white",
          )}
        >
          {title}
        </h1>
        {meta ? (
          <p className={cn("mt-2 text-sm", isLight ? "text-black/60" : "text-white/75")}>
            {meta}
          </p>
        ) : null}
        {intro ? (
          <div
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed [&_strong]:font-semibold",
              isLight
                ? "text-black/70 [&_a]:font-medium [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_p]:text-black/70 [&_strong]:text-black"
                : "text-white/85 [&_a]:font-medium [&_a]:text-mint [&_a]:underline [&_a]:underline-offset-4 [&_p]:text-white/85 [&_strong]:text-white",
            )}
          >
            {intro}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/** White bento card on green page. */
export function ExtensionSurface({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-sm md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Body copy: only black and black/opacity (no muted/slate utilities). */
export const extensionBodyTextClass =
  "text-[15px] leading-relaxed text-black/70 [&_strong]:font-semibold [&_strong]:text-black [&_p]:text-black/70 [&_li]:text-black/70 [&_ul]:marker:text-black/40 [&_a]:font-medium [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-black/25 hover:[&_a]:decoration-black/60";
