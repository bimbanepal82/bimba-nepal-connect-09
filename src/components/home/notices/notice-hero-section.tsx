import heroImg from "@/assets/hero-bimba.jpg";

export function NoticesHero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt="A community gathering in rural Nepal with the Himalayas in the background"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto flex min-h-[46vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-40">
        <span className="inline-flex w-fit items-center rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-background backdrop-blur">
          Updates & Publications
        </span>
        <h1 className="mt-6 max-w-2xl font-serif text-4xl font-semibold leading-[1.05] text-background sm:text-5xl md:text-6xl">
          Notice Board & Document Library
        </h1>
        <p className="mt-5 max-w-xl text-lg text-background/85">
          Access Bimba Nepal's official notices, project reports, announcements, and newsletter
          updates.
        </p>
      </div>
    </section>
  );
}
