import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Free Trial — Sachin Family Salon" },
      {
        name: "description",
        content: "Call, WhatsApp or visit Sachin Family Salon in Silvassa to book a free wig or hair patch trial.",
      },
      { property: "og:title", content: "Contact & Free Trial — Sachin Family Salon" },
      { property: "og:description", content: "Book a free wig or hair patch trial at our Silvassa studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <header className="border-b border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <p className="text-xs tracking-[0.34em] text-primary uppercase">Say hello</p>
          <h1 className="mt-4 font-display text-5xl">Book a free trial</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Send us a message on WhatsApp with a photo of your hair, or simply walk into the studio. Consultations are
            always free.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2">
        <div className="space-y-7">
          {[
            { icon: MapPin, label: "Studio", value: settings?.address },
            { icon: Phone, label: "Call", value: settings?.phone },
            { icon: MessageCircle, label: "WhatsApp", value: settings?.phone },
            { icon: Mail, label: "Email", value: settings?.email },
            { icon: Clock, label: "Open", value: "Monday to Sunday, 9:30 am – 9:00 pm" },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 border-b border-border pb-6">
              <row.icon className="mt-1 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{row.label}</p>
                <p className="mt-1.5">{row.value}</p>
              </div>
            </div>
          ))}
          {settings?.whatsapp ? (
            <a
              href={waLink(settings.whatsapp, waMessage.booking(settings.salon_name))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-primary px-9 py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase"
            >
              Message on WhatsApp
            </a>
          ) : null}
        </div>

        <div className="border border-border bg-card p-9">
          <h2 className="font-display text-3xl">What to expect in your sitting</h2>
          <ol className="mt-7 space-y-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <span className="text-foreground">1. Assessment —</span> we look at density, pattern and scalp condition.
            </li>
            <li>
              <span className="text-foreground">2. Trial —</span> wear a sample system and see yourself in the mirror.
            </li>
            <li>
              <span className="text-foreground">3. Measurements —</span> a template of your head for a custom base.
            </li>
            <li>
              <span className="text-foreground">4. Delivery —</span> fitting and cut in about two hours.
            </li>
          </ol>
          <p className="mt-8 text-sm text-muted-foreground">
            No pressure to buy on the day. Most clients come back after thinking it over.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
