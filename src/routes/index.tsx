import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-bimba.jpg";
import eduImg from "@/assets/program-education.jpg";
import womenImg from "@/assets/program-women.jpg";
import communityImg from "@/assets/program-community.jpg";
import logoAsset from "@/assets/bimba-logo.png.asset.json";
import donationQrAsset from "@/assets/bimba-donation-qr.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bimba Nepal — Advancing Community Health in Nepal" },
      {
        name: "description",
        content:
          "Bimba Nepal is a non-profit advancing community health through prevention, awareness, screening, and access — across geriatrics, women's health, mental health, radiology, and medical-legal support.",
      },
      { property: "og:title", content: "Bimba Nepal — Advancing Community Health in Nepal" },
      {
        property: "og:description",
        content:
          "Prevention, awareness, and access to care across Nepal. Established 2082 BS. Affiliated with the Social Welfare Council.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: heroImg },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <VisionMission />
        <FocusAreas />
        <Pilot />
        <Values />
        <Approach />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" aria-label="Bimba Nepal home" className="flex items-center">
          <img src={logoAsset.url} alt="Bimba Nepal" className="h-10 w-auto rounded-md bg-background/90 px-2 py-1 backdrop-blur" />
        </a>
        <ul className="hidden items-center gap-8 text-sm text-background/90 md:flex">
          <li><a href="#about" className="transition hover:text-background">About</a></li>
          <li><a href="#focus" className="transition hover:text-background">Focus Areas</a></li>
          <li><a href="#pilot" className="transition hover:text-background">Pilot Initiative</a></li>
          <li><a href="#contact" className="transition hover:text-background">Contact</a></li>
        </ul>
        <a
          href="#donate"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-warm)] transition hover:opacity-90"
        >
          Donate
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden">
      <img
        src={heroImg}
        alt="A community gathering in rural Nepal with the Himalayas in the background"
        width={1600}
        height={1100}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-background backdrop-blur">
            Established 2082 BS • Affiliated with Social Welfare Council
          </span>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-background sm:text-6xl md:text-7xl">
            Advancing community health in Nepal.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-background/85">
            Prevention, awareness, early detection, and access to care — built
            together with communities, healthcare professionals, and institutions
            across Nepal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#donate"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-warm)] transition hover:opacity-90"
            >
              Support our work
            </a>
            <a
              href="#focus"
              className="inline-flex items-center rounded-full border border-background/40 bg-background/5 px-6 py-3 text-sm font-medium text-background backdrop-blur transition hover:bg-background/15"
            >
              See our focus areas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">About Bimba Nepal</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Healthier communities through prevention, awareness, and access.
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Bimba Nepal is a non-profit organization registered in Nepal and
            affiliated with the Social Welfare Council. We are committed to
            improving the health and well-being of communities through preventive
            healthcare, health education, early detection, community outreach,
            and access to appropriate support services.
          </p>
          <p>
            Our work brings together expertise in Geriatrics, Gynecology,
            Radiology, Mental Health, and Medical-Legal Information and Referral
            Support — combining community engagement with evidence-based
            practices to promote health, dignity, and quality of life for people
            across Nepal.
          </p>
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
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
  return (
    <section className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">Our Vision</span>
          <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight">
            A healthier, more informed, and equitable Nepal.
          </h3>
          <p className="mt-4 text-muted-foreground">
            Where individuals and communities have access to preventive
            healthcare, reliable health information, and appropriate support
            systems.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">Our Mission</span>
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

const focusAreas = [
  {
    title: "Geriatric Health & Healthy Aging",
    body: "Awareness, screening, and education on chronic disease prevention, mobility, dementia and cognitive health, caregiver support, and social engagement for senior citizens.",
    img: communityImg,
    alt: "Older community members in conversation",
  },
  {
    title: "Women's Health & Gynecology",
    body: "Reproductive and menstrual health education, maternal health awareness, preventive gynecological screening, consultations, and community programs.",
    img: womenImg,
    alt: "Nepali women in a community workshop",
  },
  {
    title: "Radiology & Diagnostic Health",
    body: "Community screening programs, diagnostic awareness, early-detection initiatives, and clear referral pathways for further evaluation.",
    img: eduImg,
    alt: "Health worker engaging with a community member",
  },
  {
    title: "Mental Health & Community Well-Being",
    body: "Mental health literacy, stigma reduction, emotional well-being promotion, stress and resilience awareness, and referrals to qualified professionals.",
    img: communityImg,
    alt: "Quiet Himalayan landscape representing well-being",
  },
  {
    title: "Medical-Legal Information & Referral",
    body: "A neutral first point of contact offering medical-legal information, resource navigation, and referrals — for patients, families, and healthcare professionals.",
    img: eduImg,
    alt: "People reviewing information together",
  },
];

function FocusAreas() {
  return (
    <section id="focus" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">Our Areas of Focus</span>
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
        Our Medical-Legal Referral service does not provide legal representation,
        conduct investigations, determine liability, or issue legal opinions. We
        help individuals navigate available pathways and connect with appropriate
        professional resources in a neutral, responsible manner.
      </p>
    </section>
  );
}

function Pilot() {
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
            <span className="text-sm font-medium uppercase tracking-wider text-primary">Pilot Initiative</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Community health screening for adults 30+.
            </h2>
          </div>
          <p className="md:col-span-6 text-lg text-muted-foreground">
            Our first phase establishes a baseline of community health, promotes
            preventive care, and informs future programs. Many chronic conditions
            develop silently in adulthood — early screening enables timely action
            before complications arise.
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

const values = [
  { title: "Community First", body: "We place communities at the center of our work and address local health needs through inclusive, participatory approaches." },
  { title: "Prevention & Early Action", body: "Prevention and early detection are among the most effective ways to improve long-term health outcomes." },
  { title: "Integrity & Professionalism", body: "We uphold ethical standards, transparency, accountability, and respect in all activities." },
  { title: "Collaboration", body: "We work alongside healthcare professionals, institutions, community leaders, and stakeholders to maximize impact." },
  { title: "Compassion & Dignity", body: "Every individual deserves access to information, care, and support with dignity and respect." },
];

function Values() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">Core Values</span>
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

const approach = [
  { title: "Community-Centered", body: "We listen to communities and work to address locally identified health priorities." },
  { title: "Evidence-Based", body: "Programs informed by data, research, professional expertise, and community feedback." },
  { title: "Preventive & Proactive", body: "We emphasize prevention, awareness, and early action as drivers of better outcomes." },
  { title: "Collaborative", body: "We partner with professionals, institutions, and local leaders for sustainable impact." },
  { title: "Ethical & Neutral", body: "We maintain professionalism, confidentiality, fairness, and respect in all interactions." },
];

function Approach() {
  return (
    <section className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">Our Approach</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Looking ahead.
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Bimba Nepal envisions a future where every individual has access to
            reliable health information, preventive healthcare opportunities, and
            appropriate support systems. Together, we can build healthier
            communities through awareness, prevention, dignity, and access to care.
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

function CTA() {
  return (
    <section id="donate" className="px-6 py-24">
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-3xl p-10 md:p-16"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-primary-foreground md:text-5xl">
              Support healthier communities.
            </h2>
            <p className="mt-4 max-w-lg text-primary-foreground/90">
              A contribution of any size helps fund community screening,
              education, and referral support. Scan the Fonepay QR with any
              Nepali mobile banking app, digital wallet, or UnionPay to donate
              instantly.
            </p>
            <div id="contact" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="mailto:mail@bimba.org.np"
                className="inline-flex items-center justify-center rounded-full border border-background/40 px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-background/10"
              >
                mail@bimba.org.np
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590730554027"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-background/40 px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-background/10"
              >
                Facebook — BIMBA NEPAL
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-background p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Scan to donate via Fonepay
            </p>
            <img
              src={donationQrAsset.url}
              alt="Fonepay QR code for BIMBA NEPAL donations — Kumari Bank, Samakhushi branch"
              className="w-full max-w-xs rounded-lg"
              loading="lazy"
            />
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">BIMBA NEPAL</p>
              <p>Kumari Bank — Samakhushi Branch</p>
              <p className="text-xs">Terminal: 2222140020979219</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <img src={logoAsset.url} alt="Bimba Nepal" className="h-9 w-auto" />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href="mailto:mail@bimba.org.np" className="text-muted-foreground transition hover:text-foreground">
            mail@bimba.org.np
          </a>
          <span className="hidden text-border md:inline">|</span>
          <a
            href="https://www.facebook.com/profile.php?id=61590730554027"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Facebook
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bimba Nepal • Registered NGO • Affiliated with Social Welfare Council
        </p>
      </div>
    </footer>
  );
}
