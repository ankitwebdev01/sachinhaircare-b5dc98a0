import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { settingsQuery } from "@/lib/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Studio — Sachin Family Salon, Silvassa" },
      {
        name: "description",
        content:
          "Meet the team behind Sachin Family Salon in Silvassa — hair systems, wigs and patches fitted by hand since day one.",
      },
      { property: "og:title", content: "Our Studio — Sachin Family Salon, Silvassa" },
      { property: "og:description", content: "A local salon building natural hair systems by hand in Silvassa." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <header className="border-b border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <p className="text-xs tracking-[0.34em] text-primary uppercase">Since day one</p>
          <h1 className="mt-4 font-display text-5xl">A local salon, a national obsession with natural hair</h1>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2">
        <img src="/images/studio.jpg" alt="Salon interior" loading="lazy" className="h-[440px] w-full object-cover" />
        <div>
          <h2 className="font-display text-4xl">Built chair by chair</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {settings?.salon_name ?? "Sachin Family Salon"} started as a neighbourhood unisex salon and grew into a hair
            studio people travel to. We are not a big brand and we have never been on television — our work travels by
            word of mouth from one client to the next.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every wig and patch we sell is 100% human hair. We measure your head, match texture and density to your own
            hair, knot the base, and then cut it on you so the hairline reads as skin, not as a wig.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              { k: "4,000+", v: "Fittings" },
              { k: "12 yrs", v: "Experience" },
              { k: "100%", v: "Human hair" },
            ].map((s) => (
              <div key={s.v}>
                <p className="font-display text-3xl text-primary">{s.k}</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-[color:var(--sand)]">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="font-display text-4xl">What we do in the studio</h2>
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {[
              { t: "Hair systems", c: "Custom wigs and patches made to your measurements, fitted and cut in-house." },
              { t: "Salon services", c: "Cuts, colour, beard styling, facials and bridal work for men and women." },
              { t: "Servicing", c: "Monthly re-taping, washing and restyling so your system stays natural." },
            ].map((item) => (
              <div key={item.t} className="bg-ink p-9">
                <p className="font-display text-2xl">{item.t}</p>
                <p className="mt-4 text-sm leading-relaxed opacity-75">{item.c}</p>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="mt-12 inline-flex bg-primary px-9 py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase"
          >
            Book a sitting
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
