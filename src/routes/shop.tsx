import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { productsQuery } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Wigs, Patches & Extensions — Sachin Unisex Salon" },
      {
        name: "description",
        content:
          "Browse human hair wigs, men's hair patches, clip-in extensions and care kits from Sachin Unisex Salon, Silvassa.",
      },
      { property: "og:title", content: "Shop Wigs, Patches & Extensions — Sachin Unisex Salon" },
      { property: "og:description", content: "Human hair wigs, patches, extensions and care kits, delivered across India." },
    ],
  }),
  component: ShopPage,
});

const sorts = [
  { key: "featured", label: "Featured" },
  { key: "low", label: "Price: low to high" },
  { key: "high", label: "Price: high to low" },
] as const;

function ShopPage() {
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("featured");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const visible = useMemo(() => {
    const list = products.filter((p) => category === "All" || p.category === category);
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
  }, [products, category, sort]);

  return (
    <SiteLayout>
      <header className="border-b border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <p className="text-xs tracking-[0.34em] text-primary uppercase">The collection</p>
          <h1 className="mt-4 font-display text-5xl">Wigs, patches &amp; extensions</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every piece is 100% human hair, fitted free of charge at our Silvassa studio and shipped anywhere in India.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className="border px-5 py-2.5 text-[0.68rem] tracking-[0.2em] uppercase transition-colors"
                style={
                  category === c
                    ? { background: "var(--ink)", color: "var(--sand)", borderColor: "var(--ink)" }
                    : { borderColor: "var(--border)" }
                }
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="border border-border bg-background px-4 py-2.5 text-xs tracking-[0.16em] uppercase"
          >
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="py-20 text-center text-muted-foreground">Loading the collection…</p>
        ) : visible.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
