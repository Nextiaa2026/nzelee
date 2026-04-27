import Link from "next/link";

export function SimpleDocLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>
      <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:scroll-mt-20 [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
