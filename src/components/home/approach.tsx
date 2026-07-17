const approach = [
  {
    title: "Community-Centered",
    body: "We listen to communities and work to address locally identified health priorities.",
  },
  {
    title: "Evidence-Based",
    body: "Programs informed by data, research, professional expertise, and community feedback.",
  },
  {
    title: "Preventive & Proactive",
    body: "We emphasize prevention, awareness, and early action as drivers of better outcomes.",
  },
  {
    title: "Collaborative",
    body: "We partner with professionals, institutions, and local leaders for sustainable impact.",
  },
  {
    title: "Ethical & Neutral",
    body: "We maintain professionalism, confidentiality, fairness, and respect in all interactions.",
  },
];

export function Approach() {
  return (
    <section className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Our Approach
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Looking ahead.
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Bimba Nepal envisions a future where every individual has access to reliable health
            information, preventive healthcare opportunities, and appropriate support systems.
            Together, we can build healthier communities through awareness, prevention, dignity, and
            access to care.
          </p>
        </div>
        <dl className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {approach.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-6">
              <dt className="font-serif text-lg font-semibold">{a.title}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{a.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
