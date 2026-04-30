import {
  ExtensionPageHero,
  ExtensionPageRoot,
  ExtensionSurface,
  extensionBodyTextClass,
} from "@/components/extension-page-parts";
import { cn } from "@/lib/utils";

export function SimpleDocLayout({
  title,
  description,
  badge = "Company",
  tags,
  children,
}: {
  title: string;
  description?: string;
  badge?: string;
  /** Optional pill labels (e.g. product areas). */
  tags?: string[];
  children: React.ReactNode;
}) {
  return (
    <ExtensionPageRoot>
      <main>
        <ExtensionPageHero badge={badge} title={title} meta={description} />

        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          {tags?.length ? (
            <div className="mb-8 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black/80 shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <ExtensionSurface>
            <div
              className={cn(
                extensionBodyTextClass,
                "space-y-5 text-sm [&_h2]:mt-10 [&_h2]:scroll-mt-20 [&_h2]:font-semibold [&_h2]:text-black [&_h2]:text-lg [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-5",
              )}
            >
              {children}
            </div>
          </ExtensionSurface>
        </div>
      </main>
    </ExtensionPageRoot>
  );
}
