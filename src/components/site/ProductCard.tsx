import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatINR, type Product } from "@/lib/store";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="card-lift group flex flex-col border border-border bg-card">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.compare_at_price && product.compare_at_price > product.price ? (
          <span className="absolute top-4 left-4 bg-accent px-3 py-1 text-[0.6rem] tracking-[0.2em] text-accent-foreground uppercase">
            Sale
          </span>
        ) : null}
        {product.stock <= 0 ? (
          <span className="absolute top-4 right-4 bg-ink px-3 py-1 text-[0.6rem] tracking-[0.2em] text-[color:var(--sand)] uppercase">
            Sold out
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase">{product.category}</p>
        <h3 className="mt-2 font-display text-xl leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-lg">{formatINR(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price ? (
            <span className="text-sm text-muted-foreground line-through">{formatINR(product.compare_at_price)}</span>
          ) : null}
        </div>
        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={() => {
            add({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            });
            toast.success(`${product.name} added to bag`);
          }}
          className="mt-5 border border-ink bg-transparent py-3 text-[0.68rem] tracking-[0.26em] uppercase transition-colors hover:bg-ink hover:text-[color:var(--sand)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock <= 0 ? "Sold out" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}
