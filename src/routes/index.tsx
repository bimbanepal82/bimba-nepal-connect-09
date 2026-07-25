import heroImg from "@/assets/hero-bimba.jpg";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { VisionMission } from "@/components/home/vision-mission";
import { FocusAreas } from "@/components/home/focus-area";
import { Pilot } from "@/components/home/pilot";
import { Values } from "@/components/home/values";
import { Approach } from "@/components/home/approach";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { NoticesSection } from "@/components/home/notices/notice-section";

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
