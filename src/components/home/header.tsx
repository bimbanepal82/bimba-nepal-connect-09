import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/bimba-logo.png.asset.json";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const HIDE_THRESHOLD = 80;
const HEADER_HEIGHT = 72;

export function Header() {
  const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#focus", label: "Focus Areas" },
    { href: "/#pilot", label: "Pilot Initiative" },
    { href: "/notices", label: "Notices" },
    { href: "/#contact", label: "Contact" },
  ];

  const [visible, setVisible] = useState(true);

  const [scrolled, setScrolled] = useState(false);

  const [isSolid, setIsSolid] = useState(false);
  const lastScrollY = useRef(0);

  // Hide/show on scroll direction
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setScrolled(window.scrollY > 0);
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      setScrolled(currentY > 0);
      if (currentY < HIDE_THRESHOLD) {
        setVisible(true);
      } else if (delta > 4) {
        setVisible(false);
      } else if (delta < -4) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const aboutEl = document.getElementById("hero");
    if (!aboutEl) {
      setIsSolid(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSolid(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(aboutEl);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        isSolid
          ? "bg-white  border-b border-border/60"
          : scrolled
            ? "bg-white/5 backdrop-blur-xs shadow-sm border-b border-transparent"
            : "bg-transparent backdrop-blur-0 border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Bimba Nepal home" className="flex items-center">
          <img src={logoAsset.url} alt="Bimba Nepal" className="h-9 w-auto" />
        </Link>

        <ul
          className={`hidden items-center gap-8 text-sm font-medium md:flex transition-colors duration-300 ${
            isSolid ? "text-neutral-800" : "text-background/90"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="transition hover:text-primary"
                activeOptions={{ exact: link.href === "/" }}
                activeProps={{
                  className: "text-primary",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
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
