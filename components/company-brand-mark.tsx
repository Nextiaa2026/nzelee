"use client";

import Image from "next/image";
import Link from "next/link";

import { SITE_NAME } from "@/lib/brand";
import { BRAND_LOGOS } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

export type CompanyBrandMarkVariant =
  | "horizontalLightBg"
  | "horizontalDarkBg"
  | "iconBadge";

type CompanyBrandMarkProps = {
  variant: CompanyBrandMarkVariant;
  /** Omit or pass `null` to render the mark without a link (wrap with your own link). */
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function CompanyBrandMark({
  variant,
  href = "/",
  className,
  priority = false,
}: CompanyBrandMarkProps) {
  const mark =
    variant === "horizontalLightBg" ? (
      <Image
        src={BRAND_LOGOS.headerOnLight}
        alt={SITE_NAME}
        width={132}
        height={33}
        className={cn("h-7 w-auto sm:h-8", className)}
        priority={priority}
      />
    ) : variant === "horizontalDarkBg" ? (
      <Image
        src={BRAND_LOGOS.headerOnDark}
        alt={SITE_NAME}
        width={132}
        height={33}
        className={cn("h-7 w-auto sm:h-8", className)}
        priority={priority}
      />
    ) : (
      <Image
        src={BRAND_LOGOS.appIconDark}
        alt={SITE_NAME}
        width={36}
        height={36}
        className={cn(
          "size-9 rounded-xl object-cover shadow-sm ring-1 ring-black/10",
          className,
        )}
        priority={priority}
      />
    );

  if (href === null) {
    return <span className="inline-flex items-center">{mark}</span>;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {mark}
    </Link>
  );
}
