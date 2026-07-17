import heroImg from "@/assets/hero-bimba.jpg";

export function Hero() {
  return (
    <section id="hero" className="relative isolate min-h-[92vh] overflow-hidden">
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
          <span className="inline-flex items-center rounded-full border border-background/10 bg-background/10 px-3 py-1 text-xs font-medium capitalize tracking-wider text-background backdrop-blur">
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
