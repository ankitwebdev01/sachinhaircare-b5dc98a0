import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/lib/cart";
import { useQuery } from "@tanstack/react-query";
import { formatINR, settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Sachin Family Salon" },
      { name: "description", content: "Review the wigs, patches and care products in your bag before checkout." },
      { property: "og:title", content: "Your Bag — Sachin Family Salon" },
      { property: "og:description", content: "Review your items and checkout with cash on delivery or WhatsApp." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQuantity, remove } = useCart();
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-display text-4xl md:text-5xl">Your bag</h1>

        {lines.length === 0 ? (
          <div className="mt-10 border border-border p-14 text-center">
            <p className="text-muted-foreground">Your bag is empty right now.</p>
            <Link to="/shop" className="mt-7 inline-block bg-primary px-8 py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
            <div className="divide-y divide-border border-y border-border">
              {lines.map((line) => (
                <div key={line.id} className="flex gap-5 py-6">
                  <img src={line.image_url} alt={line.name} className="size-24 object-cover" />
                  <div className="flex-1">
                    <Link to="/product/$slug" params={{ slug: line.slug }} className="font-display text-xl">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{formatINR(line.price)}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center border border-border">
                        <button type="button" aria-label="Decrease" className="p-2.5" onClick={() => setQuantity(line.id, line.quantity - 1)}>
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm">{line.quantity}</span>
                        <button type="button" aria-label="Increase" className="p-2.5" onClick={() => setQuantity(line.id, line.quantity + 1)}>
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        className="flex items-center gap-2 text-xs tracking-[0.18em] text-muted-foreground uppercase"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-right">{formatINR(line.price * line.quantity)}</p>
                </div>
              ))}
            </div>

            <aside className="h-fit border border-border bg-card p-7">
              <p className="text-xs tracking-[0.24em] uppercase">Summary</p>
              <div className="mt-6 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>Free</span>
              </div>
              <div className="mt-6 flex justify-between border-t border-border pt-6 text-lg">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <a
                href={waLink(settings?.whatsapp, waMessage.cart(lines, subtotal, settings?.salon_name))}
                target="_blank"
                rel="noreferrer"
                className="mt-7 block rounded-lg bg-[color:var(--whatsapp)] py-4 text-center text-xs font-medium tracking-[0.2em] text-[color:var(--sand)] uppercase"
              >
                Book on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">Your items are sent to us on WhatsApp. We confirm price, fitting and delivery there.</p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
