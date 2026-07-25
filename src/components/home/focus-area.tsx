import diagnosticImg from "@/assets/program-diagnostic.jpg";
import geriatricImg from "@/assets/program-geriatric.jpg";
import legalImg from "@/assets/program-legal.jpg";
import mentalImg from "@/assets/program-mental.jpg";
import womenImg from "@/assets/program-women.jpg";

const focusAreas = [
  {
    title: "Geriatric Health & Healthy Aging",
    body: "Awareness, screening, and education on chronic disease prevention, mobility, dementia and cognitive health, caregiver support, and social engagement for senior citizens.",
    img: geriatricImg,
    alt: "Older Nepali community members sitting together in conversation",
  },
  {
    title: "Women's Health & Gynecology",
    body: "Reproductive and menstrual health education, maternal health awareness, preventive gynecological screening, consultations, and community programs.",
    img: womenImg,
    alt: "Nepali women gathered in a community health awareness session",
  },
  {
    title: "Radiology & Diagnostic Health",
    body: "Community screening programs, diagnostic awareness, early-detection initiatives, and clear referral pathways for further evaluation.",
    img: diagnosticImg,
    alt: "Clinician conducting a health check at a community screening camp",
  },
  {
    title: "Mental Health & Community Well-Being",
    body: "Mental health literacy, stigma reduction, emotional well-being promotion, stress and resilience awareness, and referrals to qualified professionals.",
    img: mentalImg,
    alt: "Counsellor listening attentively to a community member in soft daylight",
  },
  {
    title: "Medical-Legal Information & Referral",
    body: "A neutral first point of contact offering medical-legal information, resource navigation, and referrals — for patients, families, and healthcare professionals.",
    img: legalImg,
    alt: "Two professionals reviewing documents together at a desk",
  },
];

export function FocusAreas() {
  return (
    <section id="focus" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">
          Our Areas of Focus
        </span>
        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
          Five connected pathways to community health.
        </h2>
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {focusAreas.map((p) => (
          <article
            key={p.title}
            className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={p.img}
                alt={p.alt}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-7">
              <h3 className="font-serif text-2xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
        Our Medical-Legal Referral service does not provide legal representation, conduct
        investigations, determine liability, or issue legal opinions. We help individuals navigate
        available pathways and connect with appropriate professional resources in a neutral,
        responsible manner.
      </p>
    </section>
  );
}
