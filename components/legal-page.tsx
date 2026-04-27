interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {updatedAt}</p>
          <div className="mt-6 max-w-2xl text-muted-foreground">{intro}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
              On this page
            </div>
            <ol className="mt-4 space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-2 text-muted-foreground transition hover:text-foreground"
                  >
                    <span className="tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <article className="max-w-none">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Section {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </div>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
