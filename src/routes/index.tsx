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
      { title: "Bimba Nepal — Empowering Communities in the Himalayas" },
      {
        name: "description",
        content:
          "Bimba Nepal is a grassroots NGO building stronger futures through education, women's empowerment, and community development across rural Nepal.",
      },
      { property: "og:title", content: "Bimba Nepal — Empowering Communities in the Himalayas" },
      {
        property: "og:description",
        content:
          "Grassroots programs across rural Nepal: education, women's empowerment, and community development.",
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
        <Mission />
        <Programs />
        <Impact />
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
          <li><a href="#mission" className="transition hover:text-background">Mission</a></li>
          <li><a href="#programs" className="transition hover:text-background">Programs</a></li>
          <li><a href="#impact" className="transition hover:text-background">Impact</a></li>
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
        alt="Children smiling in a rural Nepali classroom with the Himalayas in the background"
        width={1600}
        height={1100}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-background backdrop-blur">
            Grassroots NGO • Est. 2014
          </span>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-background sm:text-6xl md:text-7xl">
            Strong roots,<br />stronger futures.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-background/85">
            Bimba Nepal works hand in hand with communities across the Himalayan
            foothills — building schools, supporting women, and nurturing local
            livelihoods that last.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#donate"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-warm)] transition hover:opacity-90"
            >
              Support our work
            </a>
            <a
              href="#programs"
              className="inline-flex items-center rounded-full border border-background/40 bg-background/5 px-6 py-3 text-sm font-medium text-background backdrop-blur transition hover:bg-background/15"
            >
              See our programs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">Our Mission</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            A Nepal where every village can thrive on its own terms.
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="text-lg leading-relaxed text-muted-foreground">
            "Bimba" means <em className="text-foreground">reflection</em> — a mirror of
            the community itself. We don't arrive with solutions; we listen, partner,
            and amplify what's already there. From mountain schools to women-led
            cooperatives, our work is small, deliberate, and built to outlast us.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Founded</dt>
              <dd className="mt-1 font-serif text-2xl font-semibold">2014</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Districts</dt>
              <dd className="mt-1 font-serif text-2xl font-semibold">12</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Volunteers</dt>
              <dd className="mt-1 font-serif text-2xl font-semibold">180+</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

const programs = [
  {
    title: "Education for All",
    body: "Rebuilding rural classrooms, training teachers, and providing scholarships so girls and boys can finish school close to home.",
    img: eduImg,
    alt: "Teacher reading with children in a Nepali classroom",
  },
  {
    title: "Women's Empowerment",
    body: "Microloans, vocational training, and women-led cooperatives that turn traditional craft into sustainable income.",
    img: womenImg,
    alt: "Nepali women weaving together in a community workshop",
  },
  {
    title: "Community Development",
    body: "Clean water, solar lighting, and climate-resilient farming — co-designed with each village we partner with.",
    img: communityImg,
    alt: "Terraced fields and traditional houses with Himalayan mountains at sunrise",
  },
];

function Programs() {
  return (
    <section id="programs" className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">What We Do</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Three programs. One community at a time.
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {programs.map((p) => (
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
      </div>
    </section>
  );
}

const stats = [
  { value: "8,400+", label: "Children in school" },
  { value: "62", label: "Villages reached" },
  { value: "1,200", label: "Women trained" },
  { value: "94%", label: "Funds to programs" },
];

function Impact() {
  return (
    <section id="impact" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:items-end">
        <div>
          <span className="text-sm font-medium uppercase tracking-wider text-primary">Our Impact</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Real change, measured by the people who live it.
          </h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Every rupee is tracked, every project reported. We publish annual impact
          reviews and welcome independent audits — because trust is the only
          currency that matters.
        </p>
      </div>
      <dl className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-8">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd
              className="mt-3 font-serif text-5xl font-semibold"
              style={{
                background: "var(--gradient-warm)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CTA() {
  return (
    <section id="donate" className="px-6 pb-24">
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-3xl p-10 md:p-16"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-primary-foreground md:text-5xl">
              Stand with rural Nepal.
            </h2>
            <p className="mt-4 max-w-lg text-primary-foreground/90">
              A donation of any size goes directly to programs in the communities
              we serve. Scan the Fonepay QR with any Nepali mobile banking app,
              digital wallet, or UnionPay to contribute instantly.
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
          © {new Date().getFullYear()} Bimba Nepal • Kathmandu, Nepal • Registered NGO
        </p>
      </div>
    </footer>
  );
}
