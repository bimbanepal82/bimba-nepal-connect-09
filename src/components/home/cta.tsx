import donationQrAsset from "@/assets/bimba-donation-qr.jpeg.asset.json";

export function CTA() {
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
