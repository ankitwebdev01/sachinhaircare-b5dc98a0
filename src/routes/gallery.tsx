import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Sachin Family Salon" },
      { name: "description", content: "Inside the studio: hair patch fittings, wig styling, transformations and everyday salon work at Sachin Family Salon, Silvassa." },
      { property: "og:title", content: "Gallery — Sachin Family Salon" },
      { property: "og:description", content: "Inside the studio: fittings, styling and transformations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

type Shot = { src: string; caption: string };

const shots: Shot[] = [
  { src: "/images/studio.jpg", caption: "Inside the Amli studio" },
  { src: "/images/hero-1.jpg", caption: "Hair patch fitting session" },
  { src: "/images/cat-a1.jpg", caption: "Natural hairline work" },
  { src: "/images/product-wig-straight.jpg", caption: "Straight human hair wig" },
  { src: "/images/hero-2.jpg", caption: "The styling station" },
  { src: "/images/cat-a2.jpg", caption: "Patch blended & cut" },
  { src: "/images/product-wig-wave.jpg", caption: "Soft wave wig, unstyled" },
  { src: "/images/cat-a3.jpg", caption: "Density matching" },
  { src: "/images/hero-3.jpg", caption: "Evening glow at the salon" },
  { src: "/images/cat-a4.jpg", caption: "Before the final trim" },
  { src: "/images/product-wig-curly.jpg", caption: "Curly human hair wig" },
  { src: "/images/cat-b1.jpg", caption: "Bridal styling in progress" },
  { src: "/images/product-extensions.jpg", caption: "Hair extensions, clip-in set" },
  { src: "/images/cat-b2.jpg", caption: "Colour & highlights" },
  { src: "/images/product-patch.jpg", caption: "Hair patch systems in stock" },
  { src: "/images/cat-b3.jpg", caption: "Hair spa day" },
  { src: "/images/product-carekit.jpg", caption: "Care kit — tape, shampoo & comb" },
  { src: "/images/cat-b4.jpg", caption: "The finishing touch" },
];

function GalleryPage() {
  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-14 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">Straight from the chair</p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-accent md:text-6xl">
            The <span className="text-primary">Gallery</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Fittings, styling, transformations and everyday moments inside the studio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>figure]:mb-4">
          {shots.map((shot) => (
            <figure key={shot.src} className="break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img src={shot.src} alt={shot.caption} loading="lazy" className="w-full object-cover" />
              <figcaption className="px-4 py-2.5 text-xs text-muted-foreground">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
