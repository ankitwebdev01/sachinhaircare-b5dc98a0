import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Home, Menu, MessageCircle, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { settingsQuery } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { OWNER_PHONE_DISPLAY, waLink, waMessage } from "@/lib/whatsapp";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About Us" },
  { to: "/branches", label: "Branches" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const { data: settings } = useQuery(settingsQuery);
  const { count, wishlist, signedIn } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: q.trim() } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      {settings?.announcement_active && settings.announcement ? (
        <div className="overflow-hidden bg-accent py-2 text-xs font-medium tracking-[0.18em] text-accent-foreground uppercase">
          <div className="marquee-track flex w-max gap-16 whitespace-nowrap">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-16">
                <span>{settings.announcement}</span>
                <span>{settings.announcement}</span>
                <span>{settings.announcement}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-tight">
            {settings?.salon_name ?? "Sachin Family Salon"}
          </span>
          <span className="mt-1 text-[0.6rem] tracking-[0.34em] text-muted-foreground uppercase">Hair Studio &amp; Wig House</span>
        </Link>

        <form onSubmit={search} className="hidden flex-1 items-center rounded-full border border-border bg-card px-5 md:flex md:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for hair patch, wig, extensions…"
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
          <button type="submit" aria-label="Search">
            <Search className="size-4 text-muted-foreground" />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <a
            href={waLink(settings?.whatsapp, waMessage.booking(settings?.salon_name))}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 lg:flex"
          >
            <span className="rounded-full border border-border p-2">
              <MessageCircle className="size-4 text-primary" />
            </span>
            <span className="leading-tight">
              <span className="block text-[0.65rem] text-muted-foreground">Book Free Consultation</span>
              <span className="text-sm font-semibold text-primary">{settings?.phone || OWNER_PHONE_DISPLAY}</span>
            </span>
          </a>
          <Link to="/auth" aria-label={signedIn ? "Account" : "Sign in"} className="flex flex-col items-center text-[0.62rem]">
            <User className="size-5" />
            <span className="hidden sm:block">{signedIn ? "Account" : "Login"}</span>
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="relative flex flex-col items-center text-[0.62rem]">
            <Heart className="size-5" />
            <span className="hidden sm:block">Wishlist</span>
            {wishlist.length > 0 ? (
              <span className="absolute -top-1.5 right-0 flex size-4 items-center justify-center rounded-full bg-accent text-[0.6rem] text-accent-foreground">
                {wishlist.length}
              </span>
            ) : null}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative flex flex-col items-center text-[0.62rem]">
            <ShoppingBag className="size-5" />
            <span className="hidden sm:block">Cart</span>
            {count > 0 ? (
              <span className="absolute -top-1.5 right-0 flex size-4 items-center justify-center rounded-full bg-accent text-[0.6rem] text-accent-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <button type="button" aria-label="Toggle menu" className="rounded-full border border-border p-2 md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div className="mx-auto hidden max-w-7xl px-5 pb-3 md:block">
        <nav className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--ink)] via-accent to-accent px-4 py-2.5 lg:gap-8">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-accent-foreground/90 transition-colors hover:text-accent-foreground"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.to === "/" ? <Home className="size-3.5" /> : null}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <form onSubmit={search} className="mb-3 flex items-center rounded-full border border-border px-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full bg-transparent py-2.5 text-sm outline-none" />
            <Search className="size-4" />
          </form>
          {nav.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block py-2.5 text-sm tracking-[0.1em] uppercase">
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
