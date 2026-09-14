import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR, productsQuery } from "@/lib/store";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${name} — Sachin Unisex Salon` },
        { name: "description", content: `${name} in 100% human hair, hand-fitted at Sachin Unisex Salon, Silvassa.` },
        { property: "og:title", content: `${name} — Sachin Unisex Salon` },
        { property: "og:description", content: `${name} in 100% human hair with free studio fitting.` },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { data: products = [], isLoading } = useQuery(productsQuery);

  const product = products.find((p) => p.slug === slug);
  const related = products.filter((p) => p.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <SiteLayout>
        <p className="py-32 text-center text-muted-foreground">Loading…</p>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-5 py-32 text-center">
          <h1 className="font-display text-4xl">This product is no longer listed</h1>
          <Link to="/shop" className="mt-8 inline-block border-b border-ink pb-1 text-xs tracking-[0.24em] uppercase">
            Back to shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const addToBag = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      quantity,
    );
    toast.success(`${product.name} added to bag`);
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-12">
        <nav className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          <Link to="/shop">Shop</Link> <span className="px-2">/</span> {product.category}
        </nav>

        <div className="mt-8 grid gap-14 lg:grid-cols-2">
          <div className="bg-secondary">
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] text-primary uppercase">{product.category}</p>
            <h1 className="mt-4 font-display text-4xl md:text-5xl">{product.name}</h1>
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-2xl">{formatINR(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price ? (
                <span className="text-muted-foreground line-through">{formatINR(product.compare_at_price)}</span>
              ) : null}
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-border py-6 text-sm">
              {product.hair_length ? (
                <div>
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Length</dt>
                  <dd className="mt-1.5">{product.hair_length}</dd>
                </div>
              ) : null}
              {product.hair_color ? (
                <div>
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Colour</dt>
                  <dd className="mt-1.5">{product.hair_color}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Availability</dt>
                <dd className="mt-1.5">{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-border">
                <button type="button" aria-label="Decrease" className="p-3.5" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button type="button" aria-label="Increase" className="p-3.5" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={addToBag}
                className="flex-1 bg-ink px-8 py-4 text-xs tracking-[0.26em] text-[color:var(--sand)] uppercase disabled:opacity-40"
              >
                {product.stock > 0 ? "Add to bag" : "Sold out"}
              </button>
              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={() => {
                  addToBag();
                  navigate({ to: "/checkout" });
                }}
                className="flex-1 bg-primary px-8 py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase disabled:opacity-40"
              >
                Buy now
              </button>
            </div>

            <ul className="mt-9 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Check className="size-4 text-primary" /> Free fitting and cut at our Silvassa studio
              </li>
              <li className="flex items-center gap-3">
                <Truck className="size-4 text-primary" /> Cash on delivery across India
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-primary" /> Lifetime servicing support
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-24">
            <h2 className="font-display text-3xl">You may also like</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}
