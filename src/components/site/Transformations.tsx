import { useEffect, useRef } from "react";
import { transformationsQuery, type Transformation } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";

const MAX_ITEMS = 10;
const placeholderCount = 4;

/** Transformations — auto-sliding before/after rail, max 10 pairs. */
export function Transformations() {
  const { data: items = [] } = useQuery(transformationsQuery);
  const rail = useRef<HTMLDivElement>(null);
  const shown = items.slice(0, MAX_ITEMS);

  useEffect(() => {
    if (shown.length < 2) return;
    const el = rail.current;
    if (!el) return;
    const t = setInterval(() => {
      const el2 = rail.current;
      if (!el2) return;
      const nearEnd = el2.scrollLeft + el2.clientWidth >= el2.scrollWidth - 8;
      if (nearEnd) {
        el2.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el2.scrollBy({ left: el2.clientWidth * 0.6, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(t);
  }, [shown.length]);

  const list = shown.length ? shown : null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-center gap-4">
          <span className="hidden h-px w-16 bg-border sm:block" />
          <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">Transformations</h2>
          <span className="hidden h-px w-16 bg-border sm:block" />
        </div>

        <div
          ref={rail}
          className="mt-10 flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list
            ? list.map((t) => <PairCard key={t.id} item={t} />)
            : Array.from({ length: placeholderCount }).map((_, i) => <PlaceholderPair key={i} />)}
        </div>
        {list ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">Sliding automatically — swipe to browse</p>
        ) : null}
      </div>
    </section>
  );
}

function PairCard({ item }: { item: Transformation }) {
  return (
    <figure className="flex w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-card shadow-md sm:w-80">
      <Frame src={item.before_url} label="Before" alt={item.caption ? `${item.caption} — before` : "Before"} />
      <span className="w-px shrink-0 bg-border" />
      <Frame src={item.after_url} label="After" alt={item.caption ? `${item.caption} — after` : "After"} accent />
    </figure>
  );
}

function Frame({ src, label, alt, accent }: { src: string; label: string; alt: string; accent?: boolean }) {
  return (
    <div className="relative aspect-[3/4] w-1/2">
      {src ? <img src={src} alt={alt} loading="lazy" className="size-full object-cover" /> : null}
      <span
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[0.6rem] tracking-[0.14em] uppercase shadow"
        style={{
          background: accent ? "var(--primary)" : "var(--card, #ffffff)",
          color: accent ? "var(--primary-foreground)" : "var(--foreground)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function PlaceholderPair() {
  return (
    <figure className="flex w-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-dashed border-border bg-card shadow-sm sm:w-80">
      {["Before", "After"].map((label) => (
        <div key={label} className="flex aspect-[3/4] w-1/2 items-center justify-center border-border bg-secondary/60 text-center text-xs text-muted-foreground first:border-r">
          {label} photo — add from dashboard
        </div>
      ))}
    </figure>
  );
}
