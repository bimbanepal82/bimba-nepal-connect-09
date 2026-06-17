import donationQrAsset from "@/assets/bimba-donation-qr.jpeg.asset.json";
import logoAsset from "@/assets/bimba-logo.png.asset.json";
import heroImg from "@/assets/hero-bimba.jpg";
import diagnosticImg from "@/assets/program-diagnostic.jpg";
import geriatricImg from "@/assets/program-geriatric.jpg";
import legalImg from "@/assets/program-legal.jpg";
import mentalImg from "@/assets/program-mental.jpg";
import womenImg from "@/assets/program-women.jpg";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  loadDocuments,
  DocumentRecord,
  DocumentType,
  isPreviewSupported,
} from "@/lib/document-storage";
import { FileText, Download, Search, Eye, Calendar, X, ShieldCheck } from "lucide-react";
import { getSession } from "@/utils/auth.server";
import { Button } from "@/components/ui/button";

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
        <NoticesSection />
        <Values />
        <Approach />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getSession().then((session) => setIsAdmin(Boolean(session?.user)));
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#focus", label: "Focus Areas" },
    { href: "#pilot", label: "Pilot Initiative" },
    { href: "#notices", label: "Notices" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" aria-label="Bimba Nepal home" className="flex items-center">
          <img
            src={logoAsset.url}
            alt="Bimba Nepal"
            className="h-10 w-auto rounded-md bg-background/90 px-2 py-1 backdrop-blur"
          />
        </a>

        <ul className="hidden items-center gap-8 text-sm text-background/90 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className="transition hover:text-primary transform">
                {link.label}
              </Link>
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className="group relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-primary/40 bg-primary/40 px-2 py-1 text-white backdrop-blur transition-all duration-300 hover:border-primary/70 hover:bg-primary/50 hover:text-white"
              >
                <ShieldCheck className="size-3.5" />
                <span>Admin</span>
              </Link>
            </li>
          )}
        </ul>

        <Button
          asChild
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-warm)] transition hover:opacity-90"
        >
          <a href="#donate">Donate</a>
        </Button>
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
            Prevention, awareness, early detection, and access to care — built together with
            communities, healthcare professionals, and institutions across Nepal.
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
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            About Bimba Nepal
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Healthier communities through prevention, awareness, and access.
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Bimba Nepal is a non-profit organization registered in Nepal and affiliated with the
            Social Welfare Council. We are committed to improving the health and well-being of
            communities through preventive healthcare, health education, early detection, community
            outreach, and access to appropriate support services.
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

function FocusAreas() {
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

function Values() {
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

function Approach() {
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
              A contribution of any size helps fund community screening, education, and referral
              support. Scan the Fonepay QR with any Nepali mobile banking app, digital wallet, or
              UnionPay to donate instantly.
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
          <a
            href="mailto:mail@bimba.org.np"
            className="text-muted-foreground transition hover:text-foreground"
          >
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
          © {new Date().getFullYear()} Bimba Nepal • Registered NGO • Affiliated with Social Welfare
          Council
        </p>
      </div>
    </footer>
  );
}

function NoticesSection() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentType | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    setDocuments(loadDocuments());
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        if (selectedCategory === "All") return true;
        return doc.type === selectedCategory;
      })
      .filter((doc) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.trim().toLowerCase();
        return (
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.fileName.toLowerCase().includes(query)
        );
      });
  }, [documents, selectedCategory, searchTerm]);

  return (
    <section id="notices" className="mx-auto max-w-7xl px-6 py-24 md:py-32 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Updates & Publications
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Notice Board & Document Library
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Access Bimba Nepal's official notices, project reports, announcements, and newsletter
            updates.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-full border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mt-12 flex flex-wrap gap-2.5 border-b border-border pb-6">
        {(["All", "Notice", "Report", "Newsletter"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-warm)]"
                : "border border-input bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat === "All" ? "All Documents" : `${cat}s`}
          </button>
        ))}
      </div>

      {/* Grid of Documents */}
      {filteredDocuments.length === 0 ? (
        <div className="mt-12 text-center py-20 rounded-2xl border border-dashed border-border bg-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 font-serif text-xl font-medium">No documents found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
            {searchTerm.trim()
              ? "We couldn't find any documents matching your search term."
              : `There are currently no published ${selectedCategory === "All" ? "documents" : selectedCategory.toLowerCase() + "s"}.`}
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => {
            // Pick a color for category badges
            let badgeStyle =
              "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
            if (doc.type === "Report") {
              badgeStyle = "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400";
            } else if (doc.type === "Newsletter") {
              badgeStyle = "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
            }

            return (
              <article
                key={doc.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${badgeStyle}`}
                    >
                      {doc.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between gap-4">
                  <span
                    className="truncate text-xs text-muted-foreground max-w-[120px]"
                    title={doc.fileName}
                  >
                    {doc.fileName}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    {isPreviewSupported(doc.fileType) && (
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    )}
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-[var(--shadow-warm)] transition hover:opacity-90 cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-serif text-xl font-bold">{previewDoc.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{previewDoc.fileName}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-full p-1.5 hover:bg-muted transition text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 min-h-[50vh] mt-4 flex items-center justify-center overflow-auto rounded-xl bg-muted p-2">
              {previewDoc.fileType.startsWith("image/") ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
                />
              ) : previewDoc.fileType === "application/pdf" ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.title}
                  className="w-full h-[60vh] rounded-lg border-0"
                />
              ) : (
                <div className="text-center p-8 text-sm text-muted-foreground">
                  Preview is not supported for this file type.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
