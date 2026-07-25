export function Pilot() {
  const components = [
    "General health consultation",
    "Blood pressure assessment",
    "Blood sugar screening",
    "Body Mass Index (BMI) measurement",
    "Women's health consultation",
    "Geriatric health consultation",
    "Mental health awareness & screening",
    "Health education & counselling",
    "Referral recommendations where appropriate",
  ];
  return (
    <section id="pilot" className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Pilot Initiative
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Community health screening for adults 30+.
            </h2>
          </div>
          <p className="md:col-span-6 text-lg text-muted-foreground">
            Our first phase establishes a baseline of community health, promotes preventive care,
            and informs future programs. Many chronic conditions develop silently in adulthood —
            early screening enables timely action before complications arise.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-serif text-2xl font-semibold">Objectives</h3>
            <ul className="mt-4 space-y-2.5 text-muted-foreground">
              {[
                "Assess overall health status of adults 30 and above.",
                "Promote preventive healthcare and routine screening.",
                "Increase awareness of common health risks.",
                "Identify priority community health concerns.",
                "Generate baseline data for future interventions.",
                "Strengthen referral pathways to healthcare services.",
              ].map((o) => (
                <li key={o} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-serif text-2xl font-semibold">Screening Components</h3>
            <ul className="mt-4 grid gap-2.5 text-muted-foreground sm:grid-cols-1">
              {components.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
