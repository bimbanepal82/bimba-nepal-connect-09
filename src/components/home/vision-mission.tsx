const missionItems = [
  "Promote preventive healthcare and early disease detection.",
  "Improve health literacy and public awareness.",
  "Support healthy aging and geriatric well-being.",
  "Advance women's health and reproductive health awareness.",
  "Encourage timely access to diagnostic and screening services.",
  "Facilitate access to reliable health information and professional resources.",
  "Strengthen community-based approaches to health promotion.",
  "Generate evidence and community health data to guide future interventions.",
];

export function VisionMission() {
  return (
    <section className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Our Vision
          </span>
          <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight">
            A healthier, more informed, and equitable Nepal.
          </h3>
          <p className="mt-4 text-muted-foreground">
            Where individuals and communities have access to preventive healthcare, reliable health
            information, and appropriate support systems.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Our Mission
          </span>
          <ul className="mt-4 space-y-2.5 text-muted-foreground">
            {missionItems.map((m) => (
              <li key={m} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
