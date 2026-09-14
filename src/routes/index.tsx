import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, HeartHandshake, Scissors, Sparkles, Truck } from "lucide-react";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { heroSlidesQuery, productsQuery, settingsQuery } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sachin Unisex Salon — Natural Human Hair Wigs in Silvassa" },
      {
        name: "description",
        content:
          "Shop natural human hair wigs, men's hair patches and extensions from Sachin Unisex Salon, Silvassa. Free trial, hand fitting and cash on delivery.",
      },
      { property: "og:title", content: "Sachin Unisex Salon — Natural Human Hair Wigs in Silvassa" },
      {
        property: "og:description",
        content: "Hand-fitted human hair wigs and patches with a free studio trial in Silvassa.",
      },
    ],
  }),
  component: HomePage,
});

const promises = [
  { icon: Sparkles, title: "100% human hair", copy: "Sourced, sorted and sanitised before a single strand is knotted." },
  { icon: Scissors, title: "Hand-fitted", copy: "Every wig and patch is cut and blended on you, inside our studio." },
  { icon: Truck, title: "All-India delivery", copy: "Discreet packaging with cash on delivery available." },
  { icon: HeartHandshake, title: "Lifetime support", copy: "Free servicing and refitting for as long as you wear it." },
];

const steps = [
  { n: "01", title: "Free consultation", copy: "Walk in or WhatsApp us photos. We assess density, pattern and scalp." },
  { n: "02", title: "Choose your base", copy: "Lace, mono or skin — we match texture and colour to your own hair." },
  { n: "03", title: "Fitting & cut", copy: "A two hour sitting and you walk out looking like you always did." },
  { n: "04", title: "Aftercare", copy: "Monthly servicing, re-taping and styling whenever you need it." },
];

const reviews = [
  { name: "Ravi P.", city: "Silvassa", text: "Nobody at my office noticed. That is the highest compliment I can give." },
  { name: "Meenal S.", city: "Vapi", text: "The wave wig looks exactly like my old hair. Worth every rupee." },
  { name: "Imran K.", city: "Daman", text: "Sachin bhai spent two hours on the cut alone. Proper craftsmanship." },
];

function HomePage() {
  const { data: slides = [] } = useQuery(heroSlidesQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const { data: settings } = useQuery(settingsQuery);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <SiteLayout>
      <HeroSlider slides={slides} />

      <section className="border-b border-border bg-secondary/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon className="mt-1 size-5 text-primary" />
              <div>
                <p className="text-sm tracking-[0.16em] uppercase">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.34em] text-primary uppercase">Bestsellers</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Hair that behaves like your own</h2>
          </div>
          <Link to="/shop" className="border-b border-ink pb-1 text-xs tracking-[0.26em] uppercase">
            View all products
          </Link>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-[color:var(--sand)]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
          <img
            src="/images/studio.jpg"
            alt="Inside the Sachin Unisex Salon studio"
            loading="lazy"
            className="h-[420px] w-full object-cover"
          />
          <div>
            <p className="text-xs tracking-[0.34em] text-primary uppercase">The studio</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl">
              A local salon obsessed with natural hairlines
            </h2>
            <p className="mt-6 leading-relaxed opacity-80">
              {settings?.salon_name ?? "Sachin Unisex Salon"} has been styling {settings?.address?.split(",")[1]?.trim() || "Silvassa"} for
              years. We build hair systems the slow way — measured, knotted, fitted and cut by hand, so the join
              disappears the moment you look in the mirror.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { k: "4,000+", v: "Fittings done" },
                { k: "12 yrs", v: "Behind the chair" },
                { k: "4.9★", v: "Client rating" },
              ].map((stat) => (
                <div key={stat.v}>
                  <p className="font-display text-3xl text-primary">{stat.k}</p>
                  <p className="mt-1 text-xs tracking-[0.18em] uppercase opacity-70">{stat.v}</p>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="mt-10 inline-flex border border-white/30 px-8 py-4 text-xs tracking-[0.26em] uppercase"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs tracking-[0.34em] text-primary uppercase">How it works</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">Four steps to your new hair</h2>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="bg-background p-8">
              <p className="font-display text-4xl text-primary">{step.n}</p>
              <p className="mt-5 text-sm tracking-[0.16em] uppercase">{step.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-center gap-4">
            <Award className="size-5 text-primary" />
            <p className="text-xs tracking-[0.34em] uppercase">Client love</p>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.name} className="border border-border bg-card p-8">
                <blockquote className="font-display text-xl leading-relaxed">“{review.text}”</blockquote>
                <figcaption className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  {review.name} · {review.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl">Book a free trial sitting</h2>
        <p className="mt-5 text-muted-foreground">
          Try a wig or patch on before you buy anything. Walk in, or message us and we'll keep a slot ready.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="bg-primary px-9 py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase">
            Shop the collection
          </Link>
          {settings?.whatsapp ? (
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="border border-ink px-9 py-4 text-xs tracking-[0.26em] uppercase"
            >
              WhatsApp us
            </a>
          ) : null}
        </div>
      </section>
    </SiteLayout>
  );
}
