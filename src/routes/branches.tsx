import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BRANCHES, BranchesScroll } from "@/components/site/BranchesScroll";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Our Branches — Sachin Family Salon" },
      { name: "description", content: "12 Sachin Family Salon branches across Silvassa, Gujarat and beyond. Find your nearest studio and book on WhatsApp." },
      { property: "og:title", content: "Our Branches — Sachin Family Salon" },
      { property: "og:description", content: "12 salons, one standard of care. Find your nearest branch." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BranchesPage,
});

function BranchesPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-14 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">Now a family of 12</p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-accent md:text-6xl">
            Our <span className="text-primary">Branches</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From our flagship studio in Amli, Silvassa to 11 more cities — the same fittings, the same care, the same family.
          </p>
        </div>
      </section>

      <BranchesScroll />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">All branches at a glance</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <div key={b.city} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6">
              <div>
                <p className="text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">Branch {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 flex items-center gap-2 font-display text-2xl">
                  <MapPin className="size-4 shrink-0 text-primary" /> Sachin Salon {b.city}
                </p>
                <p className="mt-1 pl-6 text-sm text-muted-foreground">({b.pincode})</p>
                <p className="mt-3 pl-6 text-xs text-muted-foreground">{b.area}</p>
                <p className="mt-3 flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> Open daily · 9 am – 9 pm
                </p>
              </div>
              <a
                href={waLink(settings?.whatsapp, waMessage.branch(b.city, settings?.salon_name))}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-5 py-2.5 text-xs font-medium text-[color:var(--sand)]"
              >
                WhatsApp this branch
              </a>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground">
            Book at the flagship studio <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
