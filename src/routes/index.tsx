import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Compass,
  Headphones,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BranchesScroll } from "@/components/site/BranchesScroll";
import { TrendingVideos } from "@/components/site/TrendingVideos";
import { Transformations } from "@/components/site/Transformations";
import { heroSlidesQuery, productsQuery, settingsQuery, type HeroSlide } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sachin Family Salon — Hair Patch & Wigs in Silvassa" },
      {
        name: "description",
        content:
          "Non-surgical hair patches, human hair wigs, styling, hair spa and bridal at Sachin Family Salon, Amli, Silvassa. Book a free consultation on WhatsApp.",
      },
      { property: "og:title", content: "Sachin Family Salon — Hair Patch & Wigs in Silvassa" },
      { property: "og:description", content: "No surgery, no side effects. Book a free hair consultation on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const stats = [
  { icon: Users, k: "10K+", v: "Happy clients" },
  { icon: ShieldCheck, k: "Non-surgical", v: "& safe" },
  { icon: BadgeCheck, k: "Premium", v: "Quality" },
  { icon: Headphones, k: "Expert", v: "Support" },
];

const trust = [
  { icon: Truck, t: "Free fitting", c: "With every hair system" },
  { icon: ShieldCheck, t: "100% human hair", c: "Natural look & feel" },
  { icon: RefreshCw, t: "Lifetime servicing", c: "Re-taping & styling" },
  { icon: Star, t: "Top rated", c: "360+ local ratings" },
];

const faqs = [
  { q: "Is a hair patch safe? Is there any surgery?", a: "Completely safe. A hair patch is a non-surgical hair replacement — it is fixed with medical-grade tape or glue, with no needles, no surgery and no side effects." },
  { q: "Will people be able to tell I'm wearing a patch?", a: "No. We match colour, density and texture to your own hair, then cut and blend it on you so the hairline looks like your natural scalp." },
  { q: "How long does a hair patch last?", a: "Depending on the base, 6 months to 1 year with proper care. We do monthly servicing to keep it fresh." },
  { q: "Can I bath, swim and go to the gym?", a: "Yes. Once fixed properly you can wash, sweat and swim normally. We'll show you how to look after it." },
  { q: "Do you offer a free trial or consultation?", a: "Yes — consultations are always free. Message us on WhatsApp to book a slot at our Amli, Silvassa studio." },
  { q: "Do you also do regular salon services?", a: "Yes. We are a family unisex salon offering haircuts, colour, hair spa, styling, basic makeup and bridal packages." },
];

