export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            About Bimba Nepal
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Healthier communities through prevention, awareness, and access.
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Bimba Nepal is a non-profit organization registered in Nepal (Reg. No. 132-082-83) and
            affiliated with the Social Welfare Council. We are committed to improving the health and
            well-being of communities through preventive healthcare, health education, early
            detection, community outreach, and access to appropriate support services.
          </p>
          <p>
            Our work brings together expertise in Geriatrics, Gynecology, Radiology, Mental Health,
            and Medical-Legal Information and Referral Support — combining community engagement with
            evidence-based practices to promote health, dignity, and quality of life for people
            across Nepal.
          </p>
        </div>
      </div>
    </section>
  );
}
