const values = [
  {
    title: "Community First",
    body: "We place communities at the center of our work and address local health needs through inclusive, participatory approaches.",
  },
  {
    title: "Prevention & Early Action",
    body: "Prevention and early detection are among the most effective ways to improve long-term health outcomes.",
  },
  {
    title: "Integrity & Professionalism",
    body: "We uphold ethical standards, transparency, accountability, and respect in all activities.",
  },
  {
    title: "Collaboration",
    body: "We work alongside healthcare professionals, institutions, community leaders, and stakeholders to maximize impact.",
  },
  {
    title: "Compassion & Dignity",
    body: "Every individual deserves access to information, care, and support with dignity and respect.",
  },
];

export function Values() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">
          Core Values
        </span>
        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
          What guides our work.
        </h2>
      </div>
      <dl className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border border-border bg-card p-7">
            <dt className="font-serif text-xl font-semibold">{v.title}</dt>
            <dd className="mt-2 text-muted-foreground">{v.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
