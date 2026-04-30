"use client";

import Image, { StaticImageData } from "next/image";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { landingImages } from "@/lib/landing-images";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  breadcrumb?: boolean; // Deprecated: no longer used
  badge?: {
    text: string;
    pulse?: boolean;
  };
  title: string | React.ReactNode;
  description: string;
  image?: string | StaticImageData;
  imageAlt?: string;
  showLiveChart?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const chartData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 6890 },
  { name: "Sat", value: 8390 },
  { name: "Sun", value: 9490 },
];

export function HeroSection({
  badge,
  title,
  description,
  image = landingImages.investorsTeam,
  imageAlt,
  showLiveChart = false,
  className,
  children,
}: HeroSectionProps) {
  return (
    <header className={cn("pt-8 pb-12 md:pt-12 md:pb-20", className)}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6 grid items-center gap-10 md:mt-12 md:grid-cols-2">
          <div>
            {badge && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-1.5 text-xs text-foreground/70">
                {badge.pulse && (
                  <span className="h-1.5 w-1.5 rounded-full bg-mint pulse" />
                )}
                {badge.text}
              </span>
            )}
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-mint sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-foreground/70">{description}</p>
            {children}
          </div>
          <div className="p-1">
            <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl bg-black/[0.02] border border-border/40 shadow-sm">
              {showLiveChart ? (
                <div className="h-full w-full p-4 pt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0F8261"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0F8261"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide />
                      <YAxis
                        hide
                        domain={["dataMin - 1000", "dataMax + 1000"]}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        itemStyle={{ color: "#0F8261", fontWeight: 600 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0F8261"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <Image
                  src={image}
                  alt={
                    imageAlt ||
                    (typeof title === "string" ? title : "Hero Image")
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