function AdSlider({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);
  if (!slides.length) return <div className="aspect-[2/1] rounded-3xl bg-secondary" />;
  return (
    <div className="relative aspect-[2/1] overflow-hidden rounded-3xl shadow-xl">
      {slides.map((s, idx) => (
        <a
          key={s.id}
          href={s.cta_href || "/shop"}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? "auto" : "none" }}
        >
          <img src={s.image_url} alt={s.title} className="size-full object-cover" />
          <div className="hero-veil absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-[color:var(--sand)]">
            <p className="text-[0.62rem] tracking-[0.3em] uppercase opacity-80">{s.eyebrow}</p>
            <p className="mt-1 font-display text-2xl leading-tight md:text-3xl">{s.title}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">
              {s.cta_label} <ArrowRight className="size-3" />
            </span>
          </div>
        </a>
      ))}
      <div className="absolute right-5 bottom-5 flex gap-1.5">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className="h-2 rounded-full bg-[color:var(--sand)] transition-all"
            style={{ width: idx === i ? 20 : 8, opacity: idx === i ? 1 : 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const { data: slides = [] } = useQuery(heroSlidesQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const { data: settings } = useQuery(settingsQuery);
  const trendy = products.filter((p) => p.featured).slice(0, 6);
  const name = settings?.salon_name;
  const wa = settings?.whatsapp;
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  const lowest = products.length ? Math.min(...products.map((p) => p.price)) : 5999;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="bg-secondary/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-[0.68rem] font-medium tracking-[0.12em] text-accent-foreground uppercase">
              <BadgeCheck className="size-3.5" /> Silvassa's trusted non-surgical hair replacement
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold text-accent md:text-6xl">
              Best Hair Patch &amp; Non-Surgical Hair Replacement in <span className="text-primary">Silvassa</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">No surgery. No side effects. Just your hair, back.</p>

            <div className="mt-7 flex max-w-md items-center gap-6 rounded-2xl border border-primary/30 bg-card p-5">
              <div>
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">Starting at</p>
                <p className="font-display text-4xl text-primary">₹{Math.round(lowest).toLocaleString("en-IN")}/-</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-xs font-medium tracking-[0.1em] text-primary uppercase">Free consultation</p>
                <p className="mt-1 text-sm text-muted-foreground">Free trial sitting at the studio</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-4">
              <a
                href={waLink(wa, waMessage.booking(name))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-accent px-6 py-4 text-sm font-medium text-accent-foreground shadow-lg"
              >
                <Phone className="size-5" /> Book Free Consultation <ArrowRight className="size-4" />
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow-lg"
              >
                <Compass className="size-5" /> Explore <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-4 divide-x divide-border">
              {stats.map((s) => (
                <div key={s.v} className="px-2 text-center">
                  <s.icon className="mx-auto size-6 text-primary" />
                  <p className="mt-2 text-sm font-medium">{s.k}</p>
                  <p className="text-[0.68rem] text-muted-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <AdSlider slides={slides} />
            <AdSlider slides={[...slides.slice(1), ...slides.slice(0, 1)]} />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-12">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <div key={t.t} className="flex items-center gap-3">
                <t.icon className="size-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">{t.t}</p>
                  <p className="text-xs text-muted-foreground">{t.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING VIDEOS */}
      <TrendingVideos />

      {/* TRENDY PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">For him</p>
            <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
              Trendy <span className="text-primary">Hair Products</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous" onClick={() => scroll(-1)} className="rounded-full border border-border p-2.5">
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" aria-label="Next" onClick={() => scroll(1)} className="rounded-full border border-border p-2.5">
              <ArrowRight className="size-4" />
            </button>
            <Link to="/shop" className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Shop all <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div ref={rail} className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4">
          {trendy.map((p) => (
            <div key={p.id} className="w-64 shrink-0 snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <Transformations />

      {/* BRANCHES — scroll-controlled showcase */}
      <BranchesScroll />


      {/* ABOUT */}
      <section className="bg-accent py-20 text-accent-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
          <img src="/images/studio.jpg" alt="Inside the salon" loading="lazy" className="h-[420px] w-full rounded-3xl object-cover" />
          <div>
            <p className="text-xs tracking-[0.3em] uppercase opacity-80">About us</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">16 years of trusted hair care in Silvassa</h2>
            <p className="mt-6 leading-relaxed opacity-85">
              {name || "Sachin Family Salon"} is a family unisex salon on Vapi–Silvassa Road, Amli — opposite Union Bank of
              India, below Punjab National Bank. For over 16 years we've been the neighbourhood's go-to for haircuts,
              colour, hair spa, styling, basic makeup and bridal packages.
            </p>
            <p className="mt-4 leading-relaxed opacity-85">
              Today we also specialise in non-surgical hair replacement — hair patches and human hair wigs fitted, cut
              and styled by hand so nobody can tell.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { k: "16 yrs", v: "In business" },
                { k: "360+", v: "Ratings" },
                { k: "Unisex", v: "Men & women" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-3xl">{s.k}</p>
                  <p className="text-xs tracking-[0.16em] uppercase opacity-75">{s.v}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground">
              Our story <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center font-display text-4xl font-semibold md:text-5xl">
          Frequently asked <span className="text-primary">questions</span>
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}
                <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={waLink(wa, waMessage.general(name))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-7 py-3.5 text-sm font-medium text-[color:var(--sand)]"
          >
            <MessageCircle className="size-4" /> Still have a question? Ask on WhatsApp
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
