import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatINR, settingsQuery, type Product } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { waLink, waMessage } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { data: settings } = useQuery(settingsQuery);
  const off =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0;

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {off > 0 ? (
          <span className="absolute top-3 left-3 rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-[color:var(--sand)]">
            -{off}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }}>{product.name}</Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-medium">{formatINR(product.price)}</span>
          {off > 0 ? <span className="text-xs text-muted-foreground line-through">{formatINR(product.compare_at_price!)}</span> : null}
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <a
            href={waLink(settings?.whatsapp, waMessage.product(product, settings?.salon_name))}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[color:var(--whatsapp)] py-2.5 text-xs font-medium text-[color:var(--sand)]"
          >
            <MessageCircle className="size-3.5" /> Enquire
          </a>
          <button
            type="button"
            aria-label="Add to bag"
            onClick={() => {
              add({ id: product.id, slug: product.slug, name: product.name, price: product.price, image_url: product.image_url });
              toast.success(`${product.name} added to bag`);
            }}
            className="rounded-lg border border-border px-3"
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
