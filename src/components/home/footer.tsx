import logoAsset from "@/assets/bimba-logo.png.asset.json";

export function Footer() {
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
