import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Sachin Family Salon" },
      { name: "description", content: "Hair patches and wigs you've saved at Sachin Family Salon." },
      { property: "og:title", content: "Your Wishlist — Sachin Family Salon" },
      { property: "og:description", content: "Your saved hair patches and wigs." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWish, add, signedIn } = useCart();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-display text-4xl md:text-5xl">Your wishlist</h1>
        {!signedIn ? (
          <div className="mt-10 rounded-2xl border border-border p-12 text-center">
            <p className="text-muted-foreground">Sign in to see and save your favourite products.</p>
            <Link to="/auth" className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground">Sign in</Link>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border p-12 text-center">
            <p className="text-muted-foreground">Nothing saved yet. Tap the heart on any product.</p>
            <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground">Explore products</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((w) => (
              <div key={w.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={w.image_url} alt={w.name} className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <Link to="/product/$slug" params={{ slug: w.slug }} className="text-sm font-semibold">{w.name}</Link>
                  <p className="mt-1">{formatINR(w.price)}</p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => add(w)} className="flex-1 rounded-lg bg-primary py-2.5 text-xs text-primary-foreground">Add to bag</button>
                    <button type="button" aria-label="Remove" onClick={() => toggleWish(w)} className="rounded-lg border border-border px-3">
                      <Heart className="size-4 fill-current text-accent" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
