import heroImg from "@/assets/hero-bimba.jpg";

export function Hero() {
  return (
    <section id="hero" className="relative isolate min-h-[92vh] overflow-hidden">
      {/* Full-bleed background image */}
      <img
        src={heroImg}
        alt="Bimba logo and wordmark on a white background"
        width={1600}
        height={1100}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Brand gradient (keeps existing look) */}
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

      {/* Dark overlay to improve contrast; responsive opacity for different screen sizes */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-black/50 sm:bg-black/50 md:bg-black/40 lg:bg-black/30 backdrop-blur-sm"
      />

      {/* Foreground content (kept above overlays) */}
      <div className="mx-auto relative z-10 flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40">
        <div className="max-w-2xl text-white">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium tracking-wider text-white/90 backdrop-blur">
            Established 2082 BS • Affiliated with Social Welfare Council
          </span>

          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl">
            Advancing community health in Nepal.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/85">
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
              className="inline-flex items-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              See our focus areas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
